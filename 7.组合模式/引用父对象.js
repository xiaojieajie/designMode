class Folder {
    constructor(name) {
        this.name = name
        this.parent = null // 增加parent属性
        this.files = []
    }

    add(file) {
        file.parent = this
        this.files.push(file)
    }

    scan() {
        console.log(`开始扫描文件夹：${this.name}`)
        for(let i = 0, file, files = this.files; file = files[i++];) {
            file.scan()
        }
    }

    // 增加remove方法

    remove() {
        if (!this.parent) {
            // 根节点或者树外的游离节点
            return
        }
        for (let files = this.parent.files, l = files.length - 1; l >= 0; l --) {
            const file = files[l]
            if (file === this) {
                files.splice(l, 1)
            }
        }
    }
}

class File {
    constructor(name) {
        this.name = name
        this.parent = null
    }

    add() {
        throw new Error('文件下面不能添加文件')
    }

    scan() {
        console.log(`开始扫描文件：${this.name}`)
    }

    // 增加remove方法

    remove() {
        if (!this.parent) {
            // 根节点或者树外的游离节点
            return
        }
        for (let files = this.parent.files, l = files.length - 1; l >= 0; l --) {
            const file = files[l]
            if (file === this) {
                files.splice(l, 1)
            }
        }
    }
}

// 下面测试一下移除文件的功能

const folder = new Folder('学习资料')
const folder1 = new Folder('JavaScript')

const file1 = new File('深入浅出Node.js')
folder1.add(new File('JavaScript设计模式与开发实践'))
folder.add(folder1)
folder.add(file1)

folder1.remove()
folder.scan()
