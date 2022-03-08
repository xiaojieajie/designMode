const OffLightState = function(light) {
    this.light = light
}

OffLightState.prototype.buttonWasPressed = function() {
    console.log('弱光');
    this.light.setState(this.light.weakLightState)
}

const WeakLightState = function(light) {
    this.light = light
}

WeakLightState.prototype.buttonWasPressed = function() {
    console.log('强光');
    this.light.setState(this.light.strongLightState)
}

const StrongLightState = function(light) {
    this.light = light
}
StrongLightState.prototype.buttonWasPressed = function() {
    console.log('蓝光');
    this.light.setState(this.light.blueLightState)
}

// 当我们需要为light增加一种新的状态时，只需要增加一个新的状态类，再稍微改变一些现有的代码即可
// 假设现在增加了一种蓝光的状态，那就先增加一个类

const BlueLightState = function(light) {
    this.light = light
}
BlueLightState.prototype.buttonWasPressed = function() {
    console.log('关灯');
    this.light.setState(this.light.offLightState)
}


// 接下来改写Light类

const Light = function() {
    this.offLightState = new OffLightState(this)
    this.weakLightState = new WeakLightState(this)
    this.strongLightState = new StrongLightState(this)

    this.blueLightState = new BlueLightState(this) // 下面新增的
    this.button = null
}

Light.prototype.init = function() {
    const button = document.createElement('button')
    this.button = document.body.appendChild(button)
    this.button.innerHTML = '开关'

    this.currState = this.offLightState
    this.button.onclick = () => {
        this.currState.buttonWasPressed()
    }
}
Light.prototype.setState = function(newState) {
    this.currState = newState
}

const light = new Light()
light.init()


