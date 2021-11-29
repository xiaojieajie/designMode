abstract class Beverage {
    
    public init(): void {
        this.boilWater()
    }

    public boilWater(): void {
        console.log('把水煮沸')
    }

    abstract brew(): void;

    abstract pourInCup(): void

    abstract addCondiments(): void
    
}


class Coffee extends Beverage {
    brew(): void {
        console.log('沸水冲咖啡')
    }
    pourInCup(): void {
        console.log('把咖啡倒进杯子')
    }
    addCondiments(): void {
        console.log('加糖和牛奶')
    }
}

class Tea extends Beverage {
    brew(): void {
        console.log('沸水浸泡茶叶')
    }
    pourInCup(): void {
        console.log('把茶水倒进杯子')
    }
    addCondiments(): void {
        console.log('加柠檬')
    }
}

