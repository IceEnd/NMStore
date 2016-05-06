var page = 1;

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


//删除按钮事件
$('#del-btn').click(function () {
    var checkbox = $('input[name="checkbox"]:checked');
    if (checkbox.length > 0) {
        var cars = [];
        checkbox.each(function () {
            cars.push($(this).attr('data-car'));
        });
    }
    //删除购物车
    $.ajax({
        type: 'POST',
        url: '/car/del',
        dataType: 'json',
        traditional: true,
        data: {
            "cars": cars.join(',')
        },
        success: function (data) {
            if (data.type) {
                window.location.reload();
            }
            else {
                alert('网络繁忙，请稍后再试...');
            }
        },
        error: function (xhr, errorType, error) {
            alert('网络繁忙，请稍后再试...');
        }
    });
});

//结算按钮
$('#pay-btn').click(function () {
    var checkbox = $('input[name="checkbox"]:checked');
    if (checkbox.length > 0) {
        var items = [];
        checkbox.each(function () {
            items.push($(this).attr('data-car'));
        });
        $.ajax({
            type: 'POST',
            url: '/car/buy',
            dataType: 'json',
            traditional: true,
            data: {
                "items": items.join(',')
            },
            success: function (data) {
                switch (data.type) {
                    case 0:
                        alert('购买成功');
                        window.location.reload();
                        break;
                    case 1:
                        alert('有商品已下架');
                        window.location.reload();
                        break;
                    case 2:
                        alert('有商品货源不足');
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
    }
    else {
        alert('请选择项目');
    }
});

//加载更多
$('#loadMore').click(function () {
    page++;
    $.ajax({
        type: 'POST',
        url: '/car/more',
        dataType: 'json',
        traditional: true,
        data: {
            "page": page
        },
        success: function (data) {
            addCarsItem(data.items);
        },
        error: function (xhr, errorType, error) {
            alert('网络繁忙，请稍后再试...');
        }
    })
});

function addCarsItem(items) {
    if (items.length == 0) {
        $('#loadMore').text('加载到底了');
    }
    else {
        var src;
        for (i in items) {
            if (items[i].src != null) {
                src = items[i].src;
            }
            else {
                src = '/images/upload/goods.png';
            }
            $('#car_list').append('<tr><td class="col-lg-1 col-md-1"><input class="checkInput" type="checkbox" value=' + items[i].goods_id + '" name="checkbox" data-car="' + items[i].car_id +
                '"></td><td class="col-lg-1 col-md-1"><a href="/goods?gid=' + items[i].goods_id + '">' + items[i].goods_id + '</a></td><td class="col-lg-1 col-md-1"><a href="/goods?gid=' +
                items[i].goods_id + '">' + items[i].goods_name + '</a></td><td class="col-lg-2 col-md-2"><img src="' + src + '" style="max-width:100%;max-height:150px;"></td><td class="col-lg-4 col-md-4">' +
                '<p style="padding: 0 10px;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 4;-webkit-box-orient: vertical;">' + items[i].introduce +
                '</p></td><td class="col-lg-2 col-md-2"><h5 style="display:inline-block;">' + items[i].goods_num + '</h5>*<h5 style="display:inline-block;">' + items[i].goods_num +
                '</h5>=<h5 class="item-price" style="display:inline-block;color:red;">￥' + (parseInt(items[i].price) * parseInt(items[i].goods_num)) + '</h5></td></tr>');
        }
        if (items.length <= 20) {
            $('#loadMore').text('加载到底了');
        }
    }
}

//checkbox绑定时间
function checkboxEvent() {
    $('.checkInput').each(function () {
        $(this).bind('click', function () {
            var total_price = parseFloat($('#total_price').text());
            var str = $(this).parents('tr').find('.item-price').text();
            var price = parseFloat(str.substring(1, str.length));
            if ($(this).is(':checked')) {
                //被选中
                total_price += price;
                $('#total_price').text(total_price);
            }
            else {
                //取消选中
                total_price -= price;
                $('#total_price').text(total_price);
            }
        });
    });
}

checkboxEvent();

