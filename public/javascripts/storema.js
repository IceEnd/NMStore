var imgType;
var store_goods_page = $('#page-ul li');
var current_page = $('#page-ul').data('current');
var modalState = 0;  //0:add 1:update
var preview_div = document.getElementById('preview-div');

//清除cookie
function clearCookie(array) {
    for (i in array) {
        $.removeCookie(array[i],{ path: '/' });
    }
}

//初始化
function init() {
    //设置cookie
    var store_id = $('body').attr('data-store');
    var store_name = $('body').attr('data-name');
    $.cookie('store_id', store_id, { expires: 7, path: '/' });
    store_goods_page.each(function() {
        if ($(this).data('page') == current_page) {
            $(this).addClass('active');
        }
    });
}

init();

$('#goods_tbody').on('click', '.updateGoodsBtn', function() {
    modalState = 1;
    $('#preview-div').children().remove();
    var tr_items = $(this).parents('tr');
    $('#myModalLabel').html('修改信息');
    $('#add-goods-btn').html('确定修改');
    $('#add-goods-btn').attr('data-url', '/storema/upgoods');
    $('#add-goods-btn').attr('data-type', 1);
    $('#add-goods-btn').attr('data-goods', tr_items.find('.goods-id-items').text());
    $('#add-goods-btn').attr('data-tr', tr_items.attr('id'));
    $('#goods-name').attr('disabled', 'disabled');
    $('#goods-name').val(tr_items.find('.goods-name-items').text());
    $('#goods-source').val(tr_items.find('.goods-source-items').text());
    $('#goods-cost').val(tr_items.find('.goods-cost-items').text());
    $('#goods-stock').val(tr_items.find('.goods-stock-items').text());
    $("#goods-introduce").val(tr_items.find('.goods-introduce-items').text());
    $('#goods-price').val(tr_items.find('.goods-price-items').text());
    if (tr_items.attr('data-img')) {
        var imgSrc = tr_items.attr('data-img').split(',');
        for (var i = 0; i < imgSrc.length; i++) {
            var img = document.createElement('img');
            img.src = imgSrc[i];
            preview_div.appendChild(img);
        }
    }
});

//绑定增加库存按钮
$('#goods_tbody').on('click', '.addStockBtn', function() {
    var tr_items = $(this).parents('tr');
    $('#add-stock-stock').text(tr_items.find('.goods-stock-items').text());
    $('#add-stock-btn').attr('data-goods', tr_items.find('.goods-id-items').text());
    $('#add-stock-btn').attr('data-tr', tr_items.attr('id'));
});

//下架按钮事件
$('#goods_tbody').on('click', '.out-sale', function() {
    var tr_items = $(this).parents('tr');
    var goods_id = tr_items.find('.goods-id-items').text();
    var p_td = $(this).parent();
    $.ajax({
        url: '/storema/outsale',
        type: 'POST',
        data: {
            "goods_id":goods_id,
        },
        success: function(data) {
            if (data.type == 0) {
                tr_items.find('a').removeAttr('href');
                tr_items.css({ "cursor": "not-allowed" });
                tr_items.addClass('danger');
                p_td.html('<p>该商品已经下架</p>');
            }
            else {
                alert('网络连接错误，请稍后再试');
            }
        },
        error: function(xhr, errorType, error) {
            alert('网络连接错误，请稍后再试');
        }
    });
});

$('#addGoodsBtn').click(function() {
    if ($('#add-goods-btn').attr('data-type') != 0) {
        $(':input', '#goods-form').val('')
        $('#preview-div').children().remove();
    }
    modalState = 0;
    $('#goods-name').removeAttr('disabled');
    $('#myModalLabel').html('添加商品');
    $('#add-goods-btn').html('添加商品');
    $('#add-goods-btn').attr('data-url', '/storema/addgoods');
    $('#add-goods-btn').attr('data-type', 0);
    $('#add-goods-btn').removeAttr('data-goods');
});

$('#logout').click(function() {
    console.log('sss');
    clearCookie(['user_id', 'username', 'user_type', 'store_id','car']);
    window.location.reload();
});



function setImagePreview(avalue) {
    $('#preview-div').children().remove();
    imgType = [];
    var imageInput = document.getElementById('upload-images');
    var images = imageInput.files;
    if (images.length > 9) {
        alert('最多上传9张图片');
        return;
    }
    //判断是否为图片
    for (var i = 0; i < images.length; i++) {
        if (!(/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(images[i].name))) {
            alert('请上传图片');
            imageInput.value = "";
            return;
        }
        else {
            var img = document.createElement('img');
            img.src = window.URL.createObjectURL(images[i]);
            preview_div.appendChild(img);
        }
    }
}


