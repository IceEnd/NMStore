var page = 0;

//清除cookie
function clearCookie(array) {
    for (i in array) {
        $.removeCookie(array[i], { path: '/' });
    }
}

$('#logout').click(function () {
    clearCookie(['user_id', 'username', 'user_type', 'store_id', 'car']);
    window.location.reload();
});

// $('#more-btn').click(function () {
//     page++;
//     $.ajax({
//         type: 'POST',
//         url: '/storema/morechat',
//         dataType: 'json',
//         traditional: true,
//         data: {
//             "page": page
//         },
//         success: function (data) {
//             addChatItem(data.chat);
//         },
//         error: function (xhr, errorType, error) {
//             alert('网络繁忙，请稍后再试...');
//         }
//     });
// });


// function addChatItem(chat) {
//     if (chat.length == 0) {
//         $('#more-btn').text('加载到底了');
//     }
//     else {
//         for (item in chat) {
//             $('#chat_body').append('<tr><td class="col-sm-3">' + chat[item].chat_id + '</td><th class="col-sm-3">' +
//                 chat[item].username + '</th><th class="col-sm-3"><a href="/chat/' + chat[item].room_id + '" target="_blank">' +
//                 '<span class="glyphicon glyphicon-comment" aria-hidden="true"></span></a></th>' +
//                 '<th class="col-sm-3"><a class="delete_a" data-chat="' + chat[item].chat_id + '">删除</a></th></tr>');
//         }
//         if (chat.length <= 40) {
//             $('#more-btn').text('加载到底了');
//         }
//     }
// }

//删除会话
$('#chat_body').on('click', '.delete_a', function () {
    var chat_id = $(this).attr('data-chat');
    var chat_tr = $(this).parents('tr');
    $.ajax({
        url: '/storema/delchat',
        type: 'POST',
        dataType: 'json',
        traditional: true,
        data: {
            "chat_id": chat_id
        },
        success: function (data) {
            switch (data.flag) {
                case 0:
                    alert('删除成功');
                    chat_tr.remove();
                    break;
                default:
                    alert('网络繁忙，请稍后再试...');
                    break;
            }
        },
        error: function (xhr, errorType, error) {
            alert('网络繁忙，请稍后再试...');
        }
    });
});

setInterval(function () {
    window.location.reload();
},30000);