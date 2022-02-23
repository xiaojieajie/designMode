const salesOffices = {} // 定义售楼处

salesOffices.clientList = [] // 缓存列表，存放订阅者的回调函数

salesOffices.listen = function(fn) { // 增加订阅者
    this.clientList.push(fn) // 添加进缓存列表
}

salesOffices.trigger = function() { // 发布消息
    for(let i = 0, fn; fn = this.clientList[i++];) {
        fn.apply(this, arguments) // arguments 是发布消息时带上的参数
    }
}


// 测试

salesOffices.listen((price, squareMeter) => { // 小明订阅消息
    console.log('价格=' + price)
    console.log('squareMeter=' + squareMeter)
})

salesOffices.listen((price, squareMeter) => { // 小红订阅消息
    console.log('价格=' + price)
    console.log('squareMeter=' + squareMeter)
})

salesOffices.trigger(2000000, 88)
salesOffices.trigger(3000000, 110)