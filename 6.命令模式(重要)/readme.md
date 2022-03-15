# 命令模式的定义

假如我是一个快餐店的点餐服务员，当某位客人点餐或者打订餐电话的时候，我会把需求都写在清单上，然后交给厨房，客人不用关心是哪些厨师帮他炒菜。还可以满足客人需要的定时服务，比如客人要求1小时候炒他的菜，只要订单还在，厨师就不会忘记。客人也可以很方便打电话来撤销订单。另外如果有太多的客人点餐，厨房可以按照订单的顺序排队炒菜

这些记录着订餐信息的清单，便是命令模式中的命令对象

# 命令模式的用途

命名模式中的命令（command）指的是一个执行某些特定事情的指令

常见的应用场景：有时候需要向某些对象发送请求，但是并不知道请求的接收者是谁，也不知道被请求的操作是什么。此时希望用一种松耦合的方式来设计程序，使得请求发送者和请求接收者能够消除彼此的耦合关系

# 例子1.菜单程序(传统语言版本)

假设我们正在编写一个用户界面程序，该用户界面上至少有数十个Button按钮。因为项目复杂，所以我们决定让某个程序员复杂绘制这些按钮，另外一些程序员复杂编写按钮的点击事件，这些行为都被封装在对象里

**设计模式的主题总是把不变的事物和变化的事物分离开来，命令模式也不例外**

按下按钮会发生事情是不变的，而具体发生什么是可变的。

```js
    <button id="button1">点击按钮1</button>
    <button id="button2">点击按钮2</button>
    <button id="button3">点击按钮3</button>
```

接下来定义setCommand函数，负责往按钮上安装命令。点击按钮会执行某个command命令，该命令约定为command的execute()方法。虽然还不知道这些命令究竟代表了什么操作，但负责绘制按钮的程序员不关心这些事情，他只需要预留好安装命令的接口。

```js
    const setCommand = function(button, command) {
        button.onclick = function() {
            command.execute()
        }
    }
```

最后，负责编写点击按钮具体行为的程序员交上了它们的成果，他们完成了刷新菜单，增加菜单和删除菜单的功能，如下

```js
const MenuBar = {
    refresh() {
        console.log('刷新菜单目录')
    }
}
const SubMenu = {
    add() {
        console.log('刷新菜单目录')
    },
    del() {
        console.log('删除子菜单')
    }
}
```

然后我们把这些行为封装在命令类中。

```js
const RefreshMenuBarCommand = function(receiver) {
    this.receiver = receiver
}
RefreshMenuBarCommand.prototype.execute = function() {
    this.receiver.refresh()
}
const AddSubMenuCommand = function(receiver) {
    this.receiver = receiver
}
AddSubMenuCommand.prototype.execute = function() {
    this.receiver.add()
}
const DelSubMenuCommand = function(receiver) {
    this.receiver = receiver
}
DelSubMenuCommand.prototype.execute = function() {
    this.receiver.del()
}
```

最后就是把命令接收者传入到command对象中，并且安到button上面

```js
const refreshMenuBarCommand = new RefreshMenuBarCommand(MenuBar)
const addSubMenuCommand = new AddSubMenuCommand(SubMenu)
const delSubMenuCommand = new DelSubMenuCommand(SubMenu)

setCommand(button1, refreshMenuBarCommand)
setCommand(button2, addSubMenuCommand)
setCommand(button3, delSubMenuCommand)
```

# JavaScript中的命令模式

也许我们会感到很奇怪，所谓的命令模式，看起来就是给对象的某个方法取了execute的名字。引入command对象和receiver这两个角色无非是把简单的事情复杂化了，即使不用什么模式，用下面几行代码就可以实现相同的功能

```js
const bindClick = function(button, func) {
    button.onclick = func
}
const MenuBar = {
    refresh() {
        console.log('刷新菜单目录')
    }
}
const SubMenu = {
    add() {
        console.log('刷新菜单目录')
    },
    del() {
        console.log('删除子菜单')
    }
}
bindClick(button1, MenuBar.refresh)
bindClick(button2, SubMenu.add)
bindClick(button1, SubMenu.del)
```

命令模式的由来，其实是回调函数的一个面向对象的替代品

JavaScript作为函数作为一等对象的语言，跟策略模式一样，命令模式早已容易到Js之中。运算块不一定要封装在command.execute方法中，也可以封装下普通函数中。函数作为一等公民，本身就可以被四处传递。即使我们需要请求**接收者**，那也未必使用面向对象的方式，闭包可以完成同样的功能

在面向对象的设计中，命令模式的接收者被当成command对象的属性保存起来，同时约定执行命令的操作调用的command.execute方法。在使用闭包的命令模式实现中，接收者被封闭在闭包产生的环境中，执行命令的操作可以更加简单，仅仅执行回调函数即可。无论接收者被保存为对象的属性，还是被封闭在闭包产生的环境中，在将来执行命令的时候，接收者都能被顺利访问。用闭包如下的命令模式如下

