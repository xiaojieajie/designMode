# 策略模式的定义

定义一系列的算法，把它们一个个封装起来，并且使他们可以相互替换。

# 计算奖金

公司的年终奖是根据员工的绩效来决定的，例如，S => 4，A => 3, B => 2。假设财务部要求我们提供一段代码，方便他们计算奖学金

## 最初的代码实现

```javascript

const calculateBonus = function(performanceLevel, salary) {
    if (performanceLevel === 'S') {
        return salary * 4
    } else if (performanceLevel === 'A') {
        return salary * 3
    } else if (performanceLevel === 'B') {
        return salary * 3
    }
}

```

可以发现，这段代码非常简单，但是存在显而易见的缺点。

- 函数比较庞大，包含很多if-else语句，这些语句需要覆盖所有的逻辑分支
- 缺乏弹性，如果增加了一种新的绩效等级C，或者想把S奖金系数改为5，那我们必须深入函数内部实现，这是违反开放-封闭原则的
- 复用性差

## 使用策略模式重构代码

```javascript
// 实现策略类

const PerformanceS = function() {}

PerformanceS.prototype.calculate = function(salary) {
    return salary * 4
}

const PerformanceA = function() {}

PerformanceA.prototype.calulate = function(salary) {
    return salary * 3
}

const PerformanceB = function() {}

PerformanceB.prototype.calulate = function(salary) {
    return salary * 2
}

// 定义奖金类

const Bonus = function() {
    this.salary = null // 原始工资
    this.strategy = null // 绩效等级对应的策略对象
}

Bonus.prototype.setSalary = function(salary) {
    this.salary = salary
}

Bonus.prototype.setStrategy = function(strategy) {
    this.strategy = strategy
}

Bonus.prototype.getBonus = function() {
    if (!this.strategy) {
        throw new Error('未设置strategy属性')
    }
    return this.strategy.calulate(this.salary)
}


```

我们在来回顾一下策略模式的思想：

> 定义一系列算法，把他们一个个封装起来，并且使他们可以相互替换

详细说法就是：定义一系列的算法，把他们封装成策略类，算法被封装在策略类内部的方法里。

继续完成这个例子中剩下的代码。

```javascript

    const bouns = new Bonus()
    bouns.setSalary(10000)
    bouns.setStrategy(new PerformanceS()) // 设置策略对象

    console.log(bonus.getBonus()) // 40000

    bouns.setStrategy(new PerformanceA()) // 设置策略对象
    console.log(bonus.getBonus()) // 30000

```

这段代码是基于传统面向对象语言的模仿，下面了解用javascript实现的策略模式

## JavaScript版本的策略模式

```javascript
const strategies = {
    "S": salary => salary * 4,
    "A": salary => salary * 3,
    "B": salary => salary * 2,
}

const calculateBonus = function(level, salary) {
    return strategies[level](salary)
}

console.log(calculateBonus('S', 10000))
```

## 多态在策略模式中的体现

通过使用策略模式重构代码，我们消除了原程序中大片的条件分支语句。所有跟计算奖金有关的逻辑不再放到context中，而是分布再各个策略对象中。context并没有计算奖金的能力，而是把这个之职责委托给了某个策略对象。当我们对这些策略对象发出 **"计算奖金"**的请求时，他们会返回各自不同的计算结果，这正是多态性的体现，也是"他们可以相互替换"的目的 

## 使用多态模式实现小球运动

[请看小球运动.html代码（点我）](小球运动.html)

我们学会了如何编写一个动画类，利用这个动画类做一些缓动算法就可以让小球运动起来。我们使用策略模式把算法传入动画类中，来达到各种不同的缓动效果，这些算法都可以轻易的被替换为另一个算法，这是策略模式的经典运用之一。策略模式的实现并不复杂，关键是如何从策略模式的实现背后，找到封装变化、委托和多态性这些思想的价值。。

## 表单验证

假设我们正在编写一个注册业务，在点击注册按钮之前，有几条验证逻辑

- 用户名不能为空
- 密码长度不能小于6位

```javascript
const registerForm = document.getElementById('registerForm')
    registerForm.onsubmit = function() {
        if (registerForm.userName.value === '') {
            alert('用户名不能为空')
            return 
        }
        if (registerForm.password.value.length < 6) {
            alert('密码不能少于6位')
            return
        }
    }
```

这是一种很常见代码编写方式，它的缺点跟奖学金的最初版本一模一样

### 使用策略模式重构

[请看表单验证.html（点我）](表单验证.html)

### 给某个文本输入框添加多种校验规则

目前我们的表单校验实现有一点小遗憾：一个文本输入框只能对应一种校验规则。

例如：

```javascript
validator.add(registerForm.userName, [{
    strategy: 'isNonEmpty',
    errorMsg: '用户名不能为空'
}, {
    strategy: 'minLength:10',
    errorMsg: '用户名长度不能小于10位'
}])
```

完整代码如下

[请看多种校验规则.html（点我）](多种校验规则.html)


## 策略模式的优缺点

### 优点

策略模式是一种常用且有效的设计模式，通过三个例子我们可以总结出一些优点

1. 策略模式利用组合，委托和多态等技术和思想，可以有效地避免多重条件选择语句。
2. 策略模式提供了对开放-封闭原则的完美支持，将算法封装在独立地strategy中，使得它易于切换，易于理解，易于扩展
3. 策略模式中得算法可以复用在系统的其他地方，从而避免许多重复的复制粘贴工作
4. 在策略模式中利用组合的委托来让context拥有执行算法的能力，这也是继承的一种更轻便的替代能力

### 缺点

1. 会在程序中增加许多策略类或者策略对象，但实际上这比把他们负责的逻辑堆砌在Context中要好。
2. 其次，要使用策略模式，必须了解所有的strategy，必须了解各个strategy之间的不同点，这样才能选择一个合适的strategy。比如，我们要选择一种合适的旅游出行路线，必须先了解选择飞机、火车、自行车等方案的细节。此时strategy要向客户暴露它的所有实现，这是违反最少知识原则的。


## 一等函数对象与策略模式

实际上在JavaScript这种将函数作为一等对象的语言里，策略模式已经融入到了语言本身当中，我们经常用高阶函数来封装不同的行为，并且把它传递到另一个函数中。当我们对这些函数发出**调用**的消息时，不同的函数会返回不同的执行结果。在JavaScript中，**函数对象的多态性**来的更加简单

在前面的学习中，为了清楚地表示这是一个策略模式，我们使用了strategies这个名字。如果去掉了strategies，我们还能认出这是一个策略模式吗？代码如下：

```javascript
var S = function(salary) {
    return salary * 4
}
var A = function(salary) {
    return salary * 3
}

var calculateBonus = function(func, salary) {
    return func(salary)
}

calculateBonus(S, 10000) // 输出：40000
```


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