var io = require('socket.io')();

var chatDao = require('./dao/chatDao');

io.on('connection', function (socket) {

    var url = socket.request.headers.referer;
    var split_arr = url.split('/');
    var roomid = split_arr[split_arr.length - 1] || 'index';

    socket.on('join', function (data) {     
        chatDao.getChatByRoom(roomid)
            .then(function (result) {
                if(result.length == 0){
                    return chatDao.createChat(data.user_id,data.store_id,roomid,data.username);
                }
                else{
                    return true;
                }
            });
        socket.join(roomid);
        socket.to(roomid).emit('sys', data.username + ' is Connected')
    });

    socket.on('new message', function (data) {
        socket.to(roomid).emit('new message', {
            username: data.username,
            message: data.message
        });
    });
});

exports.listen = function (server) {
    return io.listen(server);
};