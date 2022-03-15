# 享元模式的概念

享元(flyweight)模式是一种用于性能优化的模式，"fly"在这里是苍蝇的意思，意为蝇量级。享元模式的核心是运用共享技术来有效支持大量细粒度的对象。

如果系统中创建了大量类似的对象而导致内存占用过高，享元模式就非常有用了。在JavaScript中，浏览器特别是移动端的浏览器分配的内存并不算多，如何节省内存就成了一件非常有意义的事情。

享元模式的概念听起来并不好理解，在深入讲解之前，我们来看一个例子

# 初识享元模式

假设有个衣服工厂，目前的产品有50种男性衣服和50种女性衣服，为了推销产品，工厂决定生产一些塑料模特来穿上它们的衣服拍广告照片。正常情况下需要50个男模特和50个女模特，然后让他们分别穿上一件衣服来拍照。在不适用享元模式的情况下，代码如下

```JS
const Model = function(sex, underwear) {
    this.sex = sex
    this.underwear = underwear
}
Model.takePhoto = function() {
    console.log(`sex=${this.sex},underwear=${this.underwear}`)
}
// 男性模特拍照
for(let i = 1; i <= 50; i++) {
    const maleModel = new Model('male', 'underwear' + i)
    maleModel.takePhoto()
}

// 女性模特拍照
for(let i = 1; i <= 50; i++) {
    const femaleModel = new Model('female', 'underwear' + i)
    femaleModel.takePhoto()
}
```

要得到一张照片，每次都得传入sex和underwear参数，如上所述，会产生100个对象。如果将来生产了10000种衣服，那这个程序可能会因为**存在如此多的对象**而崩溃

下面我们来考虑如何优化一下这个场景。虽然有100种衣服，但很明显不需要50个男性和50个女模特。女模特和男模特各有一个足以，他们可以穿上不同的衣服来拍照

现在来改写代码，既然只需要区分男女模特，那我们先把underwear参数从构造函数中移除

```js
const Model = function(sex) {
    this.sex = sex
}
Model.takePhoto = function() {
    console.log(`sex=${this.sex},underwear=${this.underwear}`)
}
```

然后分别创建男女模特对象

```JS
const maleModel = new Model('male'),
      femaleModel = new Model('female');
```

男模特穿男装，拍照

```js
for(let i = 1; i <= 50; i++) {
    maleModel.underwear = `underwear${i}`
    maleModel.takePhoto()
}
```

女模特穿女装，拍照

```js
for(let i = 1; i <= 50; i++) {
    femaleModel.underwear = `underwear${i}`
    femaleModel.takePhoto()
}
```

可以看到，改进之后，只需要两个对象变完成了任务

## 内部状态与外部状态

上面这个例子就是享元模式的雏形，享元模式要求将对象的属性划分为内部状态和外部状态（状态在这里通常指属性）。享元模式的目标是**尽量减少共享对象的数量**，关于如何划分内部状态和外部状态，请看下面

1. 内部状态存储与对象内部
2. 内部状态可以被一些对象共享
3. 内部状态独立于具体的场景，通常不会改变
4. 外部状态取决于具体的场景，并根据场景而变化，外部状态不能被共享

上面的例子中，性别是内部状态，衣服是外部状态

## 享元模式的通用结构

上面的例子存在两个问题

1. 我们通过构造函数显式new 出了男女两个model对象，在其他系统中，也许并不是一开始就需要所有的共享对象。
2. 给model对象手动设置了underwear外部状态，在复杂的系统中，这并不是一个好方式，因为外部状态可能相当复杂，它们与共享对象的联系会变得困难。

我们通过对象工厂（单例模式）来解决第一个问题

第二个问题，可以用一个管理器来记录对象相关的外部状态，使这些外部状态通过某个钩子和共享对象联系起来

## 文件上传的例子

### 对象爆炸

> 以下是不用享元模式的代码

在微云的上传模块的开发中，增加出现过对象爆炸的问题。微云的文件上传功能虽然可以选择依照队列，一个一个排队上传，但也支持同时选择2000个文件。每一个文件都对应着javaScript上传对象的创建，在第一版的开发中，的确往程序里new 了 2000个upload对象，结果可选而知。

微云支持好几种上传方式，例如flash和表单上传，代码如下

```JS
let id = 0;

window.startUpload = function(type, files) { // type是区分flash还是表单
    for (let i = 0, file; file = files[i++];) {
        const uploadObj = new Upload(type, file.fileName, file.fileSize)
        uploadObj.init(id++)
    }
}
```

当用户选择完文件之后，startUpload会遍历files数组来创建对应的upload对象。接下来定义Upload构造函数。