```js
const setCommand = function(button, func) {
    button.onclick = function() {
        func()
    }
}
const MenuBar = {
    refresh() {
        console.log('刷新菜单目录')
    }
}
const RefreshMenuBarCommand = function(receiver) {
    return function() {
        receiver.refresh()
    }
}
const refreshMenuBarCommand = RefreshMenuBarCommand(MenuBar)
setCommand(button1, refreshMenuBarCommand)
```

当然，如果想更明确的表达当前正在使用命令模式，或者除了执行命令之外，将来有可能还要提供撤销命令等操作。那我们最好改成调用execute方法

```js
const RefreshMenuBarCommand = function(receiver) {
    return {
        execute() {
            receiver.refresh()
        }
    }
}
const setCommand = function(button, command) {
    button.onclick = function() {
        command.execute()
    }
}
const refreshMenuBarCommand = RefreshMenuBarCommand(MenuBar)
setCommand(button1, refreshMenuBarCommand)
```

# 撤销命令

本节的目标是利用策略模式篇中5.4的Animate类来编写一个动画，这个动画的表现是让页面上的小球移动到水平的某个位置。现在页面有一个input和一个button按钮，文本框的数字代表小球移动后的水平位置，点击按钮后小球开始移动。

[请看撤销命令.html](./撤销命令.html)

现在通过命令模式轻松的实现了撤销功能。撤销是命令模式一个非常有用的功能，试想一下开发一个围棋程序的时候，我们把每一步棋子的变化都封装成命令，则可以轻而易举地实现悔棋功能。同样，可以轻松实现文本编辑器的ctrl + Z功能

# 撤销和重做

很多时候，我们需要撤销一系列的命令。比如在围棋中，已经下了10布棋，我们需要一次性悔到第5步。在这之前，我们可以把所有执行过的下棋命令都储存在一个历史列表中，然后倒序循环来依次执行这些命令的undo操作，知道循环到第5个命令为止

然后，在某些请看下无法顺利的利用undo操作回到之前的状态。比如在canvas画图中，画布上有一些点，我们在这些点之间画了N条曲线把这些点相互连接起来，当然这是用命令模式来实现的。但是我们很难为这里的对象定义一个擦除某条曲线的undo操作，因为在canvas中，擦除同一条线相对不容易实现。

这时候最好的办法是先清除画布，然后把刚才执行过的命令重新执行一遍，这一点同样可以利用历史列表堆栈来实现。

例如编写一款《街头霸王》游戏，命令模式可以实现播放录像功能。原理跟canvas画图的例子一样，我们把用户在键盘的输入都封装成命令，播放录像的时候只需要从头开始执行这些命令即可，代码如下

[请看街头霸王.html](街头霸王.html)

可以看到，当我们在键盘上敲下W、A、S、D这几个键完成一些动画之后，在按下Replay按钮，便会重复之前的动作

# 命令队列

队列在动画的运用场景也非常多，比如之前的小球运动程序会有个问题；快速点击按钮的时候，此时小球的前一个动画可能尚未结束，于是前一个动画会骤然停止，小球转而开始第二个动画的运动过程。但这不是用户的期望，用户希望这两个动画会排队进行

我们可以把div的这些运动过程都封装成命令对象，再把他们押金一个人队列堆栈，当动画执行完，会主动通知队列，取出队列中等待的第一个命令对象，并且执行它

可以用发布-订阅模式。再一个动画结束后发布一个消息，订阅者收到这个消息后，便可以执行下一个动画。

# 宏任务

宏任务是一组命令的集合，通过执行宏任务的命令，可以一次执行一批命令。想象一下，家里有一个万能遥控器，每天回家的时候，只要按一个特别的按钮，它就会帮我们关上房间门，顺便打开打开电脑并登录微信

```js
const closeDoorCommand = {
    execute() {
        console.log('关门')
    }
}
const openPcCommand = {
    execute() {
        console.log('打开电脑')
    }
}
const openWxCommand = {
    execute() {
        console.log('登录微信')
    }
}
```

接下来定义宏任务MacroCommand，它的结构很简单，add方法表示把子命令添加进宏任务对象，当调用execute方法时，会迭代子命令对象，并执行它们的execute方法

```js
class MacroCommand {
    commandList = []

    add(command) {
        this.commandList.push(command)
    }

    execute() {
        for (let i = 0, command; command = this.commandList[i++];) {
            command.execute()
        }
    }
}

const macroCommand = MacroCommand();
macroCommand.add(closeDoorCommand)
macroCommand.add(openPcCommand)
macroCommand.add(openWxCommand)
macroCommand.execute()
```

宏命令是命令模式与组合模式联合产物，关于组合模式的知识，下一章详细介绍

# 结语

本章我们学习了设计模式。跟许多其他语言不同，Js可以用高阶函数非常方便的实现命令模式。命令模式再JavaScript语言是一种隐形的模式


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