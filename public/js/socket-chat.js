var socket = io();

var params = new URLSearchParams( window.location.search );

if( !params.has('name')  || !params.has('room')) {

    window.location = 'index.html';
    throw new Error('The name and room are mandatory');

}

var user = {
    name: params.get('name'),
    room: params.get('room')
}

socket.on('connect', function() {

    console.log('Connected to the server');

    socket.emit('enterChat', user , function( resp ){
        console.log('Users connected',resp);
    });

});

// listen
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
socket.emit('enviarMensaje', {
    usuario: 'Fernando',
    mensaje: 'Hola Mundo'
}, function(resp) {
    console.log('respuesta server: ', resp);
});

// Listen info
socket.on('createMessage', function( message ) {

    console.log('Server:', message );

});

//Listen user changes
//When user enter or leave the chat

socket.on('personList', function( persons ) {
    console.log( persons );
})

//Privates messages
socket.on('messagePrivate', function( message) {
    console.log('Private message',message);
});