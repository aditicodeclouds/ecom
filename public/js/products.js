
$( document ).ready(function() {
    $('body').on('change', '#filter_by_category', function() {
        var item = $(this).val();
        window.location.href='/products/'+item;
    });
    $('body').on('change', '.cartQty', function() {alert();
        var qty = $(this).val();
        var cartId = $(this).attr('id');
        window.location.href='/update-cart/'+cartId+'/'+qty;
    });
});