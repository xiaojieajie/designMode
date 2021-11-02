# 组合模式的定义

组合模式就是用小的子对象来构建更大的对象，而这些小的子对象本身也许是由更小的“孙对象”构成

# 组合模式的用途

回顾**命令模式**的宏命令，marcoCommand被称为组合对象，其他三个方法都是叶对象。在marcoCommand的execute方法里，并不执行正在的操作，而是遍历它所包含的叶对象，把真正的execute请求委托给这些叶对象

组合模式将对象组合成树形结构，以表示“部分-整体”的层次结构。除了用来表示树形结构之外，组合模式的另一个好处是通过对象的多态性表现，使得用户对单个对象和组合对象的使用具有一致性。

在这实际开发中会给客户带来相当大的便利性，当我们往万能遥控器里面添加一个命令的时候，并不关心这个命令是宏命令还是普通子命令。这点对于我们不重要，我们只需要确定他是一个命令，并且这个命令拥有可执行的execute方法，那么这个命令就可以被添加进万能遥控器

# 请求在树中的传递

在组合模式中，请求在树中传递的过程总是遵循一种逻辑

以宏命令为例，请求从树的最顶端的对象往下传递，如果当前处理请求的对象是叶对象（普通子命令），叶对象自身会对请求做出相应的处理；如何处理的是组合对象（宏命令），组合对象则会遍历它属下的子节点，将请求继续传递给这些子节点

# 更强大的宏命令

目前的要控制，包含了开门、开电脑和登录QQ这三个命令。现在我们需要一个**超级遥控器**，可以控制家里所有的电器，这个遥控器有如下功能

1. 打开空调
2. 打开电视和音响
3. 关门、开电脑、登录QQ

首先在节点中放置一个button来表示这个超级万能遥控器，万能遥控器上安装了一个宏命令，当执行这个宏命令时，会依次遍历执行它所包含的子命令，代码如下。

[点我查看更强大的宏命令代码](./更强大的宏命令.html)

从这个例子可以看到，基本对象可以组合为更复杂的组合对象，组合对象又可以继续组合，这样不断递归下去，这棵树的结构可以支持任意多的复杂度。在树最终被构造完成后，让整棵树运转起来非常简单，只需要调用最上层的execute方法。每当对最上层的对象进行一次请求时，实际上是在对整个树进行深度优先搜索。而创建组合对象的程序员并不关心这些内在的细节。

# 抽象类在组合模式中的作用

前面说到，组合模式最大的有点在于可以一致地对待组合对象和基本对象。这种透明性带来的遍历，在静态类型语言中体现得尤为明显。下面看一段Java代码

```java
public abstract class Component {
    // add方法，参数为Component类型
    public void add(Component child) {}
}
public class Composite extends Component {
    // add方法，参数为Component类型
    public void add(Component child) {}
}
public class Leaf extends Component {
    // add方法，参数为Component类型
    public void add(Component child) {
        throw new UnsupportedOperationExcption() // 叶对象不能再添加子节点
    }
}

public class client() {
    public static void main(String args[]) {
        Component root = new Composite();

        Component c1 = new Composite();
        Component c2 = new Composite();

        Component leaf1 = new Leaf();
        Component leaf2 = new Leaf();

        root.add(c1);
        root.add(c2);

        c1.add(leaf1);
        c1.add(leaf2)
    }
}
```

然后再JavaScript这种动态类型语言中，对象的多态性是与人俱来的，也没有编译器去检查变量的类型，JavaScript中实现组合模式的难点在于要保证组合对象和叶对象拥有相同的方法，这通常需要用鸭子类型的思想进行接口检查

在JavaScript中实现组合模式，看起来缺乏一些严谨性，我们的代码算不上安全，但能更快速和自由的开发，这既是JavaScript的缺点，也是它的优点

# 透明性带来的问题

组合对象可以拥有字节的，叶对象下面就没有子节点，所以我们也许会发生一些误操作，比如试图往叶节点中添加子节点。解决方案通常是给叶对象加上add方法，并且在里面抛出异常。

```js
    const openTvCommand = {
        execute() {
            console.log('打开电视')
        },
        add() {
            throw new Error('叶对象不能添加子节点')
        }
    }
```

