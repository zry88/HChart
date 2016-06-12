define([
    'src/core/Core'
], function(HF) {
    var App = HF.Base.extend({
        type: 'view',
        initialize: function(option, context) {
            this.options = this.options || {};
            this.context = context || this;
            if(option) _.extend(this.options, option);
        },
    });
    return App;
});