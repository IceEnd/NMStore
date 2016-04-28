var store_goods_page = $('#page-ul li');
var current_page = $('#page-ul').data('current');

//清除cookie
function clearCookie(array) {
    for (i in array) {
        $.removeCookie(array[i]);
    }
}

//初始化
function init() {
    store_goods_page.each(function() {
        if ($(this).data('page') == current_page) {
            $(this).addClass('active');
        }
    });
}

init();

$('#logout').click(function() {
    console.log('sss');
    clearCookie(['user_id', 'username', 'user_type', 'store_id','car']);
    window.location.reload();
});


