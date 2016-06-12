/**
 * 系统核心类
 * author: YuRonghui
 * create: 2016-6-8
 * update: 2016-6-8
 */
define([
    'underscore',
], function(_) {
    var HFramework = function(option) {
        var _self = this;
        _self.version = '0.0.1';
        _self.config = {
            IS_DEBUG: true, //开启调试输出
            HAS_ANIMATE: false,
        };
        _.extend(_self.config, option);
        // 实例索引
        _self.instances = {};
        var slice = Array.prototype.slice;

        // 重写调试输出方法
        _self.Debugger = function() {
            debug = {};
            if (!window.console) return function() {}
            if (_self.config.IS_DEBUG) {
                for (var m in console) {
                    if (typeof console[m] == 'function') {
                        debug[m] = console[m].bind(window.console);
                    }
                }
            } else {
                for (var m in console) {
                    if (typeof console[m] == 'function') {
                        debug[m] = function() {};
                    }
                }
            }
        };
        _self.Debugger();

        // 事件(来自Backbone)
        var Events = _self.Events = {};
        var eventSplitter = /\s+/;
        var eventsApi = function(iteratee, events, name, callback, opts) {
            var i = 0,
                names;
            if (name && typeof name === 'object') {
                if (callback !== void 0 && 'context' in opts && opts.context === void 0) opts.context = callback;
                for (names = _.keys(name); i < names.length; i++) {
                    events = eventsApi(iteratee, events, names[i], name[names[i]], opts);
                }
            } else if (name && eventSplitter.test(name)) {
                for (names = name.split(eventSplitter); i < names.length; i++) {
                    events = iteratee(events, names[i], callback, opts);
                }
            } else {
                events = iteratee(events, name, callback, opts);
            }
            return events;
        };
        Events.on = function(name, callback, context) {
            return internalOn(this, name, callback, context);
        };
        var internalOn = function(obj, name, callback, context, listening) {
            obj._events = eventsApi(onApi, obj._events || {}, name, callback, {
                context: context,
                ctx: obj,
                listening: listening
            });

            if (listening) {
                var listeners = obj._listeners || (obj._listeners = {});
                listeners[listening.id] = listening;
            }

            return obj;
        };
        Events.listenTo = function(obj, name, callback) {
            if (!obj) return this;
            var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
            var listeningTo = this._listeningTo || (this._listeningTo = {});
            var listening = listeningTo[id];
            if (!listening) {
                var thisId = this._listenId || (this._listenId = _.uniqueId('l'));
                listening = listeningTo[id] = {
                    obj: obj,
                    objId: id,
                    id: thisId,
                    listeningTo: listeningTo,
                    count: 0
                };
            }
            internalOn(obj, name, callback, this, listening);
            return this;
        };
        var onApi = function(events, name, callback, options) {
            if (callback) {
                var handlers = events[name] || (events[name] = []);
                var context = options.context,
                    ctx = options.ctx,
                    listening = options.listening;
                if (listening) listening.count++;

                handlers.push({
                    callback: callback,
                    context: context,
                    ctx: context || ctx,
                    listening: listening
                });
            }
            return events;
        };
        Events.off = function(name, callback, context) {
            if (!this._events) return this;
            this._events = eventsApi(offApi, this._events, name, callback, {
                context: context,
                listeners: this._listeners
            });
            return this;
        };
        Events.stopListening = function(obj, name, callback) {
            var listeningTo = this._listeningTo;
            if (!listeningTo) return this;
            var ids = obj ? [obj._listenId] : _.keys(listeningTo);
            for (var i = 0; i < ids.length; i++) {
                var listening = listeningTo[ids[i]];
                if (!listening) break;
                listening.obj.off(name, callback, this);
            }
            if (_.isEmpty(listeningTo)) this._listeningTo = void 0;
            return this;
        };
        var offApi = function(events, name, callback, options) {
            if (!events) return;
            var i = 0,
                listening;
            var context = options.context,
                listeners = options.listeners;
            if (!name && !callback && !context) {
                var ids = _.keys(listeners);
                for (; i < ids.length; i++) {
                    listening = listeners[ids[i]];
                    delete listeners[listening.id];
                    delete listening.listeningTo[listening.objId];
                }
                return;
            }
            var names = name ? [name] : _.keys(events);
            for (; i < names.length; i++) {
                name = names[i];
                var handlers = events[name];
                if (!handlers) break;
                var remaining = [];
                for (var j = 0; j < handlers.length; j++) {
                    var handler = handlers[j];
                    if (
                        callback && callback !== handler.callback &&
                        callback !== handler.callback._callback ||
                        context && context !== handler.context
                    ) {
                        remaining.push(handler);
                    } else {
                        listening = handler.listening;
                        if (listening && --listening.count === 0) {
                            delete listeners[listening.id];
                            delete listening.listeningTo[listening.objId];
                        }
                    }
                }
                if (remaining.length) {
                    events[name] = remaining;
                } else {
                    delete events[name];
                }
            }
            if (_.size(events)) return events;
        };
        Events.once = function(name, callback, context) {
            var events = eventsApi(onceMap, {}, name, callback, _.bind(this.off, this));
            return this.on(events, void 0, context);
        };
        Events.listenToOnce = function(obj, name, callback) {
            var events = eventsApi(onceMap, {}, name, callback, _.bind(this.stopListening, this, obj));
            return this.listenTo(obj, events);
        };
        var onceMap = function(map, name, callback, offer) {
            if (callback) {
                var once = map[name] = _.once(function() {
                    offer(name, once);
                    callback.apply(this, arguments);
                });
                once._callback = callback;
            }
            return map;
        };
        Events.trigger = function(name) {
            if (!this._events) return this;
            var length = Math.max(0, arguments.length - 1);
            var args = Array(length);
            for (var i = 0; i < length; i++) args[i] = arguments[i + 1];
            eventsApi(triggerApi, this._events, name, void 0, args);
            return this;
        };
        var triggerApi = function(objEvents, name, cb, args) {
            if (objEvents) {
                var events = objEvents[name];
                var allEvents = objEvents.all;
                if (events && allEvents) allEvents = allEvents.slice();
                if (events) triggerEvents(events, args);
                if (allEvents) triggerEvents(allEvents, [name].concat(args));
            }
            return objEvents;
        };
        var triggerEvents = function(events, args) {
            var ev, i = -1,
                l = events.length,
                a1 = args[0],
                a2 = args[1],
                a3 = args[2];
            switch (args.length) {
                case 0:
                    while (++i < l)(ev = events[i]).callback.call(ev.ctx);
                    return;
                case 1:
                    while (++i < l)(ev = events[i]).callback.call(ev.ctx, a1);
                    return;
                case 2:
                    while (++i < l)(ev = events[i]).callback.call(ev.ctx, a1, a2);
                    return;
                case 3:
                    while (++i < l)(ev = events[i]).callback.call(ev.ctx, a1, a2, a3);
                    return;
                default:
                    while (++i < l)(ev = events[i]).callback.apply(ev.ctx, args);
                    return;
            }
        };

        Events.bind = Events.on;
        Events.unbind = Events.off;

    };
    HFramework.prototype = {
        // 全局配置
        option: function(option) {
            if (option) _.extend(this.config, option);
        },
        // 创建实例
        create: function(option) {
            var defaults = {
                id: '',
                type: '',
                class: null,
                isClean: false,
                options: null,
            };
            if (option) _.extend(defaults, option);
            var id = defaults.id,
                type = defaults.type || this.type,
                theClass = defaults.class;
            if(!id || !type || !theClass){
                debug.error('类配置参数有误,', 'id:' + id, ' ,type:' + type, ' ,class:' + theClass);
                return null;
            }
            // console.warn(type, id, this);
            var context = this.context || this;
            context.instances = context.instances || {};
            context.instances[type] = context.instances[type] = {};
            var instances = context.instances[type];
            if (instances[id]) {
                if (defaults.isClean) {
                    instances[id] = null;
                    delete instances[id];
                }
            }
            instances[id] = instances[id] || new (defaults.class)(defaults.options, context);
            // console.warn(context);
            return instances[id];
        },
        getView: function(id, type){
            return this.context.instances[type || 'view'][id] || null;
        }
    };
    // 实例化框架
    var HF = window.HF = new HFramework();

    // 重写继承方法，增加调用父类方法parent
    var extend = function(protoProps, staticProps) {
        var parent = this;
        var child;
        if (protoProps && _.has(protoProps, 'constructor')) {
            child = protoProps.constructor;
        } else {
            child = function() {
                return parent.apply(this, arguments);
            };
        }
        _.extend(child, parent, staticProps);
        var Surrogate = function() {
            this.constructor = child;
        };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate;
        if (protoProps) {
            _.extend(child.prototype, protoProps);
            _.each(child.prototype, function(val, key) {
                if (typeof val == 'function') {
                    val.__name = key;
                    val.__owner = parent;
                }
            });
        }
        child.prototype.create = HF.create;
        child.prototype.getView = HF.getView;
        child.prototype.parent = function() {
            var method = arguments.callee.caller,
                args = child.prototype[method.__name].arguments;
            return method.__owner.prototype[method.__name].apply(this, arguments);
        };
        child.__super__ = parent.prototype;
        return child;
    };
    // 自定义扩展类
    var Base = HF.Base = function(option) {
        this.initialize.apply(this, arguments);
    };
    _.extend(Base.prototype, HF.Events, {
        initialize: function() {},
    });
    HF.Base.extend = extend;

    return HF;
});