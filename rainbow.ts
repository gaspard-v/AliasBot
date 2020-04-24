import * as discord from 'discord.js'
import
{
    Promise, resolve, reject
}
from 'bluebird'

export class Rainbow {
    private _id_role: string
    private _id_server: string
    private _colors: string[]
    private _minutes: number
    private _random: boolean
    private _timer: NodeJS.Timeout
    private _client: discord.Client
    private _role: discord.Role
    private _launched: boolean
    private _currentColor: number

    constructor(id_role: string, id_server: string, colors: string[], minutes: number, client: discord.Client,  random: boolean = false) {
        this._id_role = id_role
        this._id_server = id_server
        this._colors = colors
        this._minutes = minutes*1000*60
        this._client = client
        this._random = random

        this._launched = false
        this._currentColor = 0
    }
    private changeColor(that: this): void
    {
        if(that._random)
        {
            that._currentColor = Math.floor(Math.random() * Math.floor(that._colors.length));
        }
        else 
        {
            that._currentColor++
            if(that._currentColor >= that._colors.length)
            {
                that._currentColor = 0
            }
        }
        that._role.setColor(that._colors[that._currentColor])
            .then((value) => {
                console.log(value.color)
            })
            .catch((err) => {
                console.error(err)
                //a modifier
            })
    }
    public start(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            if(this._launched)
            {
                reject("Role déjà en mode rainbow, vous devez d'abord arréter le mode rainbow")
            }
            else if(this._colors.length <= 0) {
                reject("aucune couleur n'a été spécifié")
            }
            else {
                const server = this._client.guilds.get(this._id_server)
                if(server) {
                    this._role = server.roles.get(this._id_role)
                    if(this._role) {
                        this._role.setColor(this._colors[0])
                            .then(() => {
                                this._timer = setInterval(this.changeColor.bind(null,this), this._minutes)
                                this._launched = true
                                resolve(true)
                            })
                            .catch((err) => {
                                reject(err)
                            })
                    }
                    else{
                        reject(`role ${this._id_role} du serveur ${server.id} ${server.name} non trouvé`)
                    }
                }
                else {
                    reject(`serveur ${this._id_server} non trouvé`)
                }
            }

        })
    }
    public stop(): void 
    {
        if(this._timer) {
            clearInterval(this._timer)
        }
    }
}

export class handleRainbow {
    private _rainbow: Object
    constructor() {
        this._rainbow = new Object()
    }
    public setRainbow(id_role: string, id_server: string, colors: string[], minutes: number, client: discord.Client,  random: boolean = false): Promise<any>
    {
        return new Promise((resolve, reject) => {
            if(!this._rainbow.hasOwnProperty(id_server)){
                this._rainbow[id_server] = new Object()
            }
            if(this._rainbow[id_server].hasOwnProperty(id_role)){
                this._rainbow[id_server][id_role].stop()
                delete this._rainbow[id_server][id_role]
            }
            this._rainbow[id_server][id_role] = new Rainbow(id_role, id_server, colors, minutes, client, random)
            this._rainbow[id_server][id_role].start()
                .then((value) => {
                    resolve(value)
                })
                .catch((err) => {
                    delete this._rainbow[id_server][id_role]
                    reject(err)
                })
        })
    }
    public deleteRainbow(id_role: string, id_server: string): Promise<any>
    {
        return new Promise((resolve, reject) => {
            if(!this._rainbow.hasOwnProperty(id_server)){
                resolve("le role n'est pas en rainbow")
            }
            if(!this._rainbow[id_server].hasOwnProperty(id_role))
            {
                resolve("le role n'est pas en rainbow")
            }
            this._rainbow[id_server][id_role].stop()
            delete this._rainbow[id_server][id_role]
            if(Object.entries(this._rainbow[id_server]).length === 0 && this._rainbow[id_server].constructor === Object)
            {
                delete this._rainbow[id_server]
            }
            resolve("mode rainbow désactivé")
        })
    }
    public deleteAllRainbow(id_server: string): void
    {
        if(this._rainbow.hasOwnProperty(id_server))
        {
            this._rainbow[id_server].forEach(element => {
                this._rainbow[id_server][element].stop()
                delete this._rainbow[id_server][element]
            });
            delete this._rainbow[id_server]
        }
    }
}