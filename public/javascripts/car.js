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


//删除按钮事件
$('#del-btn').click(function () {
    var checkbox = $('input[name="checkbox"]:checked');
    if(checkbox.length > 0){
        var cars = [];
        checkbox.each(function () {
            cars.push($(this).attr('data-car'));
        });
        console.log(cars);
    }
    //删除购物车
    $.ajax({
        type:'POST',
        url:'/car/del',
        dataType:'json',
        traditional: true,
        data:{
            "cars":cars.join(',')
        },
        success:function (data){
            if(data.type){
                window.location.reload();
            }
            else{
                alert('网络繁忙，请稍后再试...');
            }
        },
        error: function(xhr, errorType, error) {
            alert('网络繁忙，请稍后再试...');
        }
    });
});