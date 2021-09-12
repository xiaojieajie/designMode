const iterator = function (obj) {
    let current = 0

    const next = () => current += 1

    const isDone = () => current >= obj.length

    const getCurrItem = () => obj[current]

    return {
        next,
        isDone,
        getCurrItem,
        length: obj.length
    }
}

// 接下来改写compare函数

const compare = function(iterator1, iterator2) {
    if (iterator1.length !== iterator2.length) {
        console.log('不相等')
    }
    while (!iterator1.isDone() && !iterator2.isDone()) {
        if (iterator1.getCurrItem() !== iterator2.getCurrItem()) {
            throw new Error('不相等')
        }
        iterator1.next()
        iterator2.next()
    }
    console.log('相等')
}

const iterator1 = iterator([1, 2, 3])
const iterator2 = iterator([1, 2, 3])

compare(iterator1, iterator2)