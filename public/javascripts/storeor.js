var store_goods_page = $('#page-ul li');
var current_page = $('#page-ul').data('current');

//清除cookie
function clearCookie(array) {
    for (i in array) {
        $.removeCookie(array[i], { path: '/' });
    }
}

//初始化
function init() {
    store_goods_page.each(function () {
        if ($(this).data('page') == current_page) {
            $(this).addClass('active');
        }
    });
}

init();

$('#logout').click(function () {
    clearCookie(['user_id', 'username', 'user_type', 'store_id', 'car']);
    window.location.reload();
});


//商店取消交易
$('#orders_tbody').on('click', '.cancel_a', function () {
    var item_tr = $(this).parents('tr');
    var order_id = $(this).attr('data-order');
    $.ajax({
        url: '/storema/corder',
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
                    item_tr.find('.order_state span').text('卖家取消');
                    item_tr.find('.order_manager').text($.cookie('username'));
                    item_tr.find('.cancel_a').css({ 'display': 'none' });
                    item_tr.find('.send_a').css({ 'display': 'none' });
                    item_tr.find('.take_a').css({ 'display': 'none' });
                    break;
                case 1:
                    alert('买家已取消');
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


//接单
$('#orders_tbody').on('click', '.take_a', function () {
    var item_tr = $(this).parents('tr');
    var order_id = $(this).attr('data-order');
    $.ajax({
        url: '/storema/torder',
        type: 'POST',
        dataType: 'json',
        traditional: true,
        data: {
            "order_id": order_id
        },
        success: function (data) {
            switch (data.type) {
                case 0:
                    alert('接单成功');
                    item_tr.find('.order_state span').text('已接单');
                    item_tr.find('.option_td').html('<a class="send_a btn btn-default" data-order="' + order_id + '">发货</a>' +
                        '<a class="cancel_a btn btn-default" data-order="' + order_id + '">取消交易</a>');
                    break;
                case 1:
                    alert('买家已取消订单');
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

//发货
$('#orders_tbody').on('click', '.send_a', function () {
    var item_tr = $(this).parents('tr');
    var order_id = $(this).attr('data-order');
    $.ajax({
        url: '/storema/sorder',
        type: 'POST',
        dataType: 'json',
        traditional: true,
        data: {
            "order_id": order_id
        },
        success: function (data){
            switch (data.type){
                case 0:
                    alert('发货成功');
                    item_tr.find('.order_state span').text('已发货');
                    item_tr.find('.option_td').html('');
                    break;
                case 1:
                    alert('买家已取消订单');
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