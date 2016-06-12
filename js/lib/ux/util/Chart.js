/**
 * 图表函数库
 */
 define(function() {
    var Chart = Hby.ns('Hby.ux.util.Chart', {
        getColor: function(group, label) {
            var colors = {
                color: [
                '#40c4ff', '#fb7878', '#e3ad2b', '#f14489', '#62d35f',
                '#ff5722', '#1ccac2', '#bf5fca', '#ee433b', '#1dbb6e',
                '#4d5cb7', '#b93f14', '#7e35ec', '#b51b67', '#36b033',
                '#e8d31c', '#139ee4', '#139ee4', '#334bdc', '#4d5cb7'
                ],
                highlight: [
                '#74d2fc', '#feaaaa', '#ffcd54', '#ff6ca7', '#76ef73',
                '#ff8022', '#31e9e1', '#a185e6', '#f97b5e', '#36da8a',
                '#6d7cd6', '#db6238', '#a063fb', '#dd31a2', '#65d64f',
                '#65d64f', '#28b4fa', '#3491fa', '#3463db', '#6d7cd6'
                ],
                gray: [
                '#b6b6b6', '#a2a2a2', '#b7b7b7', '#8a8a8a', '#bcbcbc',
                '#939393', '#b4b4b4', '#858585', '#858585', '#a3a3a3',
                '#626262', '#6a6a6a', '#515050', '#616161', '#9a9a9a',
                '#d2d2d2', '#939393', '#8e8e8e', '#5a5a5a', '#626262'
                ]
            },
            hashIndex = 0,
            result = {};
            if (!label || !group) {
                return {
                    color: colors.color[0],
                    highlight: colors.highlight[0],
                    gray: colors.gray[0],
                };
            }
            this[group] = this[group] || {};
            this[group].color = this[group].color || {};
            this[group].highlight = this[group].highlight || {};
            this[group].gray = this[group].gray || {};
            this[group].length = this[group].length || 0;
            var theColor = this[group].color[label];
            if (theColor) {
                hashIndex = _.indexOf(colors.color, theColor);
                result = {
                    color: theColor,
                    highlight: colors.highlight[hashIndex],
                    gray: colors.gray[hashIndex]
                };
            } else {
                hashIndex = this[group].length % colors.color.length;
                this[group].length++;
                this[group].color[label] = colors.color[hashIndex];
                this[group].highlight[label] = colors.highlight[hashIndex];
                this[group].gray[label] = colors.gray[hashIndex];
                result = {
                    color: colors.color[hashIndex],
                    highlight: colors.highlight[hashIndex],
                    gray: colors.gray[hashIndex]
                };
            }
            return result;
        },
        // 环状图表
        getDoughnutData: function(data, groupName) {
            if (_.isEmpty(data || [])) return [];
            var newData = [],
            that = this;
            _.each(data, function(val, index) {
                var theColor = that.getColor(groupName, val.name);
                if (val.count) {
                    newData.push({
                        id: val.id,
                        value: val.count || 0,
                        color: theColor.color,
                        highlight: theColor.color,
                        label: val.name || ''
                    });
                }
            });
            return newData;
        },
        // 柱状图
        getBarData: function(data) {
            if (_.isEmpty(data || [])) return [];
            var datasets = [],
            newAreaArr = [],
            newDataArr = [],
            areaArr = _.pluck(data, 'name'),
            dataArr = _.pluck(data, 'count');
            _.each(areaArr, function(val, index) {
                var theData = dataArr[index],
                theIndex = _.indexOf(newAreaArr, val);
                if (theIndex >= 0) {
                    newDataArr[theIndex] += theData;
                } else {
                    newAreaArr.push(val);
                    newDataArr.push(theData);
                }
            });
            datasets.push({
                label: '',
                fillColor: "#24b3fa",
                // strokeColor: theColor.strokeColor fbd759,
                highlightFill: "#24b3fa",
                highlightStroke: "#fbd759",
                data: newDataArr
            });
            return {
                labels: newAreaArr,
                datasets: datasets
            };
        },
        // 线形图表数据过滤
        getLineData: function(data, type) {
            if (_.isEmpty(data || [])) return [];
            var allDataArr = [],
            datepoint = {},
            earlyDay = '',
            result = {
                labels: [],
                datasets: [{
                    label: '',
                    strokeColor: "#24b3fa",
                    pointColor: '#fff',
                    pointStrokeColor: "#24b3fa",
                    pointHighlightFill: '#24b3fa',
                    pointHighlightStroke: '#24b3fa',
                    data: []
                }]
            };
            result.datasets[0].data = _.pluck(data, 'count');
            result.labels = _.pluck(data, 'date');
            // 按周
            if (type == 'week') {
                var weekDateArr = [],
                weekDataArr = [],
                weekIndex = 0,
                weekCount = 0;
                for (var i = 0; i < result.datasets[0].data.length; i++) {
                    if (i == 0) earlyDay = result.labels[0];
                    weekCount += (result.datasets[0].data[i] || 0);
                    if ((((i + 1) % 7 == 0) || (i == result.datasets[0].data.length - 1)) && i !== 27) {
                        earlyDay = i != 6 ? Hby.util.Date.getAfterDay(earlyDay) : earlyDay;
                        weekDataArr.push(weekCount);
                        var theLabel = '第' + (weekIndex + 1) + '周';
                        weekDateArr.push(theLabel);
                        datepoint[theLabel] = [earlyDay, result.labels[i]];
                        weekCount = 0;
                        weekIndex++;
                        earlyDay = result.labels[i];
                    }
                }
                result.labels = weekDateArr;
                result.datasets[0].data = weekDataArr;
                result.datasets[0].datepoint = datepoint;
            }else if(type == 'month'){
                    //按月
                    var flag = 0;
                    var lastMonth;
                    var nextMonth;
                    var lastMonthCount = 0;
                    var nextMonthCount = 0;
                    for (var i = 0; i < result.labels.length; i++) {
                        if ((i + 1) < result.labels.length ) {
                            if (new Date(result.labels[i]).getMonth() != new Date(result.labels[i+1]).getMonth() ) {
                                //不同月
                                lastMonth = result.labels[i];
                                nextMonth = result.labels[i+1];
                            }
                        }
                        if (flag == 1) {
                            nextMonthCount+=result.datasets[0].data[i];
                        }else{
                            lastMonthCount+=result.datasets[0].data[i];
                        }
                    }
                    result.datasets[0].datepoint = [[result.labels[0],lastMonth],[nextMonth,result.labels[result.labels.length -1]]];
                    lastMonth = lastMonth.substring(0,lastMonth.lastIndexOf("-"));
                    nextMonth = nextMonth.substring(0,nextMonth.lastIndexOf("-"));
                    result.labels = [lastMonth,nextMonth];
                    result.datasets[0].data = [lastMonthCount,nextMonthCount];
                } else {
                    for (var i = 0; i < result.labels.length; i++) {
                        var theLabel = result.labels[i];
                        if (type == 'day') {
                            datepoint[theLabel] = [theLabel, theLabel];
                        } else {
                            datepoint[theLabel] = [Hby.util.Date.getFirstDay(theLabel), Hby.util.Date.getLastDay(theLabel)];
                        }
                    }
                    result.datasets[0].datepoint = datepoint;
                }
                return result;
            }
        });
return Chart;
});
