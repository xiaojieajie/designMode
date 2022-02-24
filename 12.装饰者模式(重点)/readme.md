# 装饰者模式

在传统的面向对象语言中，给对象添加功能常常使用继承的方式，但是继承并不灵活，还会带来许多问题：

1. 超类和子类之间存在强耦合性，当超类改变时，子类也会随之改变
2. 继承这种功能复用方式被称为“白箱复用”，“白箱”是相对可见性而言的，在继承方式中，超类的内部细节是对子类可见的，继承常常被宋伟破坏了封装性。

# 装饰者模式的定义

给对象动态地增加职责的方式称为装饰者(decorator)模式。装饰者模式能够在不改变对象自身的基础上，在程序运行期间给对象动态的增加职责。

跟继承相比，装饰者是一种更轻便灵魂的做法，这是一种“即用即付”的方式，比如天冷了就多穿一件外套，需要飞行就在头上插一根竹蜻蜓。

# 模拟传统面向对象语言的装饰者模式

假设我们在编写一个飞机大战的游戏，随着经验值的增加，我们操作的飞机对象会升级，升到第二级时可以发射导弹，升到第三级时可以发射原子弹

下面用代码来实现，首先是原始的飞机类

```js
const Plane = function() {}
Plane.prototype.fire = function() {
    console.log('发射普通子弹')
}
```

接下来增加两个装饰类，分别是导弹和原子弹

```js
const MissileDecorator = function(plane) {
    this.plane = plane
}
MissileDecorator.prototype.fire = function() {
    this.plane.fire()
    console.log('发射导弹')
}
const AtomDecorator = function() {
    this.plane.fire()
    console.log('发射原子弹')
}
```

这种给对象动态增加职责的方式，并没有真正地改动对象自身，而是将对象放入另一个对象之中，这些对象以一条线的方式进行引用，形成一个聚合对象。

最后看看测试结果

```js
const plane = new Plane()
plane = new MissileDecorator(plane)
plane = new AtomDecorator(plane)

plane.fire()
// 分别输出：发射普通子弹，发射导弹，发射原子弹
```

套娃。。。

# 装饰者也是包装器

# JavaScript版装饰者


```JS
const plane = {
    fire() {
        console.log('普通子弹')
    }
}
const missileDecorator = function() {
    console.log('发射子弹')
}
const atomDecorator = function() {
    console.log('发射原子弹')
}

const fire1 = plane.fire

plane.fire = function() {
    fire1()
    missileDecorator()
}

const fire2 = plane.fire

plane.fire = function() {
    fire2()
    atomDecorator()
}
plane.fire()
// 分别输出：发射普通子弹，发射导弹，发射原子弹
```

# 装饰函数

要想为函数添加一些功能，最简单粗暴的方式就是直接改写该函数，但这是最差的办法，直接违反了开放-封闭原则：

```js
const a = () => {
    alert(1)
}
// 改成
const a = () => {
    alert(1)
    alert(2) 
}
```

很多时候我们不想去碰原函数，可能原函数是由其他函数编写的，功能十分复杂。

可以这么解决，请看代码

```JS
const a = () => {
    alert(1)
}
const _a = a;

a = function() {
    _a()
    alert(2)
}
a()
```

这是实际开发中很常见的一种做法，比如我们想给window绑定onload事件，但是又不确定这个事件是不是已经被其他人绑定了，为了避免覆盖之前的，也可以这么解决

```JS
window.onload = function() {
    // ...省略
}
const _onload = window.onload || function() {}

window.onload = () => {
    _onload()
    alert(2)
}
```

这样的代码是符合开闭原则的，但是这种方式存在两个问题：

1. 必须维护_onload这个中间变量。
2. this指向问题(this指向问题请看下面的代码)

```JS
const _getElementById = document.getElementById

document.getElementById = function(id) {
    alert(1)
    return __getElementById(id)
}

const button = document.getElementById('button')
```

当我们点击按钮后，会报错，因为此时this指向的是window，而不是document

改进的代码如下

```JS
document.getElementById = function(id) {
    alert(1)
    return __getElementById.apply(document, id)
}
```

但是这样做显然很不方便，下面我们引入AOP，来提供一种完美的方法给函数动态增加功能

# 用AOP装饰函数

首先给出Function.prototype.before方法和Function.prototype.after方法。

[AOP版click](./AOP版click.html)

再回到window.onload的例子，看看用after来增加新的window.onload事件有多么简单

[AOP版windowOnload](AOP版windowOnload.js)

值得一提的是，很多人不喜欢这种污染原型的方式，那么我们可以做一个变通，把原函数和新函数都作为参数传入

```js
const before = function(fn, beforeFn) {
    return function() {
        beforeFn.apply(this, arguments)
        return fn.apply(this, arguments)
    }
}

let a = before(
    () => alert(3),
    () => alert(2)
)

a = before(a, () => alert(1))

a()
```

# AOP的应用实例

## 数据统计上传(数据埋点)

举个例子，例如页面有一个登录button，点击这个按钮会登录，与此同时要进行数据上报，来统计有多少个用户点击了这个button

我们先来看看不使用AOP的代码

```html
<button id="login">点击登录</button>

<script>

const login = () => {
    console.log('登录')
    log('loginClick') //埋点
}

const log = (xxx) => {
    axios.post('xxx', xxx)
}
document.getElementById('login').onclick = login

</script>
```

我们可以看到在login函数里，又要登录，又要负责数据上报，这两个功能耦合在一起，使用AOP分离之后，代码如下

```js
const log = (xxx) => {
    axios.post('xxx', xxx)
}
const login = () => {
    console.log('登录')
}.after(log)

document.getElementById('login').onclick = login
```

## 用AOP动态改变函数的参数

观察上面的Function.prototype.before方法：

```js
Function.prototype.before = function (beforeFn) {
    const that = this
    return function() {
        beforeFn.apply(this, arguments) // (1)
        return that.apply(this, arguments) // (2)
    }
}
```

从这段代码的(1)和(2)处可以看到，beforeFn和原函数that共用一组参数列表arguments, 当我们在beforeFn函数体内改变arguments的时候，that接受的参数自然也会改变。

```JS
let func = (param) => {
    console.log(param) // 输出：{ a: 'a', b: 'b' }
}
func = func.before((param) => {
    param.b = 'b'
})

func({ a: 'a' })
```