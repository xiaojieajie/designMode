const Event = (() => {
    let global = this,
        Event,
        _default = 'default';

    Event = function() {
        let _listen,
            _trigger,
            _remove,
            namespaceCache = {},
            _create,
            find,
            each = function(ary, fn) {
                let ret;
                for (let i = 0, l = ary.length; i < l; i ++) {
                    const n = ary[i]
                    ret = fn.call(n, i, n)
                }
                return ret
            };

            _listen = function(key, fn, cache) {
                if (!cache[key]) {
                    cache[key] = []
                }
                cache[key].push(fn)
            }

            _remove = function(key, fn, cache) {
                if (!cache[key]) {
                    return false
                }
                if (!fn) {
                    cache[key] = []
                    return false
                }
                for (let i = cache[key].length - 1; i >= 0; i--) {
                    if (cache[key][i] === fn) {
                        cache[key].splice(i, 1)
                    }
                }
            }

            _trigger = function(cache, key, ...args) {
                const stack = cache[key]
                if (!stack || !stack.length) {
                    return
                }
                // 写法1
                // return each(stack, () => this.apply(this, args))
                // 写法2
                const that = this
                return each(stack, function() {
                    return this.apply(that, args)
                })
            }

            _create = function(namespace = _default) {
                let cache = {},
                      offlineStack = [] // 离线事件
                const ret = {
                    listen(key, fn, last) {
                        _listen(key, fn, cache)
                        if (offlineStack === null) {
                            return;
                        }
                        if (last === 'last') {
                            offlineStack.length && offlineStack.pop();
                            return
                        }
                        each(offlineStack, function() {
                            this()
                        })
                        offlineStack = null
                    },
                    one(key, fn, last) {
                        _remove(key, null, last)
                    },
                    remove(key, fn) {
                        _remove(key, fn, cache)
                    },
                    trigger(...args) {
                        args.unshift.call(args, cache)
                        const that = this
                        const fn = function() {
                            return _trigger.apply(that, args)
                        }
                        if (offlineStack) {
                            return offlineStack.push(fn)
                        }
                        return fn()
                    }
                }
                return namespace ? 
                      (namespaceCache[namespace] ? namespaceCache[namespace] : namespaceCache[namespace] = ret)
                      : ret
            };

        return {
            create: _create,
            one(key, fn, last) {
                const event = this.create()
                event.one(key, fn, last)
            },
            remove(key, fn) {
                const event = this.create();
                event.remove(key, fn)
            },
            listen(key, fn, last) {
                const event = this.create()
                event.listen(key, fn, last)
            },
            trigger(...args) {
                const event = this.create()
                event.trigger.apply(this, args)
            }
        }
    }
    return Event()
})()

Event.trigger('click', 1)
Event.listen('click', a => {
    console.log(a)
})

Event.create('namespace1').listen('click', a => {
    console.log(a)
})
Event.create('namespace1').trigger('click', 1)

Event.create('namespace2').listen('click', a => {
    console.log(a)
})
Event.create('namespace2').trigger('click', 2)