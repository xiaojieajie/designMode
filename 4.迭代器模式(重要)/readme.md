# 迭代模式的定义

迭代器模式是指提供一种方法顺序访问一个聚合对象中的各个元素，而又不需要暴露该对象的内部表示。迭代器模式可以把迭代的过程从业务逻辑中分离出来，在使用迭代器模式之后，即使不关心对象的内部构造，也可以按顺序访问其中的每个元素.

# 实现简单的迭代器

```javascript
const each = function(arr, callback) {
    for (let i = 0, l = arr.length; i < l; i ++) {
        callback.call(arr[i], arr[i], i)
    }
}

each([1, 2, 3], (item, i) => {
    alert([item, i])
})
```

# 内部迭代器和外部迭代器

迭代器可以分为外部迭代器和内部迭代器, 它们都有各自的适用场景

## 内部迭代器

上面的each函数属于内部迭代器,each函数的内部定义好了迭代规则,它完全的接手了整个迭代过程,外部只需要一次初始调用

内部迭代器在调用的时候非常方便; 外界不用关心迭代器内部的实现, 跟迭代器的交互也仅是一次初始调用,但这也刚好是内部迭代器的缺点. 由于内部迭代器的迭代规则已经被提前规定, 上面的each函数就无法同时迭代两个数组了.

比如现在有个需求, 要判断两个数组里元素的值是否相等, 如果不改写each函数本身的代码, 我们能够入手的地方只剩下each的回调函数了

```javascript
const compare = function (ary1, ary2) {
    if (ary1.length !== ary2.length) {
        throw new Error('ary1和ary2不相等')
    }
    each(ary1, (item, i) => {
        if (item !== ary2[i]) {
            throw new Error('ary1和ary2不相等')
        }
    })
    alert('ary1和ary2相等')
}
compare([1, 2, 3], [1, 2, 4]) // 不相等
```

说实话, 这个compare函数很low, 我们能够顺利完成需求, 还要归功于Js里可以把函数当参数传递的特性, 但在其他语言未必可以.

在一些没有闭包的语言代理中, 内部迭代器本身的实现也相当复杂. 比如C语言中的内部迭代器是用函数指针来实现的, 循环处理所需要的数据都要以参数的形式明确地从外面传递进去

## 外部迭代器

外部迭代器必须显式的请求迭代下一个元素

外部迭代器增加了一些调用的复杂度, 但相对也增强了迭代器的灵活性, 我们可以手工控制迭代的过程或者顺序.

下面这个外部迭代器的实现来自<松本行弘的程序世界>第四章, 原例用Ruby, 这里换成Js

[请看外部迭代器.js（点我）](外部迭代器.js)


外部迭代器虽然调用方式复杂, 但它的适用面更广, 也能满足更多变得需求. 内部迭代器和外部迭代器无优劣之分, 使用哪个根据需求场景而定

# 迭代类数组和字面量对象

```javascript
$.each = function(obj, callback) {
    let valie,
        i = 0,
        length = obj.length,
        isArray = Array.isArray(obj)
    if (isArray) {
        for(; i < length; i++) {
            value = callback.call(obj[i], i, obj[i])
            if (value === false) {
                break;
            }
        }
    } else {
        for( i in obj ) {
            value = callback.call(obj[i], i, obj[i])
            if (value === false) {
                break;
            }
        }
    }
    return obj
}
```

# 倒序迭代器

```javascript
const reverseEach = function(ary, callback) {
    for(let l = ary.length - 1; l >= 0; l--) {
        callback(l, ary[l])
    }
}
```

# 中止迭代器

```javascript
const each = function(ary, callback) {
    for(let i = 0, l = ary.length; i < l; i++) {
        if(callback(i, ary[1]) === false) {
            break
        }
    }
}

each([1, 2, 3, 4, 5], function(i, n) {
    if (n > 3) {
        return false
    }
    console.log(n)
})
```

# 应用

来看一段代码

```javascript
const getUploadObj = function() {
    try {
        return new ActiveXObject('TXFTNActiveX.FTNUpload') // IE上传控件
    } catch (e) {
        if (supportFlash()) { // 未提供这个函数, 是否支持flash
            const str = `<object type="application/x-shockwave-flash"></object>`
            return $(str).appendTo($('body'))
        } else {
            const str = '<input name="file" type="file" />' // 表单上传
            return $(str).appendTo($('body'))
        }
    }
    
}
```

在不同的浏览器环境下, 选择的上传方式是不一样的. 因为使用浏览器上传控件进行上传速度快, 可以暂停和续传, 所以我们优先选择控件上传. 如果浏览器没有安装上传控件, 则使用flash上传, 如果连flash也没有, 则使用浏览器原生的表单上传

看看上面的代理, 为了得到一个upload对象, 这个getUploadObj 函数里面充斥了try, catch以及if条件分支. 缺点显而易见的

1. 很难阅读
2. 违反开闭原则
3. 拓展性差

在开发和调试过程中, 我们需要来回切换不同的上传方式, 每次改动都相当痛苦. 后来我们还支持了一些另外的上传方式, 比如, HTML5上传, 这时候唯一的办法就是继续往getUploadObj函数里增加条件分支.

来梳理一下, 目前一共有3种可能的上传方式, 我们不知道目前正在使用的浏览器支持哪几种. 就好比有3把钥匙, 我们想打开一扇门不知道该使用哪把. 于是从第一把开始, 迭代钥匙串进行尝试, 直到找到了正确的钥匙为止.

[请看应用.js（点我）](应用.js)

重构代码之后, 我们可以看到, 获取不同上传对象的方法被隔离在各自的函数里互不干扰, try, catch 和 if分支 不在纠缠在一起, 使得我们可以很方便的维护和拓展.

比如, 后来我们增加了webkit控件上传和html5上传, 我们要做的仅仅是下面的一些工作

增加如下函数
```javascript
const getWebkitUploadObj = function() {
    // ...代码略
}
const getHtml5UploadObj = function() {
    // ...代码略
}

// 依靠优先级添加进迭代器
const uploadObj = iteratorUploadObj(getActiveUploadObj, getFlashUploadObj, iteratorUploadObj, getWebkitUploadObj, getHtml5UploadObj)

```

# 小结

迭代器是一种相对简单的模式, 简单到很多时候我们都不认为它是一种设计模式. 目前的绝大部分语言都内置了迭代器(ES6迭代器, for of)


# 其他文章

1. [单例模式](1.单例模式/readme.md)
2. [策略模式](2.策略模式/readme.md)
3. [代理模式](3.代理模式/readme.md)
4. [迭代器模式](4.迭代器模式/readme.md)
5. [发布-订阅模式](5.发布-订阅模式/readme.md)
6. [命令模式](6.命令模式/readme.md)
7. [组合模式](7.组合模式/readme.md)
8. [模板模式](8.模板模式/readme.md)
9. [享元模式](9.享元模式/readme.md)
10. [职责链模式](10.职责链模式/readme.md)
11. [中介者模式](11.中介者模式/readme.md)
12. [装饰者模式](12.装饰者模式(重点)/readme.md)
13. [状态模式](13.状态模式/readme.md)
14. [适配器模式](14.适配器模式/readme.md)
15. [外归模式](17.外观模式/readme.md)
16. [单一职责原则](15.单一职责原则/readme.md)
17. [最小知识原则](16.最小知识原则/readme.md)
18. [开放-封闭原则](18.开放-封闭原则/readme.md)
19. [代码重构](19.代码重构/readme.md)