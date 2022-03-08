Function.prototype.before = function (beforeFn) {
    const that = this
    return function() {
        beforeFn.apply(this, arguments)
        return that.apply(this, arguments)
    }
}

Function.prototype.after = function (afterFn) {
    const that = this
    return function() {
        const ret = that.apply(this, arguments)
        afterFn.apply(this, arguments)
        return ret
    }
}

window.onload = function() {
    alert(1)
}

window.onload = (window.onload || function() {}).after(() => {
    alert(2)
}).after(() => {
    alert(3)
})
