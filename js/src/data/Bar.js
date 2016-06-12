define([
    'src/core/Model',
], function(BaseModel) {
    var App = BaseModel.extend({
        initialize: function(option, context) {
            this.parent(option, context);
        },
    });
    return App;
});