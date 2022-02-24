const players = []

class Player {
    constructor(name, teamColor) {
        this.partners = [] // 队友
        this.enemies = [] // 敌人列表
        this.state = 'live' // 玩家状态
        this.name = name; // 玩家名字
        this.teamColor = teamColor // 队伍颜色
    }

    win() {
        console.log(`winner：${this.name}`);
    }
    lose() {
        console.log(`loser：${this.name}`);
    }

    /**
     * 玩家死亡的方法要稍微复杂点，我们在每个玩家死亡的时候，要遍历其他队友的生存情况，如果队友全部GG，则游戏结束
     */
    die() {
        this.state = 'dead' // 设置状态为死亡
        // 如果队友全部死亡
        const all_dead = this.partners.every(it => it.state === 'dead')
        if (!all_dead) return

        this.lose()

        this.partners.forEach(it => it.lose())

        this.enemies.forEach(it => it.win())
    }
}

/**
 * 最后定义一个工厂来创建玩家
 */

const playerFactory = function(name, teamColor) {
    const newPlayer = new Player(name, teamColor)

    players.forEach(player => {
        if (player.teamColor === newPlayer.teamColor) {
            // 如果是队友
            player.partners.push(newPlayer)
            newPlayer.partners.push(player)
        } else {
            player.enemies.push(newPlayer)
            newPlayer.enemies.push(player)
        }
    })

    players.push(newPlayer)

    return newPlayer
}

/**
 * 现在来感受一下，来创建8个角色
 */


// 红队

const player1 = playerFactory('皮蛋', 'red'),
      player2 = playerFactory('小乖', 'red'),
      player3 = playerFactory('宝宝', 'red'),
      player4 = playerFactory('小强', 'red')

// 蓝队
const player5 = playerFactory('黑妞', 'blue'),
      player6 = playerFactory('葱头', 'blue'),
      player7 = playerFactory('胖墩', 'blue'),
      player8 = playerFactory('海盗', 'blue')


/**
 * 让红队玩家全部死亡
 */

player1.die()
player2.die()
player3.die()
player4.die()