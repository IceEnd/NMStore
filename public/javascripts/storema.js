//清楚cookie
function clearCookie(array) {
    for (i in array) {
        console.log(array[i]);
        $.removeCookie(array[i]);
    }
}

//设置cookie
function setCookie() {
    var store_id = $('body').attr('data-store');
    $.cookie('store_id', store_id, { expires: 7, path: '/' });
}

setCookie();

$('#logout').click(function() {
    console.log('sss');
    clearCookie(['user_id', 'username', 'user_type', 'store_id']);
    window.location.reload();
});

var imgType = [];

function setImagePreview(avalue) {
    imgType = [];
    var imageInput = document.getElementById('upload-images');
    var preview_div = document.getElementById('preview-div');
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

    var formData = new FormData();
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
    $.ajax({
        url: 'storema/addgoods',
        type: 'POST',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function(data) {
            if (data.type == 0) {
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
                }, 1000);
                console.log(data.new_goods);
                $('#goods_tbody').append('<tr><td><a href="/goods?goodsId='+data.new_goods.goodsId+'" target="_blank"><p>'+data.new_goods.goodsId+'</p></a></td><td><a href="/goods?goodsId='+
                data.new_goods.goodsId+'" target="_blank">'+data.new_goods.goodsName+'</a>('+data.new_goods.goodsSource+')</td><td><p>售价: '+
                data.new_goods.goodsPrice+'</p><p>成本: '+data.new_goods.goodsCost+'</p><p>库存: '+data.new_goods.goodsStock+
                '</p></td><td><p class="row-04-p">'+data.new_goods.goodsIntroduce+'</p></td><td><p>销量:0</p><p>利润:0</td><td><a class="btn btn-default" href="#" role="button">修改</a><a class="btn btn-default" href="#" role="button">增加库存</a><a class="btn btn-default" href="#" role="button">下架</a></td></tr>');
               
            }
            else {
                $('#progress-tip').html('网络连接错误,稍后再试');
                setTimeout(function() {
                    $('#close-modal').click();
                    $('#progress-tip').html('正在连接...');
                    $('#progress-bg').css("display", "none");
                    $('#progress').css("display", "none");
                    $('#progress-tip').css("display", "none");
                }, 1500);
            }
        },
        error: function(xhr, errorType, error) {
            alert('网络连接错误...');
        }
    });
});