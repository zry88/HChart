/*!
 * Selectric Ϟ v1.6.7 - http://lcdsantos.github.io/jQuery-Selectric/
 *
 * Copyright (c) 2014 Leonardo Santos; Dual licensed: MIT/GPL
 *
 */

;(function ($) {
    var pluginName = 'selectric',
    // Replace diacritics
        _replaceDiacritics = function(s) {
            // /[\340-\346]/g, // a
            // /[\350-\353]/g, // e
            // /[\354-\357]/g, // i
            // /[\362-\370]/g, // o
            // /[\371-\374]/g, // u
            // /[\361]/g, // n
            // /[\347]/g, // c
            // /[\377]/g // y
            var k, d = '40-46 50-53 54-57 62-70 71-74 61 47 77'.replace(/\d+/g, '\\3$&').split(' ');

            for (k in d) {
                if (!d.hasOwnProperty(k))
                    return;
                s = s.toLowerCase().replace(RegExp('[' + d[k] + ']', 'g'), 'aeiouncy'.charAt(k));
            }

            return s;
        },
    // https://gist.github.com/atesgoral/984375
        format = function(f){var a=arguments;return(""+f).replace(/{(\d+|(\w+))}/g,function(s,i,p){return p&&a[1]?a[1][p]:a[i]})},
        init = function(element, options) {
            options = $.extend(true, {
                diy:false,//是否启用自定义选项 zee
                diyOpText:"",//自定义选项的显示问题 zee
                diyInputText:"",//输入框的文字显示 zee
                diySuffix:"",//后缀，比如单位等 zee
                diyFilter:{reg:"",tip:""},//输入框的验证，格式{reg:正则表达式,tip:提示信息} zee
                ignoreCase : false, //忽略大小写
                onOpen: $.noop,
                onClose: $.noop,
                onChange: $.noop,
                onSelect: $.noop,
                maxHeight: 300,
                keySearchTimeout: 500,
                arrowButtonMarkup: '<b class="button">&#x25be;</b>',
                disableOnMobile: true,
                openOnHover: false,
                expandToItemText: false,
                responsive: false,
                showIcon:false,//zw以html形式显示
                isSearch:false,//zw 提供搜索功能
                customClass: {
                    prefix: 'selectric',
                    postfixes: 'Input Items Open Disabled TempShow HideSelect Wrapper Hover Responsive',
                    camelCase: true
                },
                optionsItemBuilder: '{text}' // function(itemData, element, index)
            }, options);
            var
                customClass = options.customClass,
                postfixes = customClass.postfixes.split(' '),
                arrClasses = [],
                currPostfix;

            if (options.disableOnMobile && /android|ip(hone|od|ad)/i.test(navigator.userAgent)) return;

            // generate classNames for elements
            while ((currPostfix = postfixes.shift())){
                var c = customClass.prefix + currPostfix;
                arrClasses.push(customClass.camelCase ? c : c.replace(/([A-Z])/g, "-$&").toLowerCase());
            }

            var $original = $(element),
                _input = $('<input type="text" class="' + arrClasses[0] + '"/>'),
                $wrapper = $('<div class="' + customClass.prefix + '"><p class="label"/>' + options.arrowButtonMarkup + '</div>'),
                $items = $('<div class="' + arrClasses[1] + '" tabindex="-1"></div>'),
                $outerWrapper = $original.data(pluginName, true).wrap('<div>').parent().append($wrapper.add($items).add(_input)),
                $search = $('<div class="mail-input-wrapper"><input type="text" placeholder="搜索" class="writeContactSearch" value=""><span title="搜索" class="mail-input-search"></span></div>'),
                selectItems = [],
                isOpen,
                $label = $('.label', $wrapper),
                $li,
                bindSufix = '.sl',
                $doc = $(document),
                $win = $(window),
                clickBind = 'click' + bindSufix,
                resetStr,
                classOpen = arrClasses[2],
                classDisabled = arrClasses[3],
                tempClass = arrClasses[4],
                selectStr = 'selected',
                selected,
                currValue,
                itemsHeight,
                closeTimer,
                finalWidth,
                optionsLength,
                inputEvt = 'oninput' in _input[0] ? 'input' : 'keyup';

            $original.wrap('<div class="' + arrClasses[5] + '">');

            function _populate() {
                var $options = $original.children(),
                    _$li = '<ul>',
                    selectedIndex = $options.filter(':' + selectStr).index();

                currValue = (selected = ~selectedIndex ? selectedIndex : 0);

                if ( optionsLength = $options.length ) {
                    // Build options markup
                    $options.each(function(i){
                        var $elm = $(this),
                            optionText = $elm.html(),
                            selectDisabled = $elm.prop('disabled'),
                            itemBuilder = options.optionsItemBuilder;


                        selectItems[i] = {
                            value: $elm.val(),
                            text: optionText,
                            slug: _replaceDiacritics(optionText),
                            disabled: selectDisabled
                        };

                        //selectItems[i]['html'] =  $.isFunction(itemBuilder) ? itemBuilder(selectItems[i], $elm, i) : format(itemBuilder, selectItems[i]);

                        _$li += format('<li class="{1}">{2}</li>',
                            $.trim([i == currValue ? selectStr : '', i == optionsLength - 1 ? 'last' : '', selectDisabled ? 'disabled' : ''].join(' ')),
                            (selectItems[i]['html'] = $.isFunction(itemBuilder) ? itemBuilder(selectItems[i], $elm, i) : format(itemBuilder, selectItems[i]))
                        );
                    });
                    //改写下拉选择，实现可自定义输入 zee，20150107 start
                    var selectricWrapper = $items.parent(),//下拉所在div
                         selectHide = selectricWrapper.find("select"),//原始select
                         diyOpText = options.diyOpText||"自定义",//下拉diy显示text
                         diyInputText = options.diyInputText||"请输入合法的数据";//输入框显示text
                    if(options.diy){
                        _$li = _$li.replace('class="last"','class=""') + '<li class="last">'+diyOpText+'</li>';
                        selectHide.append('<option value="diy">diy</option>');
                        selectItems.push({value: "diy",text: "diy",slug: "diy",disabled: false});
                    }
                    //改写下拉选择，实现可自定义输入 zee，20150107 end

                    $items.html(_$li + '</ul>');
                    if(options.isSearch){
                        $search.prependTo($items);
                        $search.off().on('click',function(e){
                            e.stopPropagation();
                            if($(this).hasClass('mail-input-search')){
                                _matchSearch(this.find('input'));
                            }
                        }).on('keyup', 'input', function(e){
                            var key = e.which;
                            if(key === 13){//enter
                                e.stopPropagation();
                                _select(selected, true);
                            }
                            else if(key === 27) {//esc
                                _close(true);
                            }
                            else if ( key > 36 && key < 41 ){
                                _select( key < 39 ? previousEnabledItem() : nextEnabledItem() );
                            }
                            else{
                                _matchSearch($(this));
                            }

                        })
                    }
                    $label.html(options.showIcon ?  selectItems[currValue].html : selectItems[currValue].text);
                }

                $wrapper.add($original).off(bindSufix);

                $outerWrapper.data(pluginName, true).prop('class', [arrClasses[6], $original.prop('class'), classDisabled, options.responsive ? arrClasses[8] : ''].join(' '));

                if ( !$original.prop('disabled') ){
                    // Not disabled, so... Removing disabled class and bind hover
                    $outerWrapper.removeClass(classDisabled).hover(function(){
                        $(this).toggleClass(arrClasses[7]);
                    });

                    // Click on label and :focus on original select will open the options box
                    options.openOnHover && $wrapper.on('mouseenter' + bindSufix, _open);

                    // Toggle open/close
                    $wrapper.on(clickBind, function(e){
                        isOpen ? _close() : _open(e);
                    });

                    function _handleSystemKeys(e){
                        // Tab / Enter / ESC
                        if ( /^(9|13|27)$/.test(e.keyCode || e.which) ) {
                            e.stopPropagation();
                            _select(selected, true);
                        }
                    }

                    _input.prop('disabled', false).off().on({
                        keypress: _handleSystemKeys,
                        keydown: function(e){
                            _handleSystemKeys(e);

                            // Clear search
                            clearTimeout(resetStr);
                            resetStr = setTimeout(function(){
                                _input.val('');
                            }, options.keySearchTimeout);

                            var key = e.keyCode || e.which;

                            // If it's a directional key
                            // 37 => Left
                            // 38 => Up
                            // 39 => Right
                            // 40 => Down
                            if ( key > 36 && key < 41 )
                                _select( key < 39 ? previousEnabledItem() : nextEnabledItem() );
                        },
                        focusin: function(e){
                            // Stupid, but necessary... Prevent the flicker when
                            // focusing out and back again in the browser window
                            _input.one('blur', function(){
                                _input.blur();
                            });

                            isOpen || _open(e);
                        }
                    }).on(inputEvt, function(){
                        if ( _input.val().length ){
                            // Search in select options
                            $.each(selectItems, function(i, elm){
                                if ( RegExp('^' + _input.val(), 'i').test(elm.slug) && !elm.disabled ){
                                    _select(i);
                                    return false;
                                }
                            });
                        }
                    });

                    // Remove styles from items box
                    // Fix incorrect height when refreshed is triggered with fewer options
                   /* $li = $('li', $items.removeAttr('style')).on("click",function(){
                        _select($(this).index(), true);
                    });*/
                    // The second parameter is to close the box after click
                    //改写下拉选择，实现可自定义输入 zee，20150107 start
                    var selectWarp = $items.parent();
                    $li = $('li', $items.removeAttr('style'));
                    $(selectWarp.find("."+arrClasses[1])).on("click", "li", function () {
                        var diyIndex = $(this).index();
                        if (options.diy && diyIndex == (selectItems.length - 1)) {
                            _select(currValue, true);//控制不跳转
                            var diyWarpHtml = '<div class="diyWarp"><input type="text" class="diyInput" style="padding-top: 0;padding-bottom: 0;" value="' + diyInputText + '"/>' +
                                '<div style="float: right"><span class="diyInputAdd diyBtn" type="button" name="add">增加</span>' +
                                '<span class="diyInputCancel diyBtn" type="button" name="cancel">取消</span></div><p class="diyErr" style="color: red;display: none">输入与存在选项相同！</p></div>';
                            var selectric = selectricWrapper.find("." + customClass.prefix), selectricHeight = selectric.css("height");

                            selectric.before(diyWarpHtml);//插入div
                            var diyWarp = selectricWrapper.find(".diyWarp"),
                                diyInput = selectricWrapper.find(".diyInput"),
                                diyFontColor = diyInput.css("color"),
                                diyBtn = selectricWrapper.find(".diyBtn"),
                                diyErr = selectricWrapper.find(".diyErr");
                            diyInput.css({"height":selectricHeight,"line-height":selectricHeight,"color":"#999"});
                            diyBtn.css({"height":selectricHeight,"line-height":selectricHeight});
                            diyInput.focus(function (e) {
                                if (diyInput.val() == diyInputText)diyInput.val("");
                                diyInput.css({"color":diyFontColor});
                            }).blur(function (e) {
                                verifyDiyInput(diyInput);
                            });
                            diyBtn.on("click", function () {
                                if ($(this).attr("name") == "add") {
                                    if (!verifyDiyInput(diyInput))return;
                                    var val = diyInput.val();
                                    val.indexOf(options.diySuffix) == "-1" && ( val += options.diySuffix);//判断是否需要添加单位后缀
                                    for(var i = 0,len = selectItems.length;i < len;i++){
                                        if(val == selectItems[i].value){
                                            diyErr.text("输入与存在选项相同！");
                                            diyErr.show();
                                            return;
                                        }
                                    }
                                    $items.find("li").removeClass("selected");
                                    $items.find('.last').before('<li class="selected">' + val + '</li>');
                                    selectric.find('.label').text(val);
                                    selectItems.splice(selectItems.length-1,0,{value: val, text: val, slug: val, disabled: false});
                                    selectHide.find('option:last').before('<option value="' + val + '">' + val + '</option>');//把自定义数据添加到原始select中
                                    element = selectHide;//更新原始select数据
                                    $li = $('li', $items.removeAttr('style'));//更新
                                    currValue = "";//让 currValue != selected ，从而触发select事件
                                    _select(diyIndex, true);
                                    diyWarp.remove();
                                } else {
                                    diyWarp.remove();
                                }
                                return false;
                            });
                        } else {
                            _select($(this).index(), true);
                        }
                        return false;
                    });
                    //改写下拉选择，实现可自定义输入 zee，20150107 end
                } else
                    _input.prop('disabled', true);
            }

            _populate();

            function verifyDiyInput(diyInput){
                var errDom = $(diyInput).parent().find(".diyErr"),val = $(diyInput).val().replace(options.diyInputText,"");
                if (options.diyFilter.reg !=="" && !options.diyFilter.reg.test(val)) {
                    errDom.text(options.diyFilter.tip);
                    errDom.show();
                    return false;
                }else{
                    errDom.hide();
                    return true;
                }
            }

            function _matchSearch($input){

                var value = $input.val(),
                    isFirst =false;

                if( options.ignoreCase ){
                    value = _toLowerCase( value );
                }

                $('option', $original).each(function (i,v) {
                    var text = $(this).text(),
                        isDisabled;

                    if( options.ignoreCase ){
                        text = _toLowerCase( text );
                    }
                    isDisabled = text.indexOf( value );
                    if( isDisabled == -1 ){
                        isDisabled = false;
                    }else{
                        isDisabled = true;
                    }

                    selectItems[i]['disabled'] = !isDisabled;
                    $(this).prop('disabled', !isDisabled);
                });
                $items.find('.selected').removeClass('selected');
                $items.find('li').each(function (i,v) {
                    var text = $(this).text(),
                        isDisabled;
                    if( options.ignoreCase ){
                        text = _toLowerCase( text );
                    }
                    isDisabled = text.indexOf( value );
                    if( isDisabled == -1 ){
                        isDisabled = false;
                    }else{
                        isDisabled = true;
                    }
                    if(isDisabled && !isFirst){
                        isFirst = true;
                        $(this).addClass('selected');
                    }
                    $(this)[!isDisabled ? 'addClass' : 'removeClass']('disabled');
                });
            }

            function _toLowerCase( text ) {
                if( text ){
                    text = text.toString();
                }else{
                    text = "";
                }
                text = text.toLowerCase();
                return text;
            }

            function _calculateOptionsDimensions(){
                var visibleParent = $items.closest(':visible').children(':hidden'),
                    maxHeight = options.maxHeight;

                // Calculate options box height
                // Set a temporary class on the hidden parent of the element
                visibleParent.addClass(tempClass);

                var itemsWidth = $items.outerWidth(),
                    wrapperWidth = $wrapper.outerWidth() - (itemsWidth - $items.width());

                // Set the dimensions, minimum is wrapper width, expand for long items if option is true
                if ( !options.expandToItemText || wrapperWidth > itemsWidth )
                    finalWidth = wrapperWidth;
                else {
                    // Make sure the scrollbar width is included
                    $items.css('overflow', 'scroll');

                    // Set a really long width for $outerWrapper
                    $outerWrapper.width(9e4);
                    finalWidth = $items.width();
                    // Set scroll bar to auto
                    $items.css('overflow', '');
                    $outerWrapper.width('');
                }

                $items.width(finalWidth).height() > maxHeight && $items.height(maxHeight);

                // Remove the temporary class
                visibleParent.removeClass(tempClass);
            }

            // Open the select options box
            function _open(e) {
                e.preventDefault();
                e.stopPropagation();

                _calculateOptionsDimensions();

                // Find any other opened instances of select and close it
                $('.' + classOpen).removeClass(classOpen);

                isOpen = true;
                itemsHeight = $items.outerHeight();

                // Give dummy input focus
                _input.val('').is(':focus') || _input.focus();


                $doc.on(clickBind, _close).on('scroll' + bindSufix, _isInViewport);
                _isInViewport();

                // Delay close effect when openOnHover is true
                if (options.openOnHover){
                    clearTimeout(closeTimer);
                    $outerWrapper.one('mouseleave' + bindSufix, function(){
                        closeTimer = setTimeout(_close, 500);
                    });
                }

                // Toggle options box visibility
                $outerWrapper.addClass(classOpen);
                _detectItemVisibility(selected);
                if(options.isSearch){
                    $search.find('input').focus().val('');
                    $items.find('.selected').removeClass('selected');
                    $items.find('li').each(function (i,v) {
                        if($label.text()== $(this).text()){
                            $(this).addClass('selected');
                            return false;
                        }
                    });

                }
                options.onOpen(element);
            }

            // Detect is the options box is inside the window
            function _isInViewport() {
                _calculateOptionsDimensions();
                $items.css('top', ($outerWrapper.offset().top + $outerWrapper.outerHeight() + itemsHeight > $win.scrollTop() + $win.height()) ? -itemsHeight : '');
            }

            // Close the select options box
            function _close(e) {
                if ( !e && currValue != selected ){
                    var text = selectItems[selected].text,
                        html =  selectItems[selected].html;

                    // Apply changed value to original select
                    $original
                        .prop('selectedIndex', currValue = selected)
                        .data('value', options.showIcon ? html : text)
                        .trigger('change', [options.showIcon ? html : text, currValue]);

                    options.onChange(element);

                    // Change label text
                    $label.html(options.showIcon ? html : text);
                }


                // Remove click on document
                $doc.off(bindSufix);

                // Remove visible class to hide options box
                $outerWrapper.removeClass(classOpen);

                isOpen = false;

                options.onClose(element,e);


            }

            // Select option
            function _select(index, close) {
                // If element is disabled, can't select it
                if ( !selectItems[selected = index].disabled ){
                    // If 'close' is false (default), the options box won't close after
                    // each selected item, this is necessary for keyboard navigation
                    $li.removeClass(selectStr).eq(index).addClass(selectStr);
                    _detectItemVisibility(index);
                    options.onSelect(selectItems,index);
                    close && _close();
                }
            }

            // Detect if currently selected option is visible and scroll the options box to show it
            function _detectItemVisibility(index) {
                var liHeight = $li.eq(index).outerHeight(),
                    liTop = $li[index].offsetTop,
                    itemsScrollTop = $items.scrollTop(),
                    scrollT = liTop + liHeight * 2;

                $items.scrollTop(
                        scrollT > itemsScrollTop + itemsHeight ? scrollT - itemsHeight :
                            liTop - liHeight < itemsScrollTop ? liTop - liHeight :
                        itemsScrollTop
                );
            }

            function nextEnabledItem(next) {
                if ( selectItems[ next = (selected + 1) % optionsLength ].disabled )
                    while ( selectItems[ next = (next + 1) % optionsLength ].disabled ){}

                return next;
            }

            function previousEnabledItem(previous) {
                if ( selectItems[ previous = (selected > 0 ? selected : optionsLength) - 1 ].disabled )
                    while ( selectItems[ previous = (previous > 0 ? previous : optionsLength) - 1 ].disabled ){}

                return previous;
            }


            $original.on({
                refresh: _populate,
                destroy: function() {
                    // Unbind and remove
                    $items.add($wrapper).add(_input).remove();
                    $original.removeData(pluginName).removeData('value').off(bindSufix + ' refresh destroy open close').unwrap().unwrap();
                },
                open: _open,
                close: _close
            });
        };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function(args, options) {
        return this.each(function() {
            if ( !$(this).data(pluginName ))
                init(this, args || options);
            else if ( ''+args === args )
                $(this).trigger(args);
        });
    };
}(jQuery));
