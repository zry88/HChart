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
        name: '柱形图',
        scale: {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            data: []
        },
        legend: {
            orient: 'vertical',
            x: 'left',
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        series: [{
            type: 'bar',
            style: {

            },
            data: [
                { value: 335, name: '直接访问' },
                { value: 310, name: '邮件营销' },
                { value: 234, name: '联盟广告' },
                { value: 135, name: '视频广告' },
                { value: 1548, name: '搜索引擎' }
            ]
        }],
    });
    // var hchart2 = new HChart({
    //     canvasEl: 'testCanvas2',
    //     type: 'bar',
    //     scale: {},
    //     tooltip: {}
    // });
});
