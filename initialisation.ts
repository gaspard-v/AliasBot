import
{
    BotConfig
}
from './api'
import
{
    CommunicationDB
}
from './communicationDB'
import
{
    BotLogs
}
from './logs'
import { cpus } from 'os'
import { Promise } from 'bluebird'

export class InitialisationBot
{
    public communicationDB: CommunicationDB
    public botLogs: BotLogs
    public init(config: BotConfig): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this.communicationDB = new CommunicationDB(config.SQL_METHOD, config.DB_FILE)
            this.botLogs = new BotLogs(this.communicationDB)
            this.communicationDB.start()
            .then(() => {
                //console.log(value)
                //this.botLogs.botWrite('INFO', 'bot démarré')
                resolve()
                })    
            .catch((err) =>{
                console.error(err)
                })

        })
        
    }
}