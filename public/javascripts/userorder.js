var store_goods_page = $('#page-ul li');
var current_page = $('#page-ul').data('current');

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

//初始化
function init() {
    store_goods_page.each(function () {
        if ($(this).data('page') == current_page) {
            $(this).addClass('active');
        }
    });
}

init();


//用户取消交易
$('.cancel_a').each(function () {
    $(this).bind('click', function () {
        var item_tr = $(this).parents('tr');
        var order_id = $(this).attr('data-order');
        $.ajax({
            url: '/users/corder',
            type: 'POST',
            dataType: 'json',
            traditional: true,
            data: {
                "order_id": order_id
            },
            success: function (data) {
                switch (data.type) {
                    case 0:
                        alert('取消成功');
                        item_tr.find('.order_state span').text('买家取消');
                        item_tr.find('.cancel_a').css({ 'display': 'none' });
                        break;
                    case 1:
                        alert('商品已发货');
                        break;
                    case 2:
                        alert('网络繁忙，请稍后再试...');
                        break;
                }
            },
            error: function (xhr, errorType, error) {
                alert('网络繁忙，请稍后再试...');
            }
        });
    });
});

//确认收货
$('.get_a').each(function () {
    $(this).bind('click', function () {
        var item_tr = $(this).parents('tr');
        var order_id = $(this).attr('data-order');
        $.ajax({
            url: '/users/qorder',
            type: 'POST',
            dataType: 'json',
            traditional: true,
            data: {
                "order_id": order_id
            },
            success: function (data) {
                switch (data.type) {
                    case 0:
                        alert('交易完成');
                        item_tr.find('.order_state span').text('交易完成');
                        item_tr.find('.option_td').html('');
                        break;
                    case 1:
                        alert('商品已发货');
                        break;
                    case 2:
                        alert('网络繁忙，请稍后再试...');
                        break;
                }
            },
            error: function (xhr, errorType, error) {
                alert('网络繁忙，请稍后再试...');
            }
        });
    });
})

