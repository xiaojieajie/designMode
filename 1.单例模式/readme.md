# 单例模式的定义

保证一个类仅有一个实例，并提供一个访问它的全局访问点

单例模式是一种常见的模式，有一个对象我们往往只需要一个，比如线程池、全局缓存、浏览器中的window对象等。在JavaScript开发中，单例模式用途同样广泛。试想一下，当我们单机登录按钮的时候，页面中会出现一个弹窗，而这个弹窗是唯一的，无论单机多少次登录按钮，这个浮窗都只会创建一次，那么这个登录浮窗就适合用单例模式来创建

# 普通的单例模式

```javascript

const Singleton = function(name) {
    this.name = name
}

Singleton.instance = null

Singleton.prototype.getName = function() {
    alert(this.name)
}

Singleton.getInstance = function(name) {
    if (!this.instance) {
        this.instance = new Singleton(name)
    }
    return this.instance
}

const a = Singleton.getInstance('a')
const b = Singleton.getInstance('b')

console.log(a === b) // true

```

上面虽然已经完成了一个单例模式的编写，但是这段单例模式代码的意义不大

# 透明的单例模式

```javascript
const CreateDiv = (function() {
    let instance;

    const CreateDiv = function(html) {
        if (instance) {
            return instance
        }
        this.html = html
        this.init()
        return instance = this
    }

    CreateDiv.prototype.init = function() {
        const div = document.createElement('div')
        div.innerHTML = this.html
        document.body.appendChild(div)
    }

    return CreateDiv

})()

const a = new CreateDiv('a')
const b = new CreateDiv('b')

console.log(a, b)
console.log(a === b)
```

虽然现在完成了一个透明的单例类的编写，但他同样有一些缺点，使用了自执行的匿名函数和闭包，增加了程序的复杂度，阅读起来不舒服

```javascript
const CreateDiv = function(html) {
    if (instance) {
        return instance
    }
    this.html = html
    this.init()
    return instance = this
}
```

在这段代码中，createDiv做了两件事情，第一是创建对象和执行初始化init方法，第二是保证只有一个对象，不符合**单一职责原则**

假设我们某天需要利用这个类创建千万个div，那么我们必须改写CreateDiv构造函数，这种修改会给我们带来不必要的烦恼

# 用代理实现单例模式

```javascript
const CreateDiv = function(html) {
    this.html = html
    this.init()
}
CreateDiv.prototype.init = function() {
    const div = document.createElement('div')
    div.innerHTML = this.html
    document.body.appendChild(div)
}
```

接下来写代理类

```javascript
const ProxySingletonCreateDiv = (function() {
    let instance;
    return function(html) {
        if (!instance) {
            instance = new CreateDiv('a')
        }
        return instance
    }
})()

const a = new ProxySingletonCreateDiv('a')
const b = new ProxySingletonCreateDiv('b')

console.log(a, b)
console.log(a === b)

```

通过代理类的方式，我们同样完成了单例模式的编写，跟之前不同的是，现在我们把负责管理单例的逻辑移到了代理类中，这样一来，createDiv就变成了普通的类，跟代理组合起来达到单例的效果

# JavaScript中的单例

前面的几种单例模式的实现，更多的是接近传统面向对象语言中的实现，单例模式从"类"中创建而来

## 使用命名空间

```javascript
const MyApp = {}

MyApp.namespace = function(name) {
    const parts = name.split('.')
    let current = MyApp
    for (let key of parts) {
        if (!current[key]) {
            current[key] = {}
        }
        current = current[key]
    }
}

myApp.namespace('event')
myApp.namespace('dom.style')

// 上述代码等同于

var MyApp = {
    event: {},
    dom: {
        style: {}
    }
}
```

## 使用闭包封装私有变量

```javascript
var user = (function() {
    const _name = 'jie',
        _age = '22';
    
    return {
        getUserInfo() {
            return _name + '-' + _age
        }
    }
})()
```

