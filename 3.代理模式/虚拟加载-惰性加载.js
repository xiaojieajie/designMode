const miniConsole = (function() {
    const cache = []
    const handler = function(ev) {
        if (ev.keyCode === 112) {
            const script = document.createElement('script')
            script.onload = function() {
                for(let i = 0, fn; fn = cache[i++];) {
                    fn()
                }
            };
            script.src = 'miniConsole.js'
            document.getElementsByClassName('head')[0].appendChild(script)
            document.body.removeEventListener('keydown', handler)
        }
    }
    document.body.addEventListener('keydown', handler, false)
    return {
        log() {
            const args = arguments
            cache.push(() => {
                return miniConsole.apply(miniConsole, args)
            })
        }
    }
})

miniConsole.log(11) // 开始打印log

miniConsole = {
    log() {
        // 真正的代码略
    }
}





