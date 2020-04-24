'use strict'

import { BotConfig } from './api'
import { Bot } from './bot'
import { InitialisationBot } from './initialisation'

let cfg: BotConfig
try {
    cfg = require('./bot.json') as BotConfig
}
catch {
    //TODO
}
let init = new InitialisationBot()
init.init(cfg)
    .then(() => {
        let bot = new Bot(cfg, init.botLogs, init.communicationDB)
        bot.start()
        /*init.communicationDB.dbClose()
            .then((value) => {
                console.log(value)
            })
            .catch((error) => {
                console.error(error)
            })*/
    })
