/**
 * 七牛存储
 */
define(function() {
    var Qiniu = {
        //验证七牛上传路径
        checkQiniuURL: function(url) {
            var re = /dn\-openwinbons\.qbox\.me/g;
            var re1 = /qiniucdn/g;
            return re.test(url) || re1.test(url);
        },

        convertByteUnit: function(size, unit, decimals, direction, targetunit) {
            /**
             * 容量单位计算，支持定义小数保留长度；定义起始和目标单位，或按1024自动进位
             *
             * @param int size,容量计数
             * @param type unit,容量计数单位，默认为字节
             * @param type decimals,小数点后保留的位数，默认保留一位
             * @param type targetUnit,转换的目标单位，默认自动进位
             * @return type 返回符合要求的带单位结果
             */
            var units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'],
                index, targetIndex, i, l = units.length,
                num,
                regFloat = /(^[+-]?\d*(?:\.\d+)?(?:[Ee][-+]?\d+)?)([kKMmGgTtpPeE]?[bB])?$/;
            if (typeof size === 'string') {
                num = size.match(regFloat);
                size = num[1];
                unit = num[2] || unit;
            }
            unit = unit || 'B';
            if (unit) {
                unit = unit.toUpperCase();
                for (i = 0; i < l; i++) {
                    if (unit === units[i]) {
                        index = i;
                    }
                    if (targetunit && (targetunit + '').toUpperCase() === units[i]) {
                        targetIndex = i
                    }
                }
            }
            if (direction === undefined) { //确定转化方向
                if (targetIndex === undefined) {
                    direction = true;
                } else {
                    direction = targetIndex > index;
                }
            }
            size = parseFloat(size);
            while ((direction ? (size >= 1024 && index < l - 1) : (size <= 1024 && index > 0))) {
                size = (direction ? size / 1024 : size * 1024);
                direction ? index++ : index--;
                if (index === targetIndex) break;
            }

            if (decimals) {
                size = size.toFixed(decimals) + units[index];
            } else {
                decimals = decimals || 2;
                size = (size.toFixed(decimals) + '').replace(/\.00/, '') + units[index];
            }
            return size
        },

        checkURL: function(url) {
            var re = /dn\-openwinbons\.qbox\.me/g,
                re1 = /qiniucdn/g;
            return re.test(url) || re1.test(url);
        },
        /**
         * 判断文件是否是图片 zee  20150824
         * */
        isImg: function(name, isExt) {
            var mapExtClass = {
                    bmp: true,
                    gif: true,
                    png: true,
                    jpg: true,
                    jpeg: true
                },
                ext = isExt ? name : this.getExtName(name);
            return (ext !== false && mapExtClass[ext]) ? mapExtClass[ext] : false;
        }

    };
    return Qiniu;
});