$('#add-goods-btn').click(function() {
    if ($("#goods-name").val() == "" ||
        $("#goods-source").val() == "" ||
        $('#goods-price').val() == "" ||
        $("#goods-cost").val() == "" ||
        $("#goods-stock").val() == "" ||
        $("#goods-introduce").val() == "") {
        alert('请完善商品信息...');
        return;
    }

    $('#progress-bg').css("display", "block");
    $('#progress').css("display", "block");
    $('#progress-tip').css("display", "block");
    var url_str = $('#add-goods-btn').attr('data-url');

    var formData = new FormData();
    if (modalState == 1) {
        formData.append('goodsId', $("#add-goods-btn").attr('data-goods'));
    }
    formData.append('goodsName', $("#goods-name").val());
    formData.append('goodsSource', $("#goods-source").val());
    formData.append('goodsPrice', $('#goods-price').val());
    formData.append('goodsCost', $("#goods-cost").val());
    formData.append('goodsStock', $("#goods-stock").val());
    formData.append('goodsIntroduce', $("#goods-introduce").val());
    formData.append('imgLength', $('#upload-images')[0].files.length);
    for (var i = 0; i < $('#upload-images')[0].files.length; i++) {
        formData.append('image' + i, $('#upload-images')[0].files[i]);
    }
    var tr_str = '#' + $("#add-goods-btn").attr('data-tr');
    $.ajax({
        url: url_str,
        type: 'POST',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function(data) {
            if (data.type == 0) {
                //新增商品
                if (modalState == 0) {
                    $('#progress-tip').html('添加成功');
                    $(':input', '#goods-form')
                        .not(':button, :submit, :reset, :hidden')
                        .val('')
                        .removeAttr('checked')
                        .removeAttr('selected');
                    $('#preview-div').children().remove();
                    setTimeout(function() {
                        $('#close-modal').click();
                        $('#progress-tip').html('正在连接...');
                        $('#progress-bg').css("display", "none");
                        $('#progress').css("display", "none");
                        $('#progress-tip').css("display", "none");
                    }, 600);
                    var imagesString = '';
                    if (data.images) {
                        imagesString = data.images.join(',');
                    }

                    $('#goods_tbody').prepend('<tr data-img=' + imagesString + '><td><a href="/goods?goodsId=' + data.new_goods.goodsId + '" target="_blank"><p class="goods-id-items">' + data.new_goods.goodsId +
                        '</p></a></td><td><a href="/goods?goodsId=' + data.new_goods.goodsId + '" target="_blank" class="goods-name-items">' + data.new_goods.goodsName + '</a>(<b class="goods-source-items">' + data.new_goods.goodsSource +
                        '</b>)</td><td><p>售价: <a class="goods-price-items">' + data.new_goods.goodsPrice + '</a></p><p>成本: <a class="goods-cost-items">' + data.new_goods.goodsCost +
                        '</a></p><p>库存:<a class="goods-stock-items">' + data.new_goods.goodsStock + '</a></p></td><td><p class="row-04-p goods-introduce-items">' + data.new_goods.goodsIntroduce +
                        '</p></td><td><p>销量:0</p><p>利润:0</td><td><a class="btn btn-default updateGoodsBtn" data-toggle="modal" data-target="#addGoodsModal" role="button">修改</a>'+
                        '<a class="btn btn-default addStockBtn" data-toggle="modal" data-target="#addStockModal" role="button">添货</a>'+
                        '<a class="btn btn-default out-sale" href="#" role="button">下架</a></td></tr>');
                }
                else {
                    //修改商品
                    $('#progress-tip').html('修改成功');
                    setTimeout(function() {
                        $('#close-modal').click();
                        $('#progress-tip').html('正在连接...');
                        $('#progress-bg').css("display", "none");
                        $('#progress').css("display", "none");
                        $('#progress-tip').css("display", "none");
                    }, 1000);
                    $(tr_str).find('.goods-source-items').text($('#goods-source').val());
                    $(tr_str).find('.goods-cost-items').text($('#goods-cost').val());
                    $(tr_str).find('.goods-stock-items').text($('#goods-stock').val());
                    $(tr_str).find('.goods-introduce-items').text($('#goods-introduce').val());
                    $(tr_str).find('.goods-price-items').text($('#goods-price').val());
                    if (data.images.length != 0) {
                        $(tr_str).attr('data-img', data.images.join(','));
                    }
                }
            }
            else {
                $('#progress-tip').html('网络连接错误,稍后再试');
                setTimeout(function() {
                    $('#close-modal').click();
                    $('#progress-tip').html('正在连接...');
                    $('#progress-bg').css("display", "none");
                    $('#progress').css("display", "none");
                    $('#progress-tip').css("display", "none");
                }, 1000);
            }
        },
        error: function(xhr, errorType, error) {
            $('#progress-tip').html('网络连接错误,稍后再试');
            setTimeout(function() {
                $('#close-modal').click();
                $('#progress-tip').html('正在连接...');
                $('#progress-bg').css("display", "none");
                $('#progress').css("display", "none");
                $('#progress-tip').css("display", "none");
            }, 1500);
        }
    });
});


//添加库存按钮
$('#add-stock-btn').click(function() {
    if ($('#add-stock-num').val() == '') {
        alert('请输入添加数量...');
        return;
    }
    var stock = Number($('#add-stock-stock').text());
    stock += Number($('#add-stock-num').val());
    var goods_id = $('#add-stock-btn').attr('data-goods');
    var tr_str = '#' + $("#add-stock-btn").attr('data-tr');
    $.ajax({
        url: '/storema/addstock',
        type: 'POST',
        data: {
            "goods_stock": stock,
            "goods_id": goods_id,
        },
        success: function(data) {
            if (data.type == 0) {
                $(tr_str).find('.goods-stock-items').text(stock);
                $('#add-stock-close').click();
                $('#add-stock-num').val('');
            }
            else {
                alert('网络连接错误，请稍后再试...');
            }
        },
        error: function(xhr, errorType, error) {
            alert('网络连接错误，请稍后再试...');
        }
    });
});