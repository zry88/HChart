/*
 * 数据集基类
 * @author: YuRonghui
 * @create: 2016/1/6
 * @update: 2016/3/29
 */
define([
    "lib/core/Hby"
], function(Hby) {
    var AppCollection = Hby.Collection.extend({
        key: new Date() * 1,
        hasLoaded: false, //是否加载过
        isLoading: false, //是否加载中
        isEnd: false,   //是否最后页
        urlRoot: '',
        urlType: 1, //1为“?page=1” 只对GET请求有效,2为“/page/1”,
        totalPages: 0, //总页数
        limit: 20, //每页记录数
        currentPage: 1, //当前页码
        pageOffset: 0, //页码偏移量
        pageDisplay: 10, //页码显示数
        initialize: function(models, option, callback) {
            option = option || {};
            this.callback = callback;
            this.key = option.key || this.key || null;
            this.urlRoot = option.urlRoot || this.urlRoot || '';
            this.urlType = option.urlType || this.urlType || 1;
            this.totalPages = option.totalPages || this.totalPages || 1;
            this.limit = option.limit || this.limit || "";
            this.currentPage = option.currentPage || this.currentPage || 1;
            this.pageOffset = option.pageOffset || this.pageOffset || 0;
            this.pageDisplay = option.pageDisplay || this.pageDisplay || 10;
            this.options = _.extend(this.options, option.options || {});
        },
        loadData: function(option) {
            this.isLoading = true;
            var that = this,
                defaults = {
                    reload: false,
                    context: this,
                    success: this.success,
                    error: this.error
                };
             _.extend(defaults, option || {});
            if (!this.hasLoaded || defaults.reload) {
                this.hasLoaded = true;
                this.fetch(defaults);
            }else{
                setTimeout(function(){
                    Hby.Events.trigger(that.key);
                }, 0);
            }
        },
        success: function(collection, response, option) {
            this.isLoading = false;
            if (typeof this.callback == 'function') {
                this.callback(collection, response, option);
            }
        },
        error: function(response, responseText) {
            debug.log("Get data error:" + responseText);
        },
        //下一页
        nextPage: function(option) {
            debug.log("nextPage");
            this.currentPage++;
            this.loadData(option);
        },
        //上一页
        prevPage: function(option) {
            debug.log("prevPage");
            this.currentPage--;
            this.loadData(option);
        }
    });
    return AppCollection;
});
