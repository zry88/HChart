define([
    'src/core/Controller',
    'src/views/Bar',
], function(BaseController, BarView) {
    var App = BaseController.extend({
        initialize: function(option, context) {
            this.parent(option, context);
            HF.Events.trigger('view:root');
            // console.warn('1111111');
            // this.createElement();
        },
        createElement: function() {
            // var views = {
            //     'bar': BarView,
            // };
            // var that = this.options.context;
            // var view = HF.create({
            //     id: 'bar',
            //     type: 'view',
            //     class: views[this.options.type],
            //     options: {
            //         _x: 100,
            //         _y: 100
            //     }
            // });
            // that.stage.addChild(view.el);

            // var view2 = HF.create({
            //     id: 'bar2',
            //     type: 'view',
            //     class: views[this.options.type],
            //     options: {
            //         _x: 200,
            //         _y: 200
            //     }
            // });
            // that.stage.addChild(view2.el);
            // createjs.Tween.get(view.el, { loop: true })
            //     .to({ x: 400 }, 1000, createjs.Ease.getPowInOut(4))
            //     .to({ alpha: 0, y: 75 }, 500, createjs.Ease.getPowInOut(2))
            //     .to({ alpha: 0, y: 125 }, 100)
            //     .to({ alpha: 1, y: 100 }, 500, createjs.Ease.getPowInOut(2))
            //     .to({ x: 100 }, 800, createjs.Ease.getPowInOut(2));
        },
        test: function(data) {
            debug.warn('kkkkkkkkkk', data);
        }
    });
    return App;
});