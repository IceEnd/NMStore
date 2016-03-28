/**
 * 网页脚本
 * 处理DOM渲染
 */
$('.login-a').click(function() {
    $('.login-action').stop(true, false).animate({ "left": 0 }, 500);
});
$('.sigin-a').click(function() {
    var width = $('.login-action').width() * 0.33;
    $('.login-action').stop(true, false).animate({ "left": -width }, 500);
});
$('.store-a').click(function() {
    var width = $('.login-action').width() * 0.66;
    $('.login-action').stop(true, false).animate({ "left": -width }, 500);
});

$('.sigin-in-form').submit(function() {
    if ($('.sigin-in-username').val() == '' || $('.sigin-in-pwd').val() == '') {
        $('.login_main').append('<div class="alert alert-warning alert-dismissible login-alert" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Warning!</strong>请输入用户名和密码</div>');
        return false;
    }
    else {
        //ajax发送数据

    }
});

//注册为会员
$('.sigin-up-form').submit(function() {
    if ($('.sigin-up-username').val() == '' ||
        $('.sigin-up-pwd').val() == '' ||
        $('.sigin-up-repwd').val() == '' ||
        $('.sigin-up-address').val() == '' ||
        $('.sigin-up-phone').val() == '') {
        $('.login_main').append('<div class="alert alert-warning alert-dismissible login-alert" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Warning!</strong>信息不能为空</div>');
        return false;
    }
    else if ($('.sigin-up-pwd').val() != $('.sigin-up-repwd').val()) {
        $('.login_main').append('<div class="alert alert-warning alert-dismissible login-alert" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Warning!</strong>两次密码不一样</div>');
        return false;
    }
    else {
        //信息填写完全
        var username = $('.sigin-up-username').val();
        // alert(username);
        //使用md5对密码进行加密
        var pwd = $.md5($('.sigin-up-pwd').val());
        // alert(pwd);
        var address = $('.sigin-up-address').val();
        var phone = $('.sigin-up-phone').val();
        //ajax发送数据
        $.ajax({
            type: 'POST',
            url: '/users/mreg',
            dataType: 'json',
            traditional: true,
            data: {
                username: username,
                pwd: pwd,
                address: address,
                phone: phone
            },
            success: function(data) {
                if (data.type == 0) {
                    //跳转页面
                    $('.login_main').append('<div class="alert alert-success alert-dismissible login-alert" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Well done!</strong>注册成功</div>');
                    $(':input', '.sigin-up-form')
                        .not(':button, :submit, :reset, :hidden')
                        .val('')
                        .removeAttr('checked')
                        .removeAttr('selected');
                }
                else if (data.type == 1) {
                    //用户名重复
                    alert('用户名重复');
                }
                else {
                    alert('注册失败');
                }
            },
            error: function(xhr, errorType, error) {
                //网络错误
                alert('注册失败');
            }
        });
        return false;
    }
});

$('.store-form').submit(function() {
    if ($('.store-name').val() == '' ||
        $('.store-username').val() == '' ||
        $('.store-pwd').val() == '' ||
        $('.store-repwd').val() == '' ||
        $('.store-address').val() == '' ||
        $('.store-phone').val() == '') {
        $('.login_main').append('<div class="alert alert-warning alert-dismissible login-alert" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Warning!</strong>信息不能为空</div>');
        return false;
    }
    else if ($('.store-pwd').val() != $('.store-repwd').val()) {
        $('.login_main').append('<div class="alert alert-warning alert-dismissible login-alert" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Warning!</strong>两次密码不一样</div>');
        return false;
    }
    else {
        //ajax发送数据
    }
});