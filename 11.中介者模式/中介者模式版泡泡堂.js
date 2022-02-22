const players = []

class Player {
    constructor(name, teamColor) {
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
     * 玩家死亡
     */
    die() {
        this.state = 'dead' // 设置状态为死亡
        playerDirector.receiveMessage('playerDead', this) // 给中介者发送消息，玩家死亡
    }

    /**
     * 移除玩家
     */
    remove() {
        playerDirector.receiveMessage('removePlayer', this) // 给中介者发送消息，移除玩家
    }

    /**
     * 切换队伍
     */
    changeTeam(color) {
        playerDirector.receiveMessage('changeTeam', this, color) // 给中介者发送消息，玩家换队
    }   
}

/**
 * 在继续改写之前创建玩家对象的工厂函数，可以看到，因为工厂函数里不再需要给创建的玩家对象设置队友和敌人，这个工厂函数失去了工厂的意义：
 */

 const playerFactory = function(name, teamColor) {
    const newPlayer = new Player(name, teamColor) // 创建一个玩家

    playerDirector.receiveMessage('addPlayer', newPlayer)// 给中介者发消息，新增玩家

    return newPlayer
}

/**
 * 最后，我们实现这个中介者playerDirector对象
 */


const playerDirector = (() => {
    const players = {}, // 保存所有玩家
          operations = {} // 中介者的操作
    
    /**
     * 新增一个玩家
     */
    operations.addPlayer = function(player) {
        const teamColor = player.teamColor // 玩家的队伍颜色
        players[teamColor] = players[teamColor] || [] // 如果该颜色的玩家没有成立队伍，则新成立一个队伍
        players[teamColor].push(player) // 添加玩家进队伍
    }

    /**
     * 移除一个玩家
     */
    operations.removePlayer = function(player) {
        const teamColor = player.teamColor // 玩家的队伍颜色
        const teamPlayers = players[teamColor] || [] // 该队伍所有成员
        for(let i = teamPlayers.length - 1; i >= 0; i--) {
            if (teamPlayers[i] === player) {
                teamPlayers.splice(i, 1)
            }
        }
    }

    /**
     * 玩家换队
     */
     operations.changeTeam = function(player, newTeamColor) {
        operations.removePlayer(player) // 从原队伍中移除
        player.teamColor = newTeamColor // 改变队伍颜色
        operations.addPlayer(player) // 增加到新队伍中
    }


    /**
     * 玩家死亡
     */
    operations.playerDead = function(player) {
        const teamColor = player.teamColor // 玩家的队伍颜色
        const teamPlayers = players[teamColor]// 该队伍所有成员
        const all_dead = teamPlayers.every(it => it.state === 'dead')

        if (!all_dead) return

        // 如果全局队友都死了，全部lose
        teamPlayers.forEach(it => it.lose())

        // 其他队伍的所有成员胜利
        for(const color in players) {
            // 同队的，返回
            if (color === teamColor) continue
            
            const teamPlayers = players[color] // 其他队伍的玩家
            
            teamPlayers.forEach(it => it.win())
        }
    }

    const receiveMessage = function(...args) {
        const typeName = args.shift()
        operations[typeName].apply(this, args)
    }

    return { receiveMessage }
})()

/**
 * 可以看到，除了中介者本身，没有一个玩家知道其他任何玩家的存在，玩家与玩家之间的耦合关系已经消除，某个玩家的任何操作都不需要通知其他玩家，而只需要给中介发送一个消息，中介者处理完消息后会把处理结果反馈给其他玩家。我们还可以继续给中介者扩展更多功能，以适应游戏需求的不断变化
 */

// 我们来看下测试结果

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

// player1.die()
// player2.die()
// player3.die()
// player4.die()

// 假设皮蛋和小乖掉线

// player1.remove()
// player2.remove()
// player3.die()
// player4.die()

// 假设皮蛋叛变了，去了蓝队

player1.changeTeam('blue')

player2.die()
player3.die()
player4.die()