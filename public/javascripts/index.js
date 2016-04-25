var page = 0;

//清除cookie
function clearCookie(array){
    for(i in array){
        $.removeCookie(array[i]);
    }
}

$('#logout').click(function(){
    clearCookie(['user_id','username','user_type','store_id','car']); 
    window.location.reload();
});

$('#more-btn').click(function () {
   page++; 
   $.ajax({
       type:'POST',
       url:'/more',
       dataType:'json',
       traditional: true,
       data:{
           "page":page
       },
       success:function (data) {
           addGoodsItem(data.goods);
       },
        error: function(xhr, errorType, error) {
            alert('网络繁忙，请稍后再试...');
        }
   });
});

function addGoodsItem(goods) {
    if(goods.length == 0){
        $('#more-btn').text('加载到底了');
    }
    else{
        var src;
        for(item in goods){
            if(goods[item]['group_concat(b.src)'] != null){
                src = goods[item]['group_concat(b.src)'];
                src = src.split(',')[0];
            }
            else{
                src = '/images/upload/goods.png';
            }
            $('#grid').append('<li class="col-md-3 grid-item"><div class="thumbnail"><a href="/goods?gid='+goods[item].goods_id+
            '"><span><img src="'+src+'" alt="商品图片"></span></a><div class="caption"><h4 class="price">￥'+goods[item].price+
            '</h4><h4 class="index-goods-name"><a href="/goods?gid='+goods[item].goods_id+'">'+goods[item].goods_name+
            '</a></h4><div class="desc_div"><a href="/goods?gid='+goods[item].goods_id+'"><p>'+goods[item].introduce+
            '</p></a></div><div class="index-goods-info"><a href="/store?sid='+goods[item].store_id+'">'+goods[item].name+
            '</a><h6>'+goods[item].goods_source+'</h6><div class="clear"></div></div></div></div></li>');
        }
        if(goods.length <= 40){
            $('#more-btn').text('加载到底了');
        }
    }
}