# 惰性单例

惰性单例是指在需要的时候才创建对象实例，这种技术在实际开发中非常有用，有用的程度超乎我们想象

例如创建一个唯一的弹窗

```javascript
const getLoginLayer = (function() {
    let div;
    return function() {
        if (!div) {
            div = document.createElement('div')
            div.style.display = 'none'
            div.innerHTML = '我是弹窗'
            div.classList.add('popup')
            document.body.appendChild(div)
        }
        return div
    }
})()

const open = document.getElementById('open')

const close = document.getElementById('close')

open.onclick = function() {
    console.log('我点击了')
    const loginLayer = getLoginLayer()
    loginLayer.style.display = 'block'
}
close.onclick = function() {
    const loginLayer = getLoginLayer()
    loginLayer.style.display = 'none'
}
```

这个div只会被创建一次


# 通用的惰性单例

1. 上面的这段代码是违反单一职责原则，创建对象和管理单例的逻辑都在getLoginLayer对象每部
2. 如果我们下次需要创建页面中唯一的iframe，或者script标签，就得如法炮制，把函数照抄一遍

```javascript
const getIframe = (function() {
    let iframe;
    return function() {
        if (!iframe) {
            iframe = document.createElement('iframe')
            iframe.style.display = 'none'
            document.body.appendChild(iframe)
        }
        return iframe
    }
})()
```

现在我们把这个创建的逻辑抽离出来

```javascript
const getSingle = function(fn) {
    let result;
    return function() {
        return result || (result = fn.apply(this, arguments))
    }
}
```

我们将创建函数参数fn的方式传入getSingle，这样不仅可以创建loginLayer，还能创建script，iframe，之后再让getSingle返回一个新的函数，用变量来保存fn的返回结果，result在闭包中，永远不会被销毁。


```javascript
const getSingle = function(fn) {
    let result;
    return function() {
        return result || (result = fn.apply(this, arguments))
    }
}

const getLoginLayer = function() {
    const div = document.createElement('div')
    div.style.display = 'none'
    div.innerHTML = '我是弹窗'
    div.classList.add('popup')
    document.body.appendChild(div)
    return div
}

const createSingleLoginLayer = getSingle(getLoginLayer)

open.onclick = function() {
    console.log('我点击了')
    const loginLayer = createSingleLoginLayer()
    loginLayer.style.display = 'block'
}
close.onclick = function() {
    const loginLayer = createSingleLoginLayer()
    loginLayer.style.display = 'none'
}
```

下面让我们创建唯一的iframe动态加载第三方页面

```javascript
open.onclick = function() {
    const iframe = createSingleIframe()
    iframe.style.display = 'block'
    iframe.src = 'https://www.bilibili.com/'
}
close.onclick = function() {
    const iframe = createSingleIframe()
    iframe.style.display = 'none'
}
```


单例模式的用途不止可以创建对象，比如我们通常渲染完页面中的一个列表之后，接下来要给这个列表绑定click事件，如果是通过ajax动态添加列表，在使用事件代理的前提下，click事件实际上只需要在第一次渲染的时候被绑定一次，但是我们不像去判断当前是否是第一次渲染列表，如果借助Jquery，我们通常给节点绑定one事件。

```javascript
var bindEvent = function() {
    $('div').one('click', function() {
        alert('click)
    })
}

var render = function() {
    bindEvent()
}

render()
render()
render()
```

如果利用getSingle函数，也能达到一样的效果。代码如下

```javascript
var bindEvent = getSingle(function() {
    console.log('我执行了内部')
    document.getElementById('div1').addEventListener('click', function() {
        alert('click')
    })
    
    return true
})

var render = function() {
    console.log('我执行了')
    bindEvent()
}

render()
render()
render()
```

可以看到，render函数和bindEvent分别执行了3次，但div实际上只绑定了一次事件
