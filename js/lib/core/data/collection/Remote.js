/*
 * 远程数据集基类
 * @author: yrh
 * @create: 2015/1/29
 * @update: 2016/3/29
 * ===============================
 * 配置参数option: {
 *     urlRoot: '', //根地址
 *     urlType: 1, //1为“/page/1”,2为“?page=1”
 *     totalPages: 1, //总页数
 *     pageSize: 20, //每页记录数
 *     currentPage: 1, //当前页码
 *     pageOffset: 5, //页码偏移量
 *     pageDisplay: 5, //页码显示数
 *     options: { //筛选参数
 *         data: {}
 *     }
 * }
 * //加载数据方法
 * collection.loadData({
 *      reset: true, //重置数据集
 *      data: {    //分页参数  可选
 *          limit: 20,
 *          page: 1
 *      }
 * });
 * ===============================
 */
define([
    'lib/core/data/Collection',
], function(BaseCollection) {
    var AppCollection = BaseCollection.extend({
        initialize: function(models, option, callback) {
            var defaults = {
                reset: true, //重置数据集
                type: 'GET',
                dataType: 'json',
                headers: undefined,
                params: undefined
            };
            this.options = _.extend(defaults, option || {});
            this.parent(models, defaults, callback);
        },
        url: function(dataParams, datatype) {
            var dataParams = dataParams || {},
                newUrl = this.urlRoot || "";
            var urlStr = $.param(dataParams, true);
            if (this.options.type == 'GET') {
                switch (this.urlType) {
                    case 1:
                        newUrl += ((this.urlRoot.indexOf("?") === -1) ? "?" : ((this.urlRoot.indexOf("&") === -1) ? "" : "&")) + urlStr;
                        break;
                    case 2:
                        newUrl += (this.urlRoot.substr(this.urlRoot.length - 1, 1) == "/" ? "" : "/") + urlStr.replace(/=/g, "/").replace(/&/g, "/");
                        break;
                }
                if (datatype == "jsonp") newUrl += ((newUrl.indexOf("?") === -1) ? "?" : "&") + "callback=?";
            }
            return newUrl;
        },
        sync: function(method, model, option) {
            var theUrl = "";
            if (typeof this.url === "function") {
                theUrl = this.url(option.params || {}, option.dataType);
            } else if (typeof this.url !== "undefined") {
                theUrl = this.url;
            }
            option.url = theUrl || "";
            return Hby.sync(method, model, option);
        },
        parse: function(response, option) {
            if (!response) return null;
            if (!response.data && response.data !== null) {
                if(response.length < this.limit) this.isEnd = true;
                return this.filterData(response);
            }
            if(response.data.length < this.limit) this.isEnd = true;
            if (response.totalPages) this.totalPages = response.totalPages;
            if (response.currentPage) this.currentPage = response.currentPage;
            return this.filterData(response.data);
        },
        //修改数据
        filterData: function(data) {
            return data;
        },
        // 请求加载数据
        loadData: function(option) {
            option = option || {};
            this.options = _.extend(this.options, option);
            if(this.options.type == 'POST') this.options.data = this.options.params;
            this.parent(this.options);
        }
    });
    return AppCollection;
});
