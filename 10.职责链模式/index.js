Function.prototype.after = function(fn) {
    return (...args) => {
        const ret = this.apply(this, args)
        if (ret === 'nextSuccessor') {
            return fn.apply(this, args)
        }
        return ret
    }
}

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

const order = order500.after(order200).after(orderNormal)

order(1, true, 500)
order(2, true, 500)
order(1, false, 500)

