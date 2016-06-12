/*
 * 视图基类
 * @author: YuRonghui
 * @create: 2015/1/29
 * @update: 2016/1/30
 */
define([
    'lib/core/Hby'
], function(Hby) {
    var BaseView = Hby.View.extend({
        initialize: function(option) {
            option = option || {};
            if(option.el){
                this.$el = option.context ? option.context.$(option.el) : $(option.el);
                this.el = this.$el[0];
            }
            if(!this.template && !option.el){
                this.tpl = option.tpl || this.tpl || '';
                if(option.tpl){
                    if(typeof this.tpl == 'string'){
                        this.template = _.template(this.tpl);
                    }else{
                        if(_.has(this.tpl, "jquery")) this.template = _.template(this.tpl.html());
                    }
                }
            }
            this.options = _.extend(this.options || {}, option.options || {});
        },
    });
    return BaseView;
});