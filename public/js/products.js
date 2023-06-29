
$( document ).ready(function() {
    $('body').on('change', '#filter_by_category', function() {
        var item = $(this).val();
        window.location.href='/products/'+item;
    });
});