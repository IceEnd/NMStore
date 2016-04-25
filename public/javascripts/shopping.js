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

