const FSM = {
    off: {
        buttonWasPressed() {
            console.log('关灯');
            this.button.innerHTML = '下一次我是开灯'
            this.currState = FSM.on
        }
    },
    on: {
        buttonWasPressed() {
            console.log('开灯');
            this.button.innerHTML = '下一次我是关灯'
            this.currState = FSM.off
        }
    }
}

const Light = function() {
    this.currState = FSM.off // 初始状态
    this.button = null;
}

Light.prototype.init = function() {
    const button = document.createElement('button')
    this.button = document.body.appendChild(button)
    this.button.innerHTML = '已关灯'

    this.button.onclick = () => {
        this.currState.buttonWasPressed.call(this)
    }
}

const light = new Light()
light.init()