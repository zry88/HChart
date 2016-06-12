define([
    'src/core/View',
    'src/views/Bar',
], function(BaseView, BarView) {
    var App = BaseView.extend({
        views: {
            'bar': BarView,
        },
        initialize: function(option, context) {
            this.parent(option, context);
            this.el = new createjs.Stage(this.options.canvasEl);
            createjs.Ticker.setFPS(this.options.fps);
            createjs.Ticker.addEventListener("tick", this.el);

            HF.Events.off(null, null, this);
            HF.Events.on('view:root', this.drawCircle, this);
            // this.draw();
            // HF.Events.trigger('view:test', {'aaa': 1});
        },
        drawCircle: function() {
            var view2 = this.create({
                id: 'bar2',
                class: this.views[this.options.type],
                options: {
                    type: 'bar',
                    _x: 200,
                    _y: 200
                }
            });
            this.el.addChild(view2.el);
            var view = this.create({
                id: 'bar',
                class: this.views[this.options.type],
                options: {
                    type: 'bar',
                    _x: 100,
                    _y: 100
                }
            });
            this.el.addChild(view.el);

            // createjs.Tween.get(view.el, { loop: true })
            //     .to({ x: 400 }, 1000, createjs.Ease.getPowInOut(4))
            //     .to({ alpha: 0, y: 75 }, 500, createjs.Ease.getPowInOut(2))
            //     .to({ alpha: 0, y: 125 }, 100)
            //     .to({ alpha: 1, y: 100 }, 500, createjs.Ease.getPowInOut(2))
            //     .to({ x: 100 }, 800, createjs.Ease.getPowInOut(2));
        },
        // draw: function() {
        //     this.drawCircle();
        // }
    });
    return App;
});