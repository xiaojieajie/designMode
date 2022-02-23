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
    }
}

const installEvent = function(obj) {
    for(let i in event) {
        obj[i] = event[i]
    }
}

// 使用

const salesOffices = {}

installEvent(salesOffices)

salesOffices.listen('squareMeter88', price => { // 小明订阅消息
    console.log('价格=' + price)
})

salesOffices.listen('squareMeter110', price => { // 小红订阅消息
    console.log('价格=' + price)
})

salesOffices.trigger('squareMeter88', 2000000)
salesOffices.trigger('squareMeter110', 3000000)