const { io } = require('../server');
const { Users } = require('../classes/users');
const { createMessage } = require('../utilities/utilities');

const users = new Users();


io.on('connection', (client) => {


    client.on('enterChat', ( user, callback ) => {

        if( !user.name || !user.room ) {
            return callback({
                error: true,
                message: 'The name/room is mandatory'
            })
        }

        client.join( user.room );

        users.addPerson( client.id, user.name, user.room );

        client.broadcast.to( user.room ).emit('personsList', users.getPersonsPerRoom( user.room ) );

        callback( users.getPersonsPerRoom( user.room ) );

        console.log( user );

    });

    client.on('createMessage', ( data ) => {

        let person = users.getPerson( client.id );

        let message = createMessage( data.name, data.message );
        client.broadcast.to( person.room ).emit('createMessage', message );

    });

    client.on('disconnect', () => {

        let personDeleted = users.deletePerson( client.id );

        client.broadcast.to( personDeleted.room ).emit('createMessage', createMessage('Admin', `${ personDeleted.name } left`));
        client.broadcast.to( personDeleted.room ).emit('personsList', users.getPersonsPerRoom( personDeleted.room) );

    });

    //Private messages
    client.on('messagePrivate', data => {

        let person = users.getPerson( client.id );

        client.broadcast.to( data.to ).emit( 'messagePrivate', createMessage( person.name, data.message ) );

    });

});