/**
 * 下拉选项按钮
 */
(function($) {
    $.fn.chosenDrop = function(options) {
        var defaults = {
            defaultVal:"",
            items : [],
            selectedColor : "#ffffff",//选中项的颜色 仅支持hex颜色(#ffffff)
            levelAlign :"right",//水平居左或居右
            offSet :"0",//偏移量
            syncLabelText :true,//选择后是否同步标签文字
            selected: function(){},
            labelClick:function(){}
        };
        var opts = $.extend({},defaults, options);
        var liHtml = '<li id="" class="operate-row" name=""><div class="f-row-content"></div></li>'
        var wrapHtml = '<span class="chosenDrop"><div class="chosenLabel"><p class="chosen-text"></p><p class="chosen-icon">▼</p></div><div class="f-operate-wrap" style="display: none; top: 31px;"><ul class="f-operate-ul"></ul></div></span>';
        var $this,
            $fOperateUl,
            $chosenDrop,
            $liHtml,
            $fOperateWrap,
            $chosenText,
            target,
            $target,
            curItem;
        var colReg = /^#([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/;
        return this.each(function(){
            $this = $(this);
            $this.append(wrapHtml);

            $chosenDrop = $this.find(".chosenDrop");
            $fOperateWrap = $chosenDrop.find(".f-operate-wrap");
            $fOperateWrap.css(opts.levelAlign,opts.offSet);
            $fOperateUl = $fOperateWrap.find(".f-operate-ul");
            $chosenText = $chosenDrop.find(".chosen-text").text(opts.defaultVal);

            for(var i= 0,len = opts.items.length;i<len;i++){
                $liHtml = $(liHtml);
                curItem = opts.items[i];
                $liHtml.attr("id",curItem["id"]).find(".f-row-content").text(curItem["itemHtml"]);
                $fOperateUl.append($liHtml.prop("outerHTML"));
            }

            $chosenText.off().on("click", function () {
                opts.labelClick();
            });

            $this.find(".chosen-icon").off().on("click", function (e) {
                target = e.target,$target = $(target);
                if($fOperateWrap.css("display") == 'none'){
                    $fOperateWrap.css("display","block");
                }else{
                    $fOperateWrap.css("display","none");
                }
            });

            $(document).off("click.chosenDrop").on("click.chosenDrop", function (e) {
                target = e.target,$target = $(target);
                if(!$target.hasClass("chosen-icon")){
                    $fOperateWrap.css("display","none");
                }
            });

            $this.find(".operate-row").off().on("click", function (e) {
                target = e.target,
                $target = $(target).closest(".operate-row");
                $target.addClass("selected").siblings("li").removeClass("selected");

                /**颜色检验*/
                if(colReg.test(opts.selectedColor)){
                    $target.css("background-color",opts.selectedColor);
                }else{
                    $target.css("background-color","#ffffff");
                }

                if(opts.syncLabelText){
                    $chosenText.text($target.text());
                }
                opts.selected($this, $target);
            });
        });
    };
})(jQuery);