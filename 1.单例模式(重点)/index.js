
// 1
// const Singleton = function(name) {
//     this.name = name
// }

// Singleton.instance = null

// Singleton.prototype.getName = function() {
//     alert(this.name)
// }

// Singleton.getInstance = function(name) {
//     if (!this.instance) {
//         this.instance = new Singleton(name)
//     }
//     return this.instance
// }

// const a = Singleton.getInstance('a')
// const b = Singleton.getInstance('b')

// console.log(a === b) // true

// 2

// const CreateDiv = (function() {
//     let instance;

//     const CreateDiv = function(html) {
//         if (instance) {
//             return instance
//         }
//         this.html = html
//         this.init()
//         return instance = this
//     }

//     CreateDiv.prototype.init = function() {
//         const div = document.createElement('div')
//         div.innerHTML = this.html
//         document.body.appendChild(div)
//     }

//     return CreateDiv

// })()

// const a = new CreateDiv('a')
// const b = new CreateDiv('b')

// console.log(a, b)
// console.log(a === b)


// 3

// const CreateDiv = function(html) {
//     this.html = html
//     this.init()
// }
// CreateDiv.prototype.init = function() {
//     const div = document.createElement('div')
//     div.innerHTML = this.html
//     document.body.appendChild(div)
// }

// const ProxySingletonCreateDiv = (function() {
//     let instance;
//     return function(html) {
//         if (!instance) {
//             instance = new CreateDiv('a')
//         }
//         return instance
//     }
// })()

// const a = new ProxySingletonCreateDiv('a')
// const b = new ProxySingletonCreateDiv('b')

// console.log(a, b)
// console.log(a === b)


// 4

// const myApp = {}

// myApp.namespace = function(name) {
//     const parts = name.split('.')
//     let current = myApp
//     for (let key of parts) {
//         if (!current[key]) {
//             current[key] = {}
//         }
//         current = current[key]
//     }
// }

// myApp.namespace('event')
// myApp.namespace('dom.style')

// var user = (function() {
//     const _name = 'jie',
//         _age = '22';
    
//     return {
//         getUserInfo() {
//             return _name + '-' + _age
//         }
//     }
// })()

// console.log(user.getUserInfo())

// 5

// const getLoginLayer = (function() {
//     let div;
//     return function() {
//         if (!div) {
//             div = document.createElement('div')
//             div.style.display = 'none'
//             div.innerHTML = '我是弹窗'
//             div.classList.add('popup')
//             document.body.appendChild(div)
//         }
//         return div
//     }
// })()

const open = document.getElementById('open')

const close = document.getElementById('close')

// open.onclick = function() {
//     console.log('我点击了')
//     const loginLayer = getLoginLayer()
//     loginLayer.style.display = 'block'
// }
// close.onclick = function() {
//     const loginLayer = getLoginLayer()
//     loginLayer.style.display = 'none'
// }

// 6
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


// const createSingleIframe = getSingle(function() {
//     const iframe = document.createElement('iframe')
//     document.body.appendChild(iframe)
//     return iframe
// })


// open.onclick = function() {
//     const iframe = createSingleIframe()
//     iframe.style.display = 'block'
//     iframe.src = 'https://www.bilibili.com/'
// }
// close.onclick = function() {
//     const iframe = createSingleIframe()
//     iframe.style.display = 'none'
// }

// var bindEvent = getSingle(function() {
//     console.log('我执行了内部')
//     document.getElementById('div1').addEventListener('click', function() {
//         alert('click')
//     })
    
//     return true
// })

// var render = function() {
//     console.log('我执行了')
//     bindEvent()
// }

// render()
// render()
// render()