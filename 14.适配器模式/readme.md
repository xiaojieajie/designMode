# 适配器模式

适配器模式的作用是解决两个软件实体间的接口不兼容的问题。使用适配器模式之后，原本由于接口不兼容而不能工作的两个软件实体可以一起工作。

适配器的别名是包装器(wrapper)，这是一个相对简单的模式。在程序开发中由许多这样的场景：当我们试图调用模块或者对象的某个接口时，却发现这个接口的格式并不符合目前的需求。这时候有两种解决办法，第一种时修改原来的接口实现，但如果原来的模块很复杂，或者我们拿到的模块是一段别人编写的经过压缩的代码，修改原接口就显得不太现实了。第二钟办法是创建一个适配器，将原接口转换为客户希望的另一个接口，客户只需要和适配器打交道。


# 现实中的适配器

1. 插头转换器
2. USB转接口

# 适配器模式的应用

例如我们要渲染googleMap和baiduMap地图：

```js
const googleMap = {
    show() {
        console.log('开始渲染谷歌地图')
    }
}
const baiduMap = {
    show() {
        console.log('开始渲染百度地图')
    }
}

const renderMap = function(map) {
    if (map.show instanceof Function) {
        map.show()
    }
}
renderMap(googleMap) // 输出：开始渲染谷歌地图
renderMap(baiduMap) // 输出：开始渲染百度地图
```

这段代码得顺利运行的关键是googleMap和baiduMap提供了一致的show方法，但第三方的接口方法并不在我们自己的控制范围之内，假如baiduMap提供的显示地图的方法不叫show而叫display呢？

假如baiduMap这个对象来源于第三方，正常情况下我们都不应该去改动它。此时我们可以通过增加baiduMapAdapter来解决问题：


```js
const googleMap = {
    show() {
        console.log('开始渲染谷歌地图')
    }
}
const baiduMap = {
    display() {
        console.log('开始渲染百度地图')
    }
}

const baiduMapAdapter = {
    show() {
        return baiduMap.display()
    }
}
const renderMap = function(map) {
    if (map.show instanceof Function) {
        map.show()
    }
}
renderMap(googleMap) // 输出：开始渲染谷歌地图
renderMap(baiduMap) // 输出：开始渲染百度地图
```

# 小结

适配器模式是一对相对简单的模式，有一些模式跟适配器模式结构非常相似，比如装饰者模式、代理模式和外观模式。这几种模式都属于"包装模式"，都是由一个对象来包装另一对象。区别它们的关键仍然是模式的意图。

1. 适配器模式主要用来解决两个已有接口之间不匹配的问题，它不考虑这些接口是怎样实现的，也不烤炉它们将来可能会如何演化。
2. 装饰者模式和代理模式也不会改变原来对象的接口，但装饰者模式的作用是为了给对象增加功能。装饰者模式常常形成一条长的装饰类，而适配器模式及通常只包装一次。代理模式是为了控制对对象的访问，通常也只包装一次。
3. 外观模式的作用倒是和适配器比较相似，有人把外观模式堪称一组对象的适配器，但在外观模式最显著的特点是定义了一个新的接口

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