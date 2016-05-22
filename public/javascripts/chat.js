var username = $.cookie('username');
var store_id = getQueryStore();
var user_id = $.cookie('user_id');

var socket = io('http://localhost:8000');

socket.on('connect', function () {

    $('#messages').append('<li class="log">请等待</li>');

    socket.emit('join', {
        username: username,
        store_id: store_id,
        user_id: user_id
    });

    socket.on('join', function (message) {
        $('#messages').append('<li class="log">' + message.data + '</li>');
    });

    socket.on('new message', function (data) {
        $('#messages').append('<li><a>' + data.username + '</a>:' + data.message + '</li>');
        scrollToBottom();
    })

    socket.on('disconnect', function () {
        $('#messages').append('<li class="log">Disconnected</li>');
    });
});

socket.on('sys', function (data) {
    $('#messages').append('<li class="log">' + data + '</li>');
});

//发送
$('#inputMessage').keypress(function (event) {
    if (event.which == 13) {
        if ($('#inputMessage').val() == "") {
            alert('内容不能为空');
        }
        else {
            event.preventDefault();
            socket.emit('new message', {
                username: username,
                message: $('#inputMessage').val()
            });
            $('#messages').append('<li style="text-align:right;"><a>' + username + '</a>:' + $('#inputMessage').val() + '</li>');
            $('#inputMessage').val('');
            scrollToBottom();
        }

    }
});

//滚动到底部
function scrollToBottom() {
    $('#messages').scrollTop($('#messages')[0].scrollHeight);
}

function getQueryStore() {
    var str = window.location.href.match(/s\d+/g)[0];
    str = str.substring(1, str.length);
    return str;
}