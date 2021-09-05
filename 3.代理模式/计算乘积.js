const mult = function() {
    let a = 1
    for(let i = 0, l = arguments.length; i < l; i ++) {
        a = a * arguments[i]
    }
    return a
}

console.log(mult(2, 3)) // 6
console.log(mult(2, 3, 4)) // 24

// 现在加入缓存代理函数

const proxyMult = (function() {
    const cache = {}
    return function() {
        const args = Array.prototype.join.call(arguments, ',')
        if (args in cache) {
            return cache[args]
        }
        return cache[args] = mult.apply(this, arguments)
    }
})()

console.log(proxyMult(1, 2, 3, 4))
console.log(proxyMult(1, 2, 3, 4))