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
            var options = {
                canvasEl: '', //画布dom
                fps: 60, //帧速
                type: 'line',
                scale: {},
                tooltip: {}
            };
            if (option) _.extend(options, option);
            if (!this.controllers[options.type]) {
                debug.error('没有此类型图表');
                return;
            }
            this.root = this.create({
                id: options.canvasEl,
                type: 'view',
                class: RootView,
                options: options
            });
            this.createController(options);
        },
        createController: function(option) {
            this.create({
            	id: option.type,
            	type: 'controller',
                class: this.controllers[option.type],
                options: option
            });
        },
    });
    return App;
});