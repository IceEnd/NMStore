//清除cookie
function clearCookie(array){
    for(i in array){
        $.removeCookie(array[i]);
    }
}

//登出
$('#logout').click(function(){
    clearCookie(['user_id','username','user_type','store_id','store_name','car']); 
    window.location.reload();
});

//添加到购物车
$('#car_btn').click(function () {
    //$.cookie('user_id',data.user_id, { expires: 7 ,path: "/"});
    if($('#number').val() == '0'){
        alert('请选择数目');
        return ;
    }
    if($.cookie('username') && $($.cookie('user_id'))){
        //用户已经登陆,mysql购物车
        var car ={};
        if($.cookie('car')){
            //存在cookie
            car = $.parseJSON($.cookie('car'));
            if(car.hasOwnProperty($('#car_btn').attr('data-goods'))){
                car[$('#car_btn').attr('data-goods')] += parseInt($('#number').val());
            }
            else{
                car[[$('#car_btn').attr('data-goods')]] = parseInt($('#number').val());
            }
        }
        else{
            car[[$('#car_btn').attr('data-goods')]] = parseInt($('#number').val());
        }
        $.ajax({
            type:'POST',
            url:'/goods/addcar',
            dataType:'json',
            traditional: true,
            data:{
                "car":JSON.stringify(car)
            },
            success:function (data){
                if(data){
                    clearCookie(['car']);
                    $('#number').val(0);
                    alert('添加成功');
                }
                else{
                    alert('网络繁忙，请稍后再试...');
                }
            },
            error: function(xhr, errorType, error) {
                alert('网络繁忙，请稍后再试...');
            }
        });
    }
    else{
        //cookie存储
        var car;
        if($.cookie('car')){
            //若cookie存在
            car = $.parseJSON($.cookie('car'));
            if(car.hasOwnProperty($('#car_btn').attr('data-goods'))){
                car[$('#car_btn').attr('data-goods')] += parseInt($('#number').val());
                var temp = JSON.stringify(car);
                $.cookie('car',temp,{ expires: 7 ,path: "/"});
                alert('添加成功');
                $('#number').val(0);
            }
            else{
                car[[$('#car_btn').attr('data-goods')]] = parseInt($('#number').val());
                var temp = JSON.stringify(car);
                $.cookie('car',temp,{ expires: 7 ,path: "/"});
                alert('添加成功');
                $('#number').val(0);
            }
        }
        else{
            //若cookie不存在
            car = '';
            car += '{"'+$('#car_btn').attr('data-goods')+'":'+$('#number').val()+'}';
            $.cookie('car',car,{ expires: 7 ,path: "/"});
            alert('添加成功');
            $('#number').val(0);
        }
    }
});

//立即购买
$('#buy_btn').click(function () {
    if($('#number').val() == 0){
        alert('请选择商品数目');
        return ;
    }
    
    var gid = $('#buy_btn').attr('data-goods');
    var num = $('#number').val();
    window.location.href = '/shopping?gid='+gid+'&num='+num;
});