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

//警告框自动消失
function alertHide() {
    setTimeout(function() {
        $('.alert').addClass('hide');
    }, 2000);
}

$('.sigin-in-form').submit(function() {
    if ($('.sigin-in-username').val() == '' || $('.sigin-in-pwd').val() == '') {
        $('.login_main').append('<div class="alert alert-warning alert-dismissible login-alert" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Warning!</strong>请输入用户名和密码</div>');
        alertHide();
        return false;
    }
    else {
        //ajax发送数据
        var username = $('.sigin-in-username').val();
        var pwd = $.md5($('.sigin-in-pwd').val());
        var user_type = $('.login_type').val();
        $.ajax({
            type: 'POST',
            url: '/users/mlogin',
            dataType: 'json',
            traditional: true,
            data: {
                username: username,
                pwd: pwd,
                user_type: user_type,
            },
            success: function(data) {
                console.log(data);
                // alert(data);
                if (data.type == 0) {
                    //登录成功
                    alert('登录成功');
                }
                else if (data.type == 1) {
                    //用户名或密码错误
                    //    alert('用户名或密码错误');
                    $('.login_main').append('<div class="alert alert-warning alert-dismissible login-alert" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Warning!</strong>用户名或密码错误</div>');
                    alertHide();
                }
                else {
                    // alert('网络链接错误');
                    $('.login_main').append('<div class="alert alert-warning alert-dismissible login-alert" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Warning!</strong>网络连接错误</div>');
                    alertHide();
                }
            },
            error: function(xhr, errorType, error) {
                // console.log(err);
                // alert('网络连接错误！');
                $('.login_main').append('<div class="alert alert-warning alert-dismissible login-alert" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Warning!</strong>网络连接错误</div>');
                alertHide();
            }
        });
        return false;
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
        alertHide();
        return false;
    }
    else if ($('.sigin-up-pwd').val() != $('.sigin-up-repwd').val()) {
        $('.login_main').append('<div class="alert alert-warning alert-dismissible login-alert" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Warning!</strong>两次密码不一样</div>');
        alertHide();
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
                    //注册成功
                    $('.login_main').append('<div class="alert alert-success alert-dismissible login-alert" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Well done!</strong>注册成功</div>');
                    $(':input', '.sigin-up-form')
                        .not(':button, :submit, :reset, :hidden')
                        .val('')
                        .removeAttr('checked')
                        .removeAttr('selected');
                }
                else if (data.type == 1) {
                    //用户名重复
                    // alert('用户名重复');
                    $('.login_main').append('<div class="alert alert-success alert-dismissible login-alert" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Warning!</strong>用户名重复</div>');
                    alertHide();
                }
                else {
                    //alert('注册失败');
                    $('.login_main').append('<div class="alert alert-success alert-dismissible login-alert" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Warning!</strong>网络错误</div>');
                    alertHide();
                }
            },
            error: function(xhr, errorType, error) {
                //网络错误
                $('.login_main').append('<div class="alert alert-success alert-dismissible login-alert" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Warning!</strong>网络连接错误</div>');
                alertHide();
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
        $('.store-idcard').val() == '' ||
        $('.store-phone').val() == '') {
        $('.login_main').append('<div class="alert alert-warning alert-dismissible login-alert" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Warning!</strong>信息不能为空</div>');
        alertHide();
        return false;
    }
    else if ($('.store-pwd').val() != $('.store-repwd').val()) {
        $('.login_main').append('<div class="alert alert-warning alert-dismissible login-alert" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Warning!</strong>两次密码不一样</div>');
        alertHide();
        return false;
    }
    else {
        //ajax发送数据
        
        return false;
    }
});