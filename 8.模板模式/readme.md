# 模板模式的定义和组成

模板模式是一种只需使用继承就可以实现的非常简单的模式。

模板方法模式由两部分结构组成，第一部分是抽象父类，第二部分是具体的实现子类。通常在抽象父类中封装了子类的算法框架，包括实现一些公共方法以及封装子类中所有方法的执行顺序。子类继承这个抽象类，也继承了整个算法结构，并且可以选择重写父类的方法。

# 第一个例子————Coffee or Tea

咖啡与茶是个经典的例子，经常用来讲解模板方法模式。

## 先泡一杯咖啡

首先，我们先来泡一杯咖啡，如果没有什么太个性化的需求，泡咖啡的步骤如下

1. 把水煮沸
2. 用沸水冲泡咖啡
3. 把咖啡倒进杯子
4. 加糖和牛奶

```js
const Coffee = function() {}

Coffee.prototype.boil = function() {
    console.log('把水煮沸')
}
Coffee.prototype.brew = function() {
    console.log('用沸水冲泡咖啡')
}
Coffee.prototype.pourInCup = function() {
    console.log('把咖啡倒进杯子')
}
Coffee.prototype.addSugarAndMilk = function() {
    console.log('加糖和牛奶')
}

Coffee.prototype.init = function() {
    this.boil()
    this.brew()
    this.pourInCup()
    this.addSugarAndMilk()
}
const coffee = new Coffee()
coffee.init()
```

## 泡茶

1. 把水煮沸
2. 用沸水冲泡茶叶
3. 把茶水倒进杯子
4. 加柠檬

```js
const Tea = function() {}

Tea.prototype.boil = function() {
    console.log('把水煮沸')
}
Tea.prototype.brew = function() {
    console.log('用沸水冲泡茶叶')
}
Tea.prototype.pourInCup = function() {
    console.log('把茶水倒进杯子')
}
Tea.prototype.addSugarAndMilk = function() {
    console.log('加柠檬')
}

Tea.prototype.init = function() {
    this.boil()
    this.brew()
    this.pourInCup()
    this.addSugarAndMilk()
}
const tea = new Tea()
tea.init()
```

## 分离出共同点

我们发现咖啡和茶的冲泡过程大同小异

不同点如下

1. 原料不同。一个是咖啡，一个是茶，但我们可以把它们都抽象成“饮料”
2. 泡的方式不同。咖啡是冲泡，而茶叶是浸泡，我们可以把它们都抽象为“泡”
3. 加入的调料不同。一个是糖和牛奶，一个柠檬，但我们可以把它们抽象成“调料”

经过抽象之后，我们能整理为下面四步。

1. 把水煮沸
2. 用沸水冲泡饮料
3. 把饮料倒进杯子
4. 加调料

代码如下

```js
const Beverage = function() {}
Beverage.prototype.boil = function() {
    console.log('把水煮沸')
}
Beverage.prototype.brew = function() {} // 空方法，应该由子类重写
Beverage.prototype.pourInCup = function() {} // 空方法，应该由子类重写
Beverage.prototype.addCondiments = function() {} // 空方法，应该由子类重写

Beverage.prototype.init = function() {
    this.boil()
    this.brew()
    this.pourInCup()
    this.addCondiments()
}
```

## 创建Coffee子类和Tea子类

```JS
const Coffee = function() {}
Coffee.prototype = new Beverage()

Coffee.prototype.boil = function() {
    console.log('把水煮沸')
}
Coffee.prototype.brew = function() {
    console.log('用沸水冲泡咖啡')
}
Coffee.prototype.pourInCup = function() {
    console.log('把咖啡倒进杯子')
}
Coffee.prototype.addCondiments = function() {
    console.log('加糖和牛奶')
}

const coffee = new Coffee()
coffee.init()
```

至此我们的Coffee类以及完成了，当调用coffee对象的init方法时，由于coffee对象和Coffee构造器的原型prototype上都没有对应的init方法，所以该请求会顺着原型链，被委托给Coffee的“父类”Beverage原型上的init方法。

而Beverage.prototype.init方法中已经规定好了泡饮料的顺序，所以我们能成功泡出一杯咖啡


**接下来照葫芦画瓢，来创建我们的Tea类**

