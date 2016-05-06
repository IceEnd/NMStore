//清除cookie
function clearCookie(array) {
    for (i in array) {
        $.removeCookie(array[i],{ path: '/' });
    }
}

//登出
$('#logout').click(function () {
    clearCookie(['user_id', 'username', 'user_type', 'store_id', 'store_name', 'car']);
    window.location.reload();
});

//点击购买按钮
$('#pay_btn').click(function () {
    var goods_id = $(this).attr('data-goods');
    var num = $(this).attr('data-num');
    $.ajax({
        type: 'POST',
        url: '/shopping/buy',
        dataType: 'json',
        traditional: true,
        data: {
            "goods_id": goods_id,
            "num": num
        },
        success: function (data) {
            switch (data.type) {
                case 0:
                    alert('购买成功');
                   window.location.href = '/';
                    break;
                case 1:
                    alert('商品已下架');
                    window.location.reload();
                    break;
                case 2:
                    alert('商品货源不足');
                    window.location.reload();
                    break;
                case 3:
                    alert('网络连接错误');
                    break;
            }
        },
        error: function (xhr, errorType, error) {
            alert('网络繁忙，请稍后再试...');
        }
    });
});

