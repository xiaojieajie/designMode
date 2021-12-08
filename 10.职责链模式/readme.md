# 职责链模式的定义

使多个对象都有机会处理请求，从而避免请求的发送者和接收者之间的耦合关系，将这些对象连成一条链，并沿着这条链传递该请求，知道有一个对象处理它为止

# 现实中的职责链模式

相信经常坐公交车的小伙伴，一定遇到过这种情况，高峰期的时候，只能从后门上车，然后把羊城通递给前面的人传过去刷卡。

# 实际开发中的职责链模式

假设我们负责一个售卖手机的电商网站，之前交纳过500定金或者是200定价的人，会给予优惠券，500元的会收到100元的优惠券，200元会收到50，而没有支付定金的人只能进入普通购买模式。

下面进入到代码编写

1. orderType：表示订单类型，code为1表示500元定金的订单，为2是200元定金的订单，3为普通用户订单
2. pay：表示用户是否已经支付定金，值为true或者false，有些用户虽然下了500元订单，但是没有付钱，只能降级为普通用户订单
3. stock：表示当前用于普通购买手机库存数量，已经支付过定金的用户不受此限制

```JS
const order = function(orderType, pay, stock) {
    if (orderType === 1) {
        if (pay === true) {
            console.log('得到100元优惠券')
        } else {
            // 没支付定金
            if (stock > 0) {
                // 有库存
                console.log('普通购买，无优惠券')
            } else {
                console.log('库存不足')
            }
        }
    }
    else if (orderType === 2) {
        if (pay === true) {
            console.log('得到100元优惠券')
        } else {
            // 没支付定金
            if (stock > 0) {
                // 有库存
                console.log('普通购买，无优惠券')
            } else {
                console.log('库存不足')
            }
        }
    }
    else if (orderType === 3) {
        if (stock > 0) {
            // 有库存
            console.log('普通购买，无优惠券')
        } else {
            console.log('库存不足')
        }
    }
}
```

order(1, true, 500) // 输出：得到100元优惠券

虽然程序得到了意料之中的结果，但这代码远远算不上一段值得夸奖的代码。不仅难以阅读，而且需要经常进行修改。后面的维护工作无疑是个梦魇。只有最“新手”的程序员才会写出这样的代码（tips：doge不要打我，书中原话）

# 用职责链重构代码

我们把500元订单，200元订单，普通订单拆成3个函数，如果500元订单函数不符合条件，则移交给后面的200元订单，如果200元订单依然不能处理，则继续传递给普通购买订单，代码如下

```JS
const order500 = function(orderType, pay, stock) {
    if (orderType === 1 && pay === true) {
        console.log('100元优惠券')
    } else {
        order200(orderType, pay, stock)
    }
}

const order200 = function(orderType, pay, stock) {
    if (orderType === 2 && pay === true) {
        console.log('50元优惠券')
    } else {
        orderNormal(orderType, pay, stock)
    }
}

const orderNormal = function(orderType, pay, stock) {
    if (stock > 0) {
        console.log('普通购买')
    } else {
        console.log('库存不足')
    }
}


order500(1, true, 500) // 100
order500(1, false, 500) // 普通购买
order500(2, true, 500) // 50
order500(2, false, 500) // 普通购买
order500(3, false, 0) // 库存不足
```

可以看到，执行结果和前面那个巨大的order函数完全一样，但是代码结构清晰了许多。但是！传递请求的代码被耦合在了业务函数之中。

```js
const order500 = function(orderType, pay, stock) {
    if (orderType === 1 && pay === true) {
        console.log('100元优惠券')
    } else {
        order200(orderType, pay, stock)
        // order200和order500被耦合到了一起
    }
}

```

这是违反开放-封闭原则的，如果有一天我们要增加300元预定或者去掉200元预定，就必须改动这些业务函数内部。

# 灵活可拆分的职责链节点

如果某个节点不能处理请求，则返回一个特点的字符串'nextSuccessor'来表示该请求需要继续往后传递：

```JS
const order500 = function(orderType, pay, stock) {
    if (orderType === 1 && pay === true) {
        console.log('100元优惠券')
    } else {
        return 'nextSuccessor'
    }
}

const order200 = function(orderType, pay, stock) {
    if (orderType === 2 && pay === true) {
        console.log('50元优惠券')
    } else {
        return 'nextSuccessor'
    }
}

const orderNormal = function(orderType, pay, stock) {
    if (stock > 0) {
        console.log('普通购买')
    } else {
        console.log('库存不足')
    }
}


order500(1, true, 500) // 100
order500(1, false, 500) // 普通购买
order500(2, true, 500) // 50
order500(2, false, 500) // 普通购买
order500(3, false, 0) // 库存不足
```

接下来需要把函数包装进职责链节点，我们定义一个构造函数Chain，在new Chain的时候传递的参数即为需要被包装的函数，同时它还拥有一个实例属性this.successor,表示在链中的下一个节点

```js
class Chain {
    constructor(fn) {
        this.fn = fn
        this.successor = null;
    }
    setNextSuccessor(successor) {
        this.successor = successor
    }
    passRequest() {
        const ret = this.fn.apply(this, arguments)
        if (ret === 'nextSuccessor') {
            return this.successor && this.successor.passRequest.apply(this.successor, arguments)
        }
        return ret
    }
}
```

现在我们把3个订单函数分别包装成职责链的节点：

```js
const chainOrder500 = new Chain(order500)
const chainOrder200 = new Chain(order200)
const chainOrderNormal = new Chain(orderNormal)
```

然后指定节点在职责链中的顺序

```JS
chainOrder500.setNextSuccessor(chainOrder200)
chainOrder200.setNextSuccessor(chainOrderNormal)
```

最后把请求传递给第一个节点：

```JS
chainOrder500.passRequest(1, true, 500) // 100

chainOrder500.passRequest(2, true, 500) // 50

chainOrder500.passRequest(3, true, 500) // 普通

chainOrder500.passRequest(1, false, 0) // 库存不足
```

通过改进，我们可以自由的增加、移除和修改链中的顺序，例如运营想增加300元定金购买，那么我们只需要增加一个节点即可

```js
const order300 = function() {
    // ...省略
}
const chainOrder300 = new Chain(order300)

chainOrder500.setNextSuccessor(chainOrder300)
chainOrder300.setNextSuccessor(chainOrder200)
```