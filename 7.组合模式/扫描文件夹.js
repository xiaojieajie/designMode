class Folder {
    constructor(name) {
        this.name = name
        this.files = []
    }

    add(file) {
        this.files.push(file)
    }

    scan() {
        console.log(`开始扫描文件夹：${this.name}`)
        for(let i = 0, file, files = this.files; file = files[i++];) {
            file.scan()
        }
    }
}

class File {
    constructor(name) {
        this.name = name
    }

    add() {
        throw new Error('文件下面不能添加文件')
    }

    scan() {
        console.log(`开始扫描文件：${this.name}`)
    }
}

// 接下来创建一些文件夹合文件对象，并且让他们组合成一棵树

const folder = new Folder('学习资料')
const folder1 = new Folder('JavaScript')
const folder2 = new Folder('jQuery')

const file1 = new File('JavaScript设计模式')
const file2 = new File('精通jQuery')
const file3 = new File('css3')

folder1.add(file1)
folder2.add(file2)

folder.add(folder1)
folder.add(folder2)
folder.add(file3)
   

const folder3 = new Folder('Nodejs')
const file4 = new File('深入浅出Nodejs')
folder3.add(file4)


folder.scan()