```JS
// 类型、文件名、文件大小
const Upload = function(type, fileName, fileSize) {
    this.type = type
    this.fileName = fileName
    this.fileSize = fileSize
    this.dom = null
}
Upload.prototype.init = function(id) {
    this.id = id
    this.dom = document.createElement('div')
    this.dom.innerHTML = `<span>文件名${this.fileName}</span><div> <button class="delFile">删除</button> </div>`
    this.dom.querySelector('delFile').onclick = () => {
        this.delFile()
    }
    document.body.appendChild(this.dom)
}
```

接下来书写delFile方法，该方法有一个逻辑，当被删除的文件小于3000KB时，直接删除。否则弹出一个提示框，提示用户是否确认删除，代码如下

```JS

Upload.prototype.delFile = function() {
    if (this.fileSize < 3000) {
        return this.dom.parentNode.removeChild(this.dom)
    }
    if (window.confirm('确认删除该文件吗')){
        return this.dom.parentNode.removeChild(this.dom)
    }
}
```

接下来分别创建3个插件上传对象和3个Flash上传对象：

```js
startUpload('plugin', [
    { 
        fileName: '1.txt',
        fileSize: 1000
    },
    { 
        fileName: '2.txt',
        fileSize: 3000
    },
    { 
        fileName: '3.txt',
        fileSize: 5000
    }
])

startUpload('flash', [
    { 
        fileName: '4.txt',
        fileSize: 1000
    },
    { 
        fileName: '5.txt',
        fileSize: 3000
    },
    { 
        fileName: '6.txt',
        fileSize: 5000
    }
])
```

## 享元模式重构文件上传

首先，我们需要确认外部状态和内部状态。

type是内部状态，其他都是外部状态，因为都是不确定的

### 剥离外部状态

```JS
const Upload = function(type) {
    this.type = type
}
```

Upload.prototype.init也不再需要，因为初始upload对象的工作被放在了 **uploadManager.add**函数里面，接下来定义删除函数

```js
Upload.prototype.delFile = function() {
    uploadManager.sexExternamState(id, this) // (1)

    if (this.fileSize < 3000) {
        return this.dom.parentNode.removeChild(this.dom)
    }
    if (window.confirm('确认删除该文件吗')){
        return this.dom.parentNode.removeChild(this.dom)
    }
}
```

### 工厂对象实例化

很简单，就是单例模式，定义一个工厂来创建对象，如果已经被创建过，直接返回，否则创建一个新的对象

```JS
const UploadFactory = (function() {
    const createdFlyWeightObjs = {}

    return {
        create(type) {
            if (createdFlyWeightObjs[type]) {
                return createdFlyWeightObjs[type]
            }
            return createdFlyWeightObjs[type] = new Upload(type)
        }
    }
})()

```

### 管理器封装外部状态

现在我们来完善前面提到的uploadManager对象，它负责向UploadFactory提交创建对象的请求，并用一个uploadDataBase对象保存所有upload对象的外部状态，以便在程序运行过程中给upload共享对象设置外部状态，代码如下

```JS
const uploadManager = (function() {
    const uploadDatabase = {}

    return {
        add(id, type, fileName, fileSize) {
            const flyWeightObj = UploadFactory.create(type)

            const dom = document.createElement('div')
            dom.innerHTML = `<span>文件名${fileName}</span><div> <button class="delFile">删除</button> </div>`
            dom.querySelector('delFile').onclick = () => {
                flyWeightObj.delFile()
            }
            document.body.appendChild(dom)

            uploadDatabase[id] = {
                fileName,
                fileSize,
                dom
            }
        },
        setExternalState(id, flyWeightObj) {
            const uploadData = uploadDatabase[id]
            for (let i in uploadData) {
                flyWeightObj[i] = uploadData[i]
            }
        }
    }
})()
```

然后是开始触发上传动作的startUpload函数。

```JS
let id = 0;

window.startUpload = function(type, files) { // type是区分flash还是表单
    for (let i = 0, file; file = files[i++];) {
        const uploadObj = uploadManager.add(++id, type, file.fileName, file.fileSize)
    }
}
```

接下来是测试时间。

```js
startUpload('plugin', [
    { 
        fileName: '1.txt',
        fileSize: 1000
    },
    { 
        fileName: '2.txt',
        fileSize: 3000
    },
    { 
        fileName: '3.txt',
        fileSize: 5000
    }
])

startUpload('flash', [
    { 
        fileName: '4.txt',
        fileSize: 1000
    },
    { 
        fileName: '5.txt',
        fileSize: 3000
    },
    { 
        fileName: '6.txt',
        fileSize: 5000
    }
])
```

可以看到跟刚才的结果一样，之前是创建了6个upload对象，现在是2个，就算同时创建2000个文件，需要创建的upload对象依然为2


# 享元模式的适用性

享元模式是一种很好的性能优化方案，但它会使程序更复杂，从两组代码可以看到，适用享元模式后，我们需要维护一个factory对象和manager对象。

一般来说，以下情况发生时便可以适用享元模式。

1. 程序中适用了大量的相似对象
2. 由于使用了大量对象，造成了很大的性能开销
3. 对象的大多数状态都可以变为外部状态
4. 剥离出对象的外部状态之后，可以用相对较少的共享对象取代大量对象

