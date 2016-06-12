require.config({
    baseUrl: 'js/',
    urlArgs: 'v=' + (new Date()).getTime(),
    paths: {
        underscore: 'lib/vendor/libs/backbone/underscore',
        easeljs: 'lib/vendor/effect/createjs/easeljs-0.8.1.min',
        tweenjs: 'lib/vendor/effect/createjs/tweenjs-0.6.1.min',
        soundjs: 'lib/vendor/effect/createjs/soundjs-0.6.1.min',
        preloadjs: 'lib/vendor/effect/createjs/preloadjs-0.6.1.min',
        movieclip: 'lib/vendor/effect/createjs/movieclip-0.8.1.min',
        webgl: 'lib/vendor/effect/createjs/webgl-0.8.1.min',
    }
});
require(['src/HChart'], function(HChart) {
    var hchart = new HChart({
        canvasEl: 'testCanvas',
        type: 'bar',
        scale: {},
        tooltip: {}
    });
});