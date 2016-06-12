/*
 * 路由基类
 * @author: YuRonghui
 * @create: 2015/1/29
 * @update: 2016/1/30
 */
define([
    'lib/core/Hby'
], function(Hby) {
    var AppRouter = Hby.Router.extend({
    	initialize: function(option) {
            this.parent(option);
        }
    });
    return AppRouter;
});