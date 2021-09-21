const salesOffices = {} // 定义售楼处

salesOffices.clientList = {} // 缓存列表，存放订阅者的回调函数

salesOffices.listen = function(key, fn) { // 增加订阅者
    if (!this.clientList[key]) { // 如果还没有订阅过此类消息，给该类创建一个缓存列表
        this.clientList[key] = []
    }
    this.clientList[key].push(fn) // 添加进缓存列表
}

salesOffices.trigger = function() { // 发布消息
    const key = Array.prototype.shift.call(arguments), // 取出消息类型
          fns = this.clientList[key]; // 取出该消息对应的回调函数集合

    if (!fns || fns.length === 0) {
        return false;
    }

    for(let i = 0, fn; fn = fns[i++];) {
        fn.apply(this, arguments) // arguments 是发布消息时带上的参数
    }
}


// 测试

salesOffices.listen('squareMeter88', price => { // 小明订阅消息
    console.log('价格=' + price)
})

salesOffices.listen('squareMeter110', price => { // 小红订阅消息
    console.log('价格=' + price)
})

salesOffices.trigger('squareMeter88', 2000000)
salesOffices.trigger('squareMeter110', 3000000)