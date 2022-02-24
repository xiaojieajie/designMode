Function.prototype.before = function(beforeFn) {
    return () => {
        beforeFn.apply(this, arguments)
        return this.apply(this, arguments)
    }
}

Function.prototype.after = function(afterFn) {
    return () => {
        const ret = this.apply(this, arguments)
        afterFn.apply(this, arguments)
        return ret
    }
}

const a = function() {
    console.log(2);
}.before(() => {
    console.log(1)
}).after(() => {
    console.log(3);
})

a()