# 再谈外部状态和内部状态

我们知道，实现享元模式的关键是把内部状态和外部状态分离开来。

**现在我们来考虑一种极端情况，即对象没有外部状态和内部状态的时候**

# 没有内部状态的享元

举个例子，现在不支持flash上传，只能使用控件上传，所以我们不需要type参数了

```JS
const Upload = function() {}

const UploadFactory = (() => {
    let uploadObj = null; 
    return {
        create() {
            if (uploadObj) return uploadObj
            return uploadObj = new Upload()
        }
    }
})
```

# 没有外部状态的享元，只有内部状态

网上的许多资料中，经常把Java或者c#的字符串看出享元，这种说法是否正确呢？我们来看下面这段Java代码，来分析一下


```java
public class Test {
    public static void main(String args[]) {
        String a1 = new String('a').intern()
        String a2 = new String('a').intern()
        System.out.println(a1 == a2) // true
    }
}
```

这段代码中，分别 new 了两个字符串对象a1和a2 。intern是一种对象池技术，new String('a').intern()的含义如下

1. 如果值为a的字符串已经存在于对象池中，则返回这个对象的引用
2. 反之将字符串a的对象添加到对象池，并返回这个对象的引用

所以a1 == a2的结果是true，但这并不是享元模式的结果，享元模式的关键**是区别内部状态和外部状态**。这里没有外部状态的分离，即使这里使用了共享的技术，但并不是享元模式

# 对象池（重点，贼牛皮）

对象池技术应用非常广泛，HTTP连接池和数据库连接池都是其代表应用，甚至是各自游戏开发。在Web前端开发中，对象池使用最多的场景大概是跟DOM有关的操作。很多空间和时间都消耗在了DOM节点上，如何避免频繁地创建和删除DOM节点就成了一个有意义的话题

# 对象池实现

假设我们在开发一个地图应用，地图上经常会出现标志地名的小气泡，我们叫他tooltip，做过地图相关开发的肯定知道。

举个例子，当搜索我家附件地图的时候，地图上出现了两个小气泡，当搜索附件的兰州拉面的时候，出现了6个。**按照对象池的思想，在第二次搜索之前，并不会把第一次创建的2个小气泡删掉，而是把它们放到对象池。这样在第二次的搜索结果页面里，我们只需要创建4个而不是6个**

下面是代码时间，来创建一个创建小气泡的工厂

```JS
const toolTipFactory = (function(){
    const toolTipPool = [] // toolTip对象池

    return {
        create() {
            if (this.toolTipPool.length === 0) {
                // 如果对象池为空
                const div = document.createElement('div')
                document.body.appendChild(div)
                return div
            } else {
                return toolTipPool.shift() // 从对象池中取出一个dom
            }
        },
        revocer(tooltipDom) {
            return toolTipPool.push(tooltipDom)
        }
    }
})()
```

现在我们把时钟拨回第一次搜索的时刻，创建两个小气泡节点，为了方便回收，用一个数组ary来记录

```JS
const ary = []
for (let i = 0, str; str = ['A', 'B'][i++]; ) {
    const toolTip = toolTipFactory.create()
    toolTip.innerHTML = str
    ary.push(toolTip)
}
```

接下来假设地图重新绘制，在此之前要把这两个节点回收到对象池

```js
for (let i = 0, toolTip; toolTip = ary[i++]; ) {
    toolTipFactory.recover(toolTip)
}
```

再创建6个小气泡

```JS
for (let i = 0, str; str = ['A', 'B', 'C', 'D', 'E', 'F'][i++]; ) {
    const toolTip = toolTipFactory.create()
    toolTip.innerHTML = str
}
```

是不是很牛皮，上一次创建的节点给共享给了下一次操作。对象池跟享元模式的思想有点相似，虽然innerHTML的值A、B、C、D等可以看出节点的外部状态，但在这里我们并没有主动分离内部和外部状态的过程


# 通用对象池实现


```js

const objectPoolFactory = function(createObjFn) {
    const objectPool = []
    return {
        create(...args) {
            const obj = objectPool.length === 0 ? createObjFn.apply(this, args) : objectPool.shift()
            return obj
        },
        recover(obj) {
            objectPool.push(obj)
        }
    }
}

```

已经写完了，下面我们利用它来创建一个iframe的对象池

```JS

const iframeFactory = objectPoolFactory(() => {
    const iframe = document.createElement('iframe');
    document.appendChild(iframe)
    iframe.onload = () => {
        iframe.onload = null // 防止iframe重复加载的bug
        iframeFactory.recover(iframe)
    }
    return iframe
})

const iframe1 = iframeFactory.create()
iframe1.src = 'https://www.baidu.com';

const iframe2 = iframeFactory.create()
iframe2.src = 'https://www.weibo.com';
```

对象池也是一种性能优化方案

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