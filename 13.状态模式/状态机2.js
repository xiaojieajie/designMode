const delegate = function(client, delegation) {
    return {
        buttonWasPressed() {
            return delegation.buttonWasPressed.apply(client, arguments)
        }
    }
}

const FSM = {
    off: {
        buttonWasPressed() {
            console.log('关灯');
            this.button.innerHTML = '下一次我是开灯'
            this.currState = this.onState
        }
    },
    on: {
        buttonWasPressed() {
            console.log('开灯');
            this.button.innerHTML = '下一次我是关灯'
            this.currState = this.offState
        }
    }
}

const Light = function() {
    this.offState = delegate(this, FSM.off)
    this.onState = delegate(this, FSM.on)
    this.currState = this.offState // 初始状态
    this.button = null;
}

Light.prototype.init = function() {
    const button = document.createElement('button')
    this.button = document.body.appendChild(button)
    this.button.innerHTML = '已关灯'

    this.button.onclick = () => {
        this.currState.buttonWasPressed()
    }
}

const light = new Light()
light.init()