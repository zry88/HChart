/**
 * 编辑视图基类
 * @author: yrh
 * @create: 2015/2/5
 * @update: 2016/3/29
 */
define([
    'lib/core/view/View',
], function(BaseView) {
    var View = BaseView.extend({
        initialize: function(option) {
            this.parent(option);
            this.isReset = true;    //是否重置表单
            this.isSended = false;
            if(!this.model) return false;
            this.model = typeof this.model === 'function' ? (new this.model(this.options)) : this.model;
            var tplOption = $.extend({}, this.model.attributes || {}, this.options || {});
            this.$el.html(this.template(tplOption));
            this.rendAll();
        },
        rendAll: function() {
            return this;
        },
        /*
         * 序列化表单
         */
        serializeJson: function(formEl) {
            var data = {},
                formEl = formEl instanceof jQuery ? formEl : $(formEl);
            var array = formEl.serializeArray();
            $(array).each(function() {
                data[this.name] = this.value;
            });
            return data;
        },
        /*
         * 提交表单
         */
        submitForm: function(formEl) {
            if (this.isSended) return false;
            this.isSended = true;
            if(formEl.currentTarget) formEl = $(formEl.currentTarget);
            var that = this,
                modelData = this.checkData(this.serializeJson(formEl), formEl);
            if (!modelData) return false;
            this.sendData(modelData, formEl);
            return false;
        },
        //检验数据
        checkData: function(data, formEl) {
            return data;
        },
        // 发送数据
        sendData: function(data, formEl) {
            var that = this;
            this.model.create(data, {
                apiName: 'create',
                success: function(model, response) {
                    that.success(model, response, formEl);
                },
                error: function(model, errorMsg) {
                    that.error(model, errorMsg, formEl);
                }
            });
        }
    });
    return View;
});
