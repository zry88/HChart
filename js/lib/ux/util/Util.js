/**
 * 业务扩展函数库
 */
define([
    "lib/core/Hby",
    "lib/ux/util/Helper",
    "lib/ux/util/Chart",
    "lib/ux/util/Contact",
    // "lib/ux/util/Qiniu",
    // "lib/ux/util/IM",
    // "lib/ux/util/Permit",
], function(Hby, Helper, Chart, Contact) {
    var Util = Hby.ns('Hby.ux.util', {
        Helper: Helper, //辅助工具
        Chart: Chart, //图表
        Contact: Contact, //联系人
        // Qiniu: Qiniu,   //七牛
        // IM: IM, //聊天
        // Permit: Permit, //权限
    });
    return Util;
});
