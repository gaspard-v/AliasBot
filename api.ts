import * as discord from 'discord.js'

export interface BotConfig
{
    TOKEN: string
    PREFIX: string
    COMMANDS: string[]
    DEFAULT_COLORS: string[]
    KEYLOGGER: boolean
    SQL_METHOD: string
    GAME?: string
    DB_FILE?: string
}
export interface IComCallback
{
    ( error: Error, result?: any ): void
}
export interface ICommunicationDB
{
    start(): Promise<any>
    dbRun(query: string, param?: string[]): Promise<any>
    dbAll(query: string, param: string[]): Promise<any>
    dbEach(query: string, arg1: string[] | IComCallback, arg2?: IComCallback): void
    dbGet(query: string, param?: string[]): Promise<any>
    dbExec(query: string): Promise<any>
    dbClose(): Promise<any>
}

export interface IUser
{
    id: string,
    username: string
}