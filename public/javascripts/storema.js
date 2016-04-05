//清楚cookie
function clearCookie(array) {
    for (i in array) {
        $.removeCookie(array[i]);
    }
}

$('#logout').click(function() {
    console.log('sss');
    clearCookie(['user_id', 'username', 'user_type']);
    window.location.reload();
});

function setImagePreview(avalue) {
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
    var formData = new FormData($('#goods-form')[0]);
    $.ajax({
        url: 'storema/addgoods',
        type: 'POST',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function(data) {

        },
        error: function(xhr, errorType, error) {
            alert('网络连接错误...');
        }
    });
});