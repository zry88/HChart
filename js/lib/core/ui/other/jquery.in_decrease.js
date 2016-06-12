/**
 * 输入框增减器,可上下键控制输入
 */
(function($) {
    $.fn.varyInputVal = function(options) {
        var defaults = {
            value:0,
            min:null,
            max:null,
            onlyInteger:false,
            up:38,
            down:40,
            left:37,
            right:39,
            shift:16,
            change: function() {}
        };
        var opts = $.extend({},defaults, options),
             html = '<div class="varyLayer"><button type="button" class="decreaseBt">-</button><input value="'+opts.value+'" class="digitInput"/><button type="button" class="increaseBt">+</button></div>';

        return this.each(function(){
            var $this,
                type,
                $increaseBt,
                $decreaseBt,
                $digitInput,
                inputVal,
                convertToDigit,
                changeValue;

            $this = $(this);
            type = $this.attr("type");
            if( type == 'text' ){
                $digitInput = $this;
            }else{
                $this.append(html);
                $increaseBt = $this.find(".increaseBt");
                $decreaseBt = $this.find(".decreaseBt");
                $digitInput = $this.find(".digitInput");
            }

            if( type != 'text' ){
                $increaseBt.off().on("click", function (e) {
                    inputVal = $digitInput.val();
                    inputVal = saveDecimals({
                        onlyInteger : opts.onlyInteger,
                        number : inputVal,
                        $digitInput : $digitInput,
                        $this:$this
                    });
                    if(inputVal || inputVal==0){
                        changeValue(inputVal,1);
                        $this.data('lastValidValue', inputVal);
                    }
                });
                $decreaseBt.off().on("click", function (e) {
                    inputVal = $digitInput.val();
                    inputVal = saveDecimals({
                        onlyInteger : opts.onlyInteger,
                        number : inputVal,
                        $digitInput : $digitInput,
                        $this:$this
                    });
                    if(inputVal || inputVal==0){
                        changeValue(inputVal,-1);
                        $this.data('lastValidValue', inputVal);
                    }
                });
            }

            $digitInput.off("keydown").on("keydown", function ( e ){
                inputVal = $digitInput.val();
                inputVal = saveDecimals({
                    onlyInteger : opts.onlyInteger,
                    number : inputVal,
                    $digitInput : $digitInput,
                    $this:$this
                });
                if(inputVal || inputVal==0){
                    $this.data('lastValidValue', inputVal);
                    if (e.keyCode == opts.up){
                        changeValue(inputVal,1);
                    }else if (e.keyCode == opts.down){
                        changeValue(inputVal,-1);
                    }
                }
            });
            $digitInput.off("keyup").on("keyup", function (e){
                inputVal = $digitInput.val();
                inputVal = saveDecimals({
                    onlyInteger : opts.onlyInteger,
                    number : inputVal,
                    $digitInput : $digitInput,
                    $this:$this
                });
                if(inputVal || inputVal==0){
                    $this.data('lastValidValue', inputVal);
                    if(!e.shiftKey){
                        if (e.keyCode !== opts.up && e.keyCode !== opts.down  && e.keyCode !==opts.left && e.keyCode !==opts.right && e.keyCode !== opts.shift){
                            changeValue(inputVal,0);
                        }
                    }
                }
            });

            changeValue = function(inputVal,creaseVal){
                var floatReg = /\./;
                inputVal +=creaseVal;
                if($.type(opts.min) == 'number' && inputVal<=opts.min){
                    inputVal=opts.min;
                }
                if($.type(opts.max) == 'number' && inputVal>=opts.max){
                    inputVal=opts.max;
                }

                $digitInput.val( inputVal );
                opts.change(inputVal);
            };
        });

        /**
         * 保留小数,不四舍五入
         * @param opts.number 数值 如(15.5 | 15 15.| )
         * @param opts.prec  保留小数位 如(2 代表保留2位)
         * @param opts.complete 小数位不足是否补全 (true|false)
         */
        function saveDecimals (param){
            var result ,
                opts = {
                    number : 0,
                    prec : 2,
                    complete:true
                };
            $.extend(opts,param);

            var integerReg = /^[+-]?\d+$/;
            var digitReg =  /^[+-]?[0-9]*\.?[0-9]*$/;//匹配整数或浮点数
            var pointEndReg = /^[+-]?(\d+\.|\d+\.0+)$/;//匹配以.结尾 或 以0结尾
            if(opts.onlyInteger){
                //不能使浮点数
                if( integerReg.test(opts.number) ){
                    result = parseFloat( opts.number , 10 );
                    return result;
                }else{
                    return fillInputVal(param);
                }
            }else{
                if(digitReg.test(opts.number)){
                    if(pointEndReg.test(opts.number)){
                        return null;
                    }
                    result =  (Number(Number(opts.number).toFixed(2)))*1000/1000;//js小数计算小数点后显示多位小数
                    //result = Math.floor(parseFloat((opts.number) * opts.prec))/opts.prec;
                    /*if(opts.complete) {
                     result = result.toFixed(opts.prec.toString().length -1);
                     result = Math.floor(parseFloat(result * opts.prec))/opts.prec;
                     }*/
                    return result;
                }else{
                    return fillInputVal(param);
                }
            }
        };
        function fillInputVal(param) {
            if( param.number || param.number == 0 ){
                param.$digitInput.val(new Number( param.$this.data('lastValidValue') ) );
            }else{
                param.$digitInput.val("");
            }
            return null;
        }
    };
})(jQuery);