define([
    'src/core/View',
], function(BaseView) {
    var App = BaseView.extend({
        initialize: function(option, context) {
            this.parent(option, context);
        },
        draw: function() {
            // HF.stage.update();
        }
    });
    return App;
});
