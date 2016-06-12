/**
 * 时间日期操作函数库
 */
define(function() {
    var Dates = {
        isWeek: function(str) {
            var theDay = "日一二三四五六".charAt(new Date(str).getDay());
            return theDay == '六' ? true : false;
        },
        //当前时间
        getTimestamp: function(dateStr) {
            var theDate = dateStr ? new Date(Date.parse(dateStr)) : new Date();
            return Date.parse(theDate) / 1000;
        },
        // 日期互转
        getDateTime: function(theDate, typeStr) {
            // 时间戳转日期
            if (typeof theDate == 'number') {
                if (theDate.toString().length == 7) {
                    theDate = new Date(parseInt(theDate) * 1000);
                }
                if (theDate.toString().length == 13) {
                    theDate = new Date(parseInt(theDate));
                }
            } else {
                theDate = theDate ? new Date(Date.parse(theDate)) : new Date();
            }
            var typeArr = [],
                dateArr = [],
                result = typeStr || 'Y/M/D hh:mm:ss';
            result = result.replace('hh', theDate.getHours() < 10 ? ('0' + theDate.getHours()) : theDate.getHours());
            result = result.replace('mm', theDate.getMinutes() < 10 ? ('0' + theDate.getMinutes()) : theDate.getMinutes());
            result = result.replace('ss', theDate.getSeconds() < 10 ? ('0' + theDate.getSeconds()) : theDate.getSeconds());
            result = result.replace('Y', theDate.getFullYear());
            result = result.replace('M', (theDate.getMonth() + 1) < 10 ? ('0' + (theDate.getMonth() + 1)) : (theDate.getMonth() + 1));
            result = result.replace('D', theDate.getDate() < 10 ? ('0' + theDate.getDate()) : theDate.getDate());
            return result;
        },
        // 将秒数转换成时分秒
        formatSeconds: function(value) {
            var theTime = parseInt(value); // 秒
            var theTime1 = 0; // 分
            var theTime2 = 0; // 小时
            // alert(theTime);
            if (theTime > 60) {
                theTime1 = parseInt(theTime / 60);
                theTime = parseInt(theTime % 60);
                // alert(theTime1+"-"+theTime);
                if (theTime1 > 60) {
                    theTime2 = parseInt(theTime1 / 60);
                    theTime1 = parseInt(theTime1 % 60);
                }
            }
            var result = "" + parseInt(theTime) + "秒";
            if (theTime1 > 0) {
                result = "" + parseInt(theTime1) + "分" + result;
            }
            if (theTime2 > 0) {
                result = "" + parseInt(theTime2) + "小时" + result;
            }
            return result;
        },
        /*
         * 格式化时间  zee
         * yyyy-MM-dd HH:mm:ss E
         * */
        formatDate: function() {
            Date.prototype.format = function(fmt) {
                var o = {
                    'M+': this.getMonth() + 1, //月份
                    'd+': this.getDate(), //日
                    'h+': this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
                    'H+': this.getHours(), //小时
                    'm+': this.getMinutes(), //分
                    's+': this.getSeconds(), //秒
                    'q+': Math.floor((this.getMonth() + 3) / 3), //季度
                    'S': this.getMilliseconds() //毫秒
                };
                var week = {
                    '0': '星期天',
                    '1': '星期一',
                    '2': '星期二',
                    '3': '星期三',
                    '4': '星期四',
                    '5': '星期五',
                    '6': '星期六'
                };
                if (/(y+)/.test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
                }
                if (/(E+)/.test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '/u661f/u671f' : '/u5468') : '') + week[this.getDay() + '']);
                }
                for (var k in o) {
                    if (new RegExp('(' + k + ')').test(fmt)) {
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
                    }
                }
                return fmt;
            };
        },
        // 取前一天
        getBeforeDay: function(dateStr) {
            var theDate = Date.parse(new Date(Date.parse(dateStr))) - 1000 * 60 * 60 * 24;
            return this.getDateTime(theDate, 'Y-M-D');
        },
        // 取下一天
        getAfterDay: function(dateStr) {
            var theDate = Date.parse(new Date(Date.parse(dateStr))) + 1000 * 60 * 60 * 24;
            return this.getDateTime(theDate, 'Y-M-D');
        },
        // 取某月第一天
        getFirstDay: function(year, month) {
            var new_year, new_month;
            if (year.indexOf('-') >= 0) {
                new_year = year.split('-')[0];
                new_month = year.split('-')[1];
            } else {
                new_year = year;
                new_month = month;
            }
            return new_year + '-' + new_month + '-01';
        },
        //获得某月的最后一天
        getLastDay: function(year, month) {
            var new_year, new_month;
            if (year.indexOf('-') >= 0) {
                new_year = year.split('-')[0];
                new_month = year.split('-')[1]++;
            } else {
                new_year = year; //取当前的年份
                new_month = month++; //取下一个月的第一天，方便计算（最后一天不固定）
            }
            if (month > 12) {
                new_month -= 12; //月份减
                new_year++; //年份增
            }
            var new_date = new Date(new_year, new_month, 1); //取当年当月中的第一天
            var lastDay = (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate(); //获取当月最后一天日期
            return new_year + '-' + (new_month < 10 ? ('0' + new_month) : new_month) + '-' + (lastDay < 10 ? ('0' + lastDay) : lastDay);
        },
        //求两个时间的天数差 日期格式为 YYYY-MM-dd
        daysBetween: function(DateOne, DateTwo) {
            var OneMonth = DateOne.substring(5, DateOne.lastIndexOf('-'));
            var OneDay = DateOne.substring(DateOne.length, DateOne.lastIndexOf('-') + 1);
            var OneYear = DateOne.substring(0, DateOne.indexOf('-'));

            var TwoMonth = DateTwo.substring(5, DateTwo.lastIndexOf('-'));
            var TwoDay = DateTwo.substring(DateTwo.length, DateTwo.lastIndexOf('-') + 1);
            var TwoYear = DateTwo.substring(0, DateTwo.indexOf('-'));

            var cha = ((Date.parse(OneMonth + '/' + OneDay + '/' + OneYear) - Date.parse(TwoMonth + '/' + TwoDay + '/' + TwoYear)) / 86400000);
            return Math.abs(cha);
        }
    };
    return Dates;
});
