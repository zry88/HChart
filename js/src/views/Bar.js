define([
    'src/core/View',
], function(BaseView) {
    var App = BaseView.extend({
        initialize: function(option, context) {
            this.parent(option, context);
            this.el = new createjs.Shape();
            // this.el = new createjs.Graphics();
            this.draw();
            // HF.Events.trigger('view:test', {'aaa': 1});
        },
        drawCircle: function() {
            this.el.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
            // console.warn(this.options);
            this.el.x = this.options._x || 100;
            this.el.y = this.options._y || 100;
        },
        drawOther: function() {
            this.el.append(createjs.Graphics.beginCmd);
            var circle = new createjs.Graphics.Circle(0, 0, 30);
            this.el.append(circle);
            var fill = new createjs.Graphics.Fill("red");
            this.el.append(fill);
        },
        draw: function() {
            this.drawCircle();
            // this.drawOther();
        }
    });
    return App;
});
