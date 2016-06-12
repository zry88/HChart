/**
 * 字符串操作函数库
 */
define(function() {
    var Strings = {
        // 首字母大写
        ucFirst: function(str) {
            var reg = /\b(\w)|\s(\w)/g;
            str = str.toLowerCase();
            return str.replace(reg, function(first) {
                return first.toUpperCase();
            });
        },
        // 全角字符转半角  zee
        toCDB: function(str) {
            var tmp = "";
            for (var i = 0; i < str.length; i++) {
                if (str.charCodeAt(i) > 65248 && str.charCodeAt(i) < 65375) {
                    tmp += String.fromCharCode(str.charCodeAt(i) - 65248);
                } else {
                    tmp += String.fromCharCode(str.charCodeAt(i));
                }
            }
            return tmp
        },
        // 文字过长
        charEllipsis: function(str, len) {
            if (str.length > len) {
                str = str.substr(0, len) + "...";
            }
            return str;
        },
        // 随机颜色值
        getRandomColor: function() {
            return '#' +
                (function(color) {
                    return (color += '0123456789abcdef' [Math.floor(Math.random() * 16)]) && (color.length == 6) ? color : arguments.callee(color);
                })('');
        }
    };
    return Strings;
});