```JS
const Tea = function() {}
Tea.prototype = new Beverage()

Tea.prototype.boil = function() {
    console.log('把水煮沸')
}
Tea.prototype.brew = function() {
    console.log('用沸水冲泡咖啡')
}
Tea.prototype.pourInCup = function() {
    console.log('把咖啡倒进杯子')
}
Tea.prototype.addCondiments = function() {
    console.log('加糖和牛奶')
}

const tea = new Tea()
tea.init()
```

本篇一直讨论的是模板方法模式，那么在上面的例子中，谁才是所谓的模板方法呢？答案是**Beverage.prototype.init()**


# 抽象类

首先要说明的是，模板方法模式一种严重依赖抽象类的设计模式。JavaScript在语言层面并没有提供对抽象类的支持，我们也很难模拟抽象类的实现。用TypeScript来实现

[typescript抽象类实现coffee和tea的例子](./抽象类实现Coffee%20和%20Tea的例子.ts)

# 模板模式的使用场景

从大的方向来讲，模板方法模式常被架构师用来搭建项目的框架，架构师定好了框架的骨架，程序员继承框架的结构之后，负责往里面填空，比如Java程序员使用过HttpServlet技术来开发项目。

一个基于HttpServlet的程序包含了7个生命周期，这7个生命周期分别对应一个do方法。

1. doGet()
2. doHead()
3. doPost()
4. doPut()
5. doDelete()
6. doOption()
7. doTrace


在Web开发中也能找到很多模板方法模式的适用场景，比如我们在构建一个UI组件，这些组件的构建过程如下。

1. 初始化一个div容器
2. 通过ajax请求拉取对应的数据
3. 把数据渲染到div容器里面，完成组件的构造
4. 通知用户组件渲染完毕

我们看到，任何组件的构建都遵循上面四步，其中1和4是相同的。第二步不同的只是请求ajax的远程地址，第三步不同的是渲染数据的方式

于是我们可以把这4个步骤都抽象到父类的模板方法里面，父类中还可以顺便提供1和4的具体实现。当子类继承这个父类之后，会重写模板里面的2和3

# 钩子方法

举这么个场景，有些客户喝咖啡不下糖，但是我们已经规定饮料的4个步骤，那么有什么办法可以让子类不受这个约束

用钩子方法可以用来解决这个问题，放置钩子是隔离变化的一种常见手段。

```JS
const Beverage = function() {}
Beverage.prototype.boil = function() {
    console.log('把水煮沸')
}
Beverage.prototype.brew = function() {} // 空方法，应该由子类重写
Beverage.prototype.pourInCup = function() {} // 空方法，应该由子类重写
Beverage.prototype.addCondiments = function() {} // 空方法，应该由子类重写
Beverage.prototype.customerWantsCondiments = function() {
    return true
} 


Beverage.prototype.init = function() {
    this.boil()
    this.brew()
    this.pourInCup()
    if (this.customerWantsCondiments()) {
        this.addCondiments()
    }
}

// coffee类

Coffee.prototype.customerWantsCondiments = function() {
    return window.confirm('请问需要调料吗')
}
```

# 好莱坞原则

好莱坞无疑是演员的天堂，当好莱坞也有很多找不到工作的新人演员，许多新人演员在好莱坞投递建立后一直等消息，有时候不耐放了，给演艺公司打电话，演艺公司往往这么回答：“不要来找我，等我电话”

在设计中，这样的规则被称为好莱坞原则。在这一原则的指导下，我们允许底层组件将自己挂钩到高层组件中，而高层组件会决定什么时候、以何种方式去使用这些底层组件。

模板方式是好莱坞原则的一个典型使用场景。

除此之外，好莱芜原则常常还适用于其他模式和场景，例如发布-订阅和回调函数

# 真的需要继承吗？好莱坞式做法

```JS
const Beverage = function(param) {
    const boil = function() {
        console.log('把水煮沸')
    }
    const brew = param.brew || function() {
        ...
    }
    const pourIncup = param.pourIncup || function() {
        ...
    }
    const F = function() {}
    F.prototype.init = function() {
        boil()
        brew()
        pourIncup()
    }
    return F
}

const Coffee = Beverage({
    brew() {
        ...
    },
    pourIncup() {
        ...
    }
})

const Tea = Beverage({
    brew() {
        ...
    },
    pourIncup() {
        ...
    }
})

const coffee = new Coffee()
coffee.init()

const tea = new Tea()
tea.init()
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