const Event = (function() {
    let clientList = {},
          listen,
          trigger,
          remove;

    listen = (key, fn) => {
        !clientList[key] && (clientList[key] = [])
        clientList[key].push(fn)
    }

    trigger = (key, ...args) => {
        fns = clientList[key]
        if (!fns || fns.length === 0) {
            return false
        }
        for (let i = 0, fn; fn = fns[i++];) {
            fn.apply(this, args)
        }
    }
    remove = (key, fn) => {
        const fns = clientList[key]
        if (!fns) {
            return false
        }
        if (!fn) {
            fns.length = 0 // 清空fns
            return
        }
        for (let l = fns.length - 1; l >= 0; l--) {
            const _fn = fns[l]
            if (_fn === fn) {
                fns.splice(l, 1)
            }
        }
    }
    return {
        listen,
        trigger,
        remove
    }
})()

Event.listen('squareMeter88', price => { // 小明订阅消息
    console.log('价格=' + price)
})
Event.trigger('squareMeter88', 2000000) // 售楼处发布消息

