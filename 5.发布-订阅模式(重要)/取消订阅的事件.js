const event = {
    clientList: {},
    listen(key, fn) {
        !this.clientList[key] && (this.clientList[key] = [])
        this.clientList[key].push(fn)
    },
    trigger(key, ...args) {
        const fns = this.clientList[key]
        if (!fns || fns.length === 0) {
            return false
        }
        for(let i = 0, fn; fn = fns[i++];) {
            fn.apply(this, args)
        }
    },
    remove(key, fn) {
        const fns = this.clientList[key]
        if (!fns) {
            return false
        }
        if (!fn) { // 如果没有传入具体的回调函数，表示需要取消key对应消息的所有订阅
            fns.length = 0
            return false
        }
        for (let l = fns.length - 1; l >= 0; l--) { // 反向遍历
            const _fn = fns[l];
            if (_fn === fn) {
                fns.splice(l, 1) // 函数订阅者的回调
            }
        }
    }
}

const installEvent = function(obj) {
    for(let i in event) {
        obj[i] = event[i]
    }
}

const salesOffices = {}
let fn1, fn2;




installEvent(salesOffices)

salesOffices.listen('squareMeter88', fn1 = price => { // 小明订阅消息
    console.log('价格=' + price)
})

salesOffices.listen('squareMeter88', fn2 = price => { // 小红订阅消息
    console.log('价格hhh' + price)
})


salesOffices.remove('squareMeter88', fn2)
salesOffices.trigger('squareMeter88', 2000000)