/*
 * 系统框架类
 * @author: yrh
 * @create: 2015/3/17
 * @update: 2015/6/13
 */
define([
    'backbone',
    "slimscroll",
    "toastr"
], function(Backbone, slimScroll, toastr) {
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-bottom-center",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };
    window.Frame = {
        globalVariable: null,
        globalEvents: _.extend({}, Backbone.Events),
        resizePageContent: function() {
            // var stageWidth = $(window).width(),
            //     stageHeight = $(window).height();
            // $('#content > div').css({
            //     width: stageWidth + 'px',
            //     height: stageHeight + 'px'
            // });
        },
        showScroll: function(el, context) {
            var el = el || window.Hby.SCROLL_EL;
            var targetEl = Tool.getEl(el, context);
            targetEl.slimScroll({
                height: '100%'
            });
        },
        // 权限验证
        validate: function(goToPage) {
            var goToPage = goToPage || window.Hby.LOGIN_PAGE;
            if (!window.account.attributes.uid) {
                window.location.hash = goToPage;
                return false;
            }
            return true;
        },
        // 操作提示
        showMsg: function(type, err, context) {
            var typeArr = window.Hby.ERROR_MSG;
            this.showLoading(0);
            if(typeArr[type][err]){
                toastr[type](typeArr[type][err]);
            }else{
                var errStr = err;
                if(_.isObject(err)){
                    errStr = JSON.parse(err.responseText)[0];
                }
                toastr[type](errStr);
            }
        },
        // 表单提示
        formMsg: function(el, type, err, context) {
            var typeArr = window.Hby.ERROR_MSG;
            this.showLoading(0);
            var theEl;
            if(_.has(el, "jquery")){
                theEl = el;
            }else{
                if(typeof el == 'string'){
                    if(context){
                        theEl = context.$(el).length ? context.$(el) : $(el);
                    }else{
                        theEl = $(el);
                    }
                }
            }
            if(typeArr[type][err]){
                theEl.text(typeArr[type][err]).show();
            }else{
                var errStr = err;
                if(_.isObject(err)){
                    errStr = JSON.parse(err.responseText)[0];
                }
                theEl.text(errStr).show();
            }
        },
        // 显示加载进度
        showLoading: function(isShow) {
            var maskEl = $('#loading');
            if (isShow) {
                maskEl.show();
            } else {
                maskEl.hide();
            }
        },
        /*
         * 加载应用模块启动文件
         * yrh
         * 2015/2/5 update 2015-6-29
         */
        loadApp: function(path) {
            var type = path.indexOf("http") >= 0 ? "url" : "app";
            var that = this;
            switch (type) {
                case "app":
                    //加载应用模块入口文件
                    $.ajax({
                        type: "GET",
                        url: path + ".js",
                        dataType: "script",
                        crossDomain: true,
                        cache: false,
                        success: function() {
                            that.showLoading(true);
                        }
                    });
                    // 线程阻塞
                    $.support.cors = true;
                    break;
                case "url":
                    window.open(path, '_blank');
                    break;
            }
        }
    };
    return window.Frame;
});
