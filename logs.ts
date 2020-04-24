import
{
    CommunicationDB
}
from './communicationDB'

export class BotLogs
{
    private fs = require('fs')
    private _LogFile: string
    private _communicationDB: CommunicationDB
    constructor(com: CommunicationDB, logFile = "./bot.log")
    {
        this._communicationDB = com
        this._LogFile = logFile
    }
    public botWrite(type: string, message: string): void
    {
        this._communicationDB.dbRun(`INSERT INTO BotLog(type, message) VALUES('${type}', '${message}')`)
            .catch((err) =>
            {
                console.error(err)
            })

        let strLog = new Date().toLocaleString() + "    [" + type + "]  " + message
        console.log(strLog)
        strLog += '\n'
        this.fs.appendFile(this._LogFile, strLog, function(err)
        {
            if (err)
            {
                return console.error(err.message)
            }
        });
    }

    public serverWrite(type: string, message: string, server_id: string): void
    {
        try
        {
            this._communicationDB.dbRun(`INSERT INTO ServerLog(type, message, server_id) VALUES('${type}', '${message}', '${server_id}')`)
        }
        catch (e)
        {
            console.error(e)
        }
    }

}