define([
    'src/core/Core',
    'src/core/Controller',
    'src/views/Line',
], function(HF, BaseController, LineView) {
    HF.views = {
        'line': LineView,
        // 'bar': Bar,
    };
    var App = BaseController.extend({
        initialize: function(option) {
            
        },
        draw: function() {
            // HF.stage.update();
        }
    });
    return App;
});