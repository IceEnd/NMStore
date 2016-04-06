//清楚cookie
function clearCookie(array){
    for(i in array){
        $.removeCookie(array[i]);
    }
}

$('#logout').click(function(){
    console.log('sss');
    clearCookie(['user_id','username','user_type','store_id']); 
    window.location.reload();
});