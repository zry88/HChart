/*
 * 布局视图基类
 * @author: yrh
 * @create: 2015/1/29
 * @update: 2015/9/10
 * ===============================
 * 初始化参数options: {
 *     tpl: ''/$('')/'html',    //模板 视图类里有时可不用
 *     regions: {       //布局区域
 *         menu: {      //视图唯一标识符
 *             el: ''/$(''),  //容器选择符，视图类里有时可不用
 *             option: {  //视图自定义参数   在实例化视图传参数有时可不用
 *                 data: {}     //url地址参数  可选
 *             },
 *             view: object/class,  //视图类或实例，必须
 *         },
 *         content: {
 *             el: '',
 *             view: object/class
 *         }
 *         ...
 *     }
 * }
 *
 * 关闭视图按钮html代码配置：data-btn-type="normal/modal" data-target-view="目标视图key"
 * ===============================
 */
define([
    'lib/core/view/View',
], function(BaseView) {
    var View = BaseView.extend({
        initialize: function(option) {
            this.parent(option);
            if (option.regions) {
                this.regions = $.extend(true, {}, option.regions);
            } else {
                return false;
            }
            var that = this;
            this.$el.html(this.template(this.options || {}));
            if (this.regions) {
                for (var key in this.regions) {
                    var theOption = this.regions[key];
                    this.create({
                        key: key,
                        el: theOption.el || '',
                        itemEl: theOption.itemEl || '',
                        pagingEl: theOption.pagingEl || '',
                        context: theOption.context || this, //上下文
                        effect: theOption.effect || {},
                        view: theOption.view || null,
                        options: theOption.options || {},
                        collection: theOption.collection || null,
                        itemView: theOption.itemView || null,
                        insert: theOption.insert || 'html',
                        isClean: theOption.isClean || true,
                        isPart: true,
                        modal: false,
                    });
                }
            }
        }
    });
    return View;
});