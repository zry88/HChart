define([
    'underscore',
    'src/core/Core',
    'src/controllers/Line',
    'src/controllers/Bar',
    'src/views/Root',
    'easeljs',
    'tweenjs'
], function(_, HF, LineController, BarController, RootView) {
    "use strict";
    var App = HF.Base.extend({
        controllers: {
            'line': LineController,
            'bar': BarController,
        },
        initialize: function(option) {
            var that = this;
            this.options = {
                canvasEl: '',   //画布id
                fps: 60,        //帧速
                name: '',       //图表名称
                type: '',       //图表类型
                scale: {},      //坐标尺
                legend: {},     //图例
                tooltip: {},    //提示框
                style: {},      //风格样式
                data: [],       //数据
                mix: undefined //混合图表参数
            };
            if (option) _.extend(this.options, option);
            // 创建画布
            this.root = this.create({
                id: this.options.canvasEl,
                type: 'view',
                class: RootView,
                options: this.options
            });
            if (this.options.mix) {
                // 混合图表
                _.each(this.options.mix, function(val, index) {
                    that.createController(val);
                });
            } else {
                this.createController(this.options);
            }
            console.warn(!parseInt('aaa'));
        },
        // 实例化控制器
        createController: function(option) {
            var theType = option.type;
            if (theType) {
                if (!this.controllers[theType]) {
                    debug.error('没有此类型图表');
                    return;
                }
                this.create({
                    id: theType,
                    type: 'controller',
                    class: this.controllers[theType],
                    options: option
                });
            }
        },

    });
    return App;
});
