/**
 * 系统工具库
 */
define([
    "lib/core/Hby",
    "lib/core/util/Tool",
    "lib/core/util/Date",
    "lib/core/util/File",
    "lib/core/util/Media",
    "lib/core/util/String",
    "lib/core/util/Store",
    "lib/core/util/Pinyin",
    // "lib/core/util/System",
], function(Hby, UTool, UDate, UFile, UMedia, UString, Store, Pinyin) {
    var Util = Hby.ns('Hby.util', {
        Tool: UTool,
        Date: UDate,
        File: UFile,
        Media: UMedia,
        String: UString,
        Store: Store,
        Pinyin: Pinyin
        // System: USystem
    });
    return Hby.util;
});
