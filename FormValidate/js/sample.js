(function($){
    $.formValidate.addRule('asyncPattern', {
        type:'async',
        callback:function(el, success, error){
            $.get('data/pattern.json',{}, function(res){
                var pattern=new RegExp(res);
                if(pattern.test(el.value)){
                    success();
                }else{
                    error('Password need to contain at least uppercase, lowercase and number');
                }
            },'json').fail(function(){
                error('network failed');
            });
        }
    });
    $(function(){
        $('form').formValidate({
            
        });
    });
})(jQuery);