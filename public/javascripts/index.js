//清楚cookie
function clearCookie(array){
    for(i in array){
        $.cookie(array[i],null, { expires: -1 });
    }
}

$('#logout').click(function(){
    console.log('sss');
    clearCookie(['user_id','username','user_type']); 
    window.location.reload();
});