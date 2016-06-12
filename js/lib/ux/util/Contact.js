/**
 * 联系人函数库
 */
define(function() {
    var Contact = Hby.ns('Hby.ux.util.Contact', {
        getImageSrc: function(src) {
            if (src) {
                return CONFIG.IMAGE_URI + 'l_' + src;
            } else {
                return '';
            }
        },
        // 按拼音分组
        getPinyinGroup: function(arr, field) {
            _.each(arr, function(val, index) {
                val.pinyin = Hby.util.String.ucFirst(Hby.util.Pinyin.getCamelChars(val[field]).substr(0, 1));
            });
            var theData = arr.sort(function(A, B) {
                var a = A.pinyin,
                    b = B.pinyin;
                if (/^\d/.test(a) ^ /^\D/.test(b)) return a > b ? 1 : (a == b ? 0 : -1);
                return a > b ? -1 : (a == b ? 0 : 1);
            });
            var newArr = _.groupBy(theData, function(item) {
                return item.pinyin;
            });
            return newArr;
        },
    });
    return Contact;
});
