var username = $.cookie('username');
var store_id = getQueryStore();
var user_id = $.cookie('user_id');

var socket = io('http://localhost:3000');

socket.on('connect', function () {
    
    socket.emit('join',{
        username:username,
        store_id:store_id,
        user_id:user_id
    });
    
    socket.on('join', function (message) { 
        $('#messages').append('<li class="log">' + message.data + '</li>');
    });

    socket.on('new message', function (data) {
        $('#messages').append('<li><a>'+data.username+'</a>:' + data.message + '</li>');
    })

    socket.on('disconnect', function () {
        $('#messages').append('<li class="log">Disconnected</li>');
    });
});

socket.on('sys',function (data) {
    $('#messages').append('<li class="log">' + data + '</li>');
});

//发送
$('#inputMessage').keypress(function (event) {
    if (event.which == 13) {
        event.preventDefault();
        socket.emit('new message', {
            username:username,
            message:$('#inputMessage').val()
        });
        $('#messages').append('<li><a>'+username+'</a>:' + $('#inputMessage').val() + '</li>');
        $('#inputMessage').val('');
    }
});

function getQueryStore() {
    var str = window.location.href.match(/s\d+/g)[0];
    str = str.substring(1,str.length);
    return str;
}