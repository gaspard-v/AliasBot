import * as discord from 'discord.js'
import
{
    BotConfig,
}
from './api'
import
{
    BotLogs
}
from './logs'
import
{
    CommunicationDB
}
from './communicationDB'
import
{
    resolve,
    reject
}
from 'bluebird'
Promise = require('bluebird')
import
{
    handleRainbow
}
from './rainbow'
import {Global} from './global'

export class Bot
{
    private _client: discord.Client
    private _config: BotConfig
    private _log: BotLogs
    private _communicationDB: CommunicationDB
    private _rainbow: handleRainbow

    constructor(config: BotConfig, botLog: BotLogs, communication: CommunicationDB)
    {
        this._config = config
        this._log = botLog
        this._communicationDB = communication
    }
    private isAllowed(message: discord.Message, action: string): Promise < any >
    {
        return new Promise((resolve, reject) =>
        {
            const god = ['197090108397191168']
            if (god.includes(message.author.id))
            {
                resolve(true)
            }
            const id = message.author.id
            const id_server = message.guild.id
            let sql: string
            let param: string[]
            sql = `SELECT 0 FROM Servers WHERE (server_id = ? AND ${action} = '1')`
            param = [id_server]
            this._communicationDB.dbGet(sql, param)
                .then((row) =>
                {
                    if (row != null)
                    {
                        resolve(true)

                    }
                    else
                    {
                        sql = `SELECT 0 FROM Users WHERE (server_id = ? AND user_id = ?) AND (is_owner = '1' OR rules_bypass = '1' OR (rules_enable = '1' AND ${action} = '1'))`
                        param = [id_server, id]
                        this._communicationDB.dbGet(sql, param)
                            .then((row) =>
                            {
                                if (row != null)
                                {
                                    resolve(true)
                                }
                                else
                                {
                                    const member = message.guild.members.get(message.author.id)
                                    if (member.roles.size > 1)
                                    {
                                        sql = `SELECT 0 FROM Roles WHERE server_id = ? AND (rules_bypass = '1' OR (rules_enable = '1' AND ${action} = '1')) AND (`
                                        member.roles.forEach((mem) =>
                                        {
                                            sql.concat("role_id = '")
                                            sql.concat(mem.id)
                                            sql.concat("' OR")
                                        })
                                        sql = sql.substring(0, sql.length - 2).concat(')')
                                        param = [id_server]
                                        this._communicationDB.dbGet(sql, param)
                                            .then((row) =>
                                            {
                                                if (row != null)
                                                {
                                                    resolve(true)
                                                }
                                                else
                                                {
                                                    resolve(false)
                                                }
                                            })
                                            .catch((err) =>
                                            {
                                                reject(err)
                                            })
                                    }
                                    else
                                    {
                                        resolve(false)
                                    }
                                }
                            })
                            .catch((err) =>
                            {
                                reject(err)
                            })
                    }

                })
                .catch((err) =>
                {
                    reject(err)
                })

        })

    }
    private helpMessage(message: discord.Message)
    {
        message.author.send(`
__**Liste des commandes disponible**__
        
__Config__
**setrules @role ou @user** - Régle les permissions pour une utilisateur ou un role
**setrulesGlobal** - Règle les permissions global du serveur
**resetrule @role ou @user** - Remet les permissions par defaut
**resetrulesGlobal** - Remet les permissions du serveur par defaut
**listrules @role ou @user** - Liste les permissions d'un role ou d'un utilisateur
**listrulesGlobal** - Liste les permissions du serveur

__Fonctionnement des permissions__
Le système de permission fonctionne sur liste blanche
si un utilisateur souhaite faire une actions, le bot
va dabors chercher si les droits du serveur lui permette
d'effectuer l'action. si non, alors il va chercher si l'utilisateur
à les droits, si non alors il va chercher si l'un de ses roles
a les droits

règles global du serveur
        |
        |
        V
règles du l'utilisateur
        |
        |
        V
règles des roles de l'utilisateur

__Liste des permissions possible__
**allow_use_bot** - autorisé d'utiliser le bot, c'est à dire utilisé le bot musique, help, et d'autres fonctionnalité
**allow_set_bot** - autorisé à règler le bot, ses permissions, etc. **à utiliser avec prudence**
**allow_use_alias** - autorisé à utiliser les alias d'image
**allow_create_alias** - autorisé à créer des alias d'image
**allow_set_rainbow** - autorisé à mettre des roles en rainbow

d'autre règles existe pour les utilisateurs et les roles:
**rules_enable** - règle activer, ou non
**rules_bypass** - bypass toute les règles, le role ou l'utilisateur qui a ce mode activé peut tout faire. **à utiliser avec prudence**
De plus, le propriétaire du serveur a tous les droits.`)
    .catch(console.error)

message.author.send(`
 
__Utilisation des permissions__
**nom_de_la_permission** - pour activer une permission
**-nom_de_la_permission** - pour la desactiver
**exemple:** ${this._config.PREFIX}setrules @userTest allow_use_alias -allow_create_alias
dans cette exemple, les droits de l'utilisateur @userTest d'utiliser un alias lui sont accordés, et les droits de créer un alias lui sont retiré

__Alias__
**setalias nomAlias <URL>** - Créer un alias avec le nom "nomAlias"
*le paramètre URL est optionnel, soit on un met l'URL de l'image*
*soit on poste une image après, sans spécifier d'URL*
**delalias nomAlias ou expression Wildcard** - Supprimer un ou plusieurs alias
**listalias nomAlias ou expression Wilcard <--show>** - Montre des informations sur un ou plusieurs alias
*le paramètre optionnel --show montre l'image de/des l'alias*
les expression Wildcard sont utilisé, ils sont de la forme "abc\u005C*xyc"
"\*" signifie un nombre indeterminé de caractère
exemple: listalias * : liste tout les alias 

__Rainbow__
**setrainbow -r @role <-c> #HEXCOLOR1 #HEXCOLOR2 #ETC <-t> temps en minute <-r>**
met un role en rainbow (ou le met à jour)
-r : spécifie un role
-c : *paramètre optionnel* choisie les couleurs en au format hexadécimal. exemple: **#00CCFF**
-t : *paramètre optionnel* temps entre chaque couleur, en minutes
-r : *paramètre optionnel* mode aléatoire
**delrainbow @role** - enleve le mode rainbow d'un role
**listrainbow** - liste les role en rainbow`)
            .catch(console.error)
        message.reply("Un message d'aide vous a été envoyé dans vos DM")
    }
    private argParser(args: string[]): object
    {
        let objet = new Object()
        let lastArg = ""
        let isArg = false
        args.forEach((arg, index,) => {
            if(arg.startsWith('-'))
            {
                if(isArg === true)
                {
                    objet[lastArg.substr(1)] = true
                }
                if(index === args.length)
                {
                    objet[arg.substr(1)] = true
                }
                lastArg = arg
                isArg = true
            }
            if(lastArg)
            {
                objet[lastArg.substr(1)].push(arg)
               // problème a regler ici
                isArg = false
            }
        })
        return objet
    }
    private controlRainbow(action: "delete", message: discord.Message): boolean
    private controlRainbow(action: "set", message: discord.Message, args: string[]): boolean
    private controlRainbow(action: string, message: discord.Message, args?: string[]): boolean
    {
        let retour = true

        if(message.mentions.roles.size === 0)
        {
            message.reply("veuillez mentionner au moins un role")
        }
        message.mentions.roles.forEach(role => {
            if(action == "delete")
            {
                this._rainbow.deleteRainbow(role.id, role.guild.id)
                .then((retour) => {
                    message.channel.send(retour)
                })
            }
            if(action == "set")
            {
                const argsParser = this.argParser(args)
                let defaultParam = {  c : this._config.DEFAULT_COLORS,
                                      t : 30,
                                      r : false
                                    }
                Object.assign(defaultParam, argsParser)
                this._rainbow.setRainbow(role.id, role.guild.id, defaultParam.c, defaultParam.t, this._client, defaultParam.r)
                .then(() => {
                    message.channel.send(`role @${role.name} mis en rainbow`)
                })
                .catch((err) => {
                    message.channel.send(`${err}`)
                })
            }
        })
        return retour
    }
    public start()
    {
        if (!this._config.TOKEN)
        {
            throw new Error('token discord non valide')
        }
        this._client = new discord.Client()
        this._client.on('ready', () =>
        {
            let sqlServer = `REPLACE INTO Servers (
                server_id,
                server_name
            )
            VALUES`
            let sqlOwer = `REPLACE INTO Users (
                user_id,
                server_id,
                user_name,
                is_owner
            )
            VALUES`
            //let sqlRainbow = `SELECT hex_color, role_id FROM Rainbow INNER JOIN Roles
            //ON Rainbow.role_id = Roles.roles_id`
            const sqlRainbow = `SELECT e.hex_color hex, f.role_id role, f.is_random random, f.server_id server, f.loop_time time \
            FROM Rainbow e, Roles f \
            WHERE f.is_rainbow = 1 AND f.role_id = e.role_id ORDER BY f.server_id`
            this._client.guilds.forEach((guild) =>
            {
                sqlServer = sqlServer.concat(`(
                    '${guild.id}',
                    '${guild.name}'
                ),`)
                sqlOwer = sqlOwer.concat(`(
                    '${guild.ownerID}',
                    '${guild.id}',
                    '${guild.owner.displayName}',
                    '1'
                ),`)
                sqlServer = sqlServer.substring(0, sqlServer.length - 1).concat(';')
                sqlOwer = sqlOwer.substring(0, sqlOwer.length - 1).concat(';')
                sqlServer = sqlServer + sqlOwer
            })
            this._communicationDB.dbExec(sqlServer)
                .catch((err) =>
                {
                    console.log(err)
                })
            this._rainbow = new handleRainbow()
            this._communicationDB.dbAll(sqlRainbow)
                .then((rows) =>
                {
                    let currentRole: string
                    let objRainbow = []
                    //let current_loop = -1
                    rows.forEach((row, current_loop) =>
                    {
                        if (currentRole != row.role)
                        {
                            objRainbow.push(
                            {
                                id_role: row.role,
                                id_server: row.server,
                                time: row.time,
                                random: (row.random == 1) ? true : false,
                                colors: []
                            })
                        }
                        objRainbow[current_loop].colors.push(row.hex)
                        currentRole = row.role
                    })
                    objRainbow.forEach((role) =>
                    {
                        this._rainbow.setRainbow(role.id_role, role.id_server, role.colors, role.time, this._client, role.random)
                            .catch((err) =>
                            {
                                console.log(err)
                            })
                    })
                })
                .catch((err) =>
                {
                    console.log(err)
                })
            this._client.user.setActivity(`${this._config.GAME}`,
            {
                type: 'WATCHING'
            })
            this._log.botWrite('INFO', 'Bot Démarré !')

        })
        this._client.on('message', async (message) =>
        {
            if (message.content.startsWith(this._config.PREFIX))
            {
                const args = message.content.slice(this._config.PREFIX.length).trim().split(/ +/g)
                const command = args.shift()
                if (this._config.COMMANDS.includes(command.toLowerCase()))
                {
                    switch (command.toLowerCase())
                    {
                        case 'help':
                            this.helpMessage(message)
                            break;
                        case 'setalias':
                            //TODO
                            break;
                        case 'listalias':
                            //TODO
                            break;
                        case 'delalias':
                            //TODO
                            break;
                        case 'setrules':
                            //TODO
                            break;
                        case 'setrulesglobal':
                            //TODO
                            break;
                        case 'resetrule':
                            //TODO
                            break;
                        case 'resetrulesglobal':
                            //TODO
                            break;
                        case 'listrules':
                            //TODO
                            break;
                        case 'listrulesglobal':
                            //TODO
                            break;
                        case 'setrainbow':
                            this.controlRainbow("set", message, args)
                            break;
                        case 'delrainbow':
                            this.controlRainbow("delete", message)
                            break;
                        case 'listrainbow':
                            //TODO
                            break;
                        default:
                            message.channel.send("Cette commande n'existe pas")
                                .catch(console.error)
                    }
                }
                else
                {
                    this._communicationDB.dbGet("SELECT alias_url FROM Alias WHERE server_id = ? AND alias_name = ?", [`${message.guild.id}`, `${command}`])
                        .then((row) =>
                        {
                            if (row)
                            {
                                this.isAllowed(message, "allow_use_alias")
                                    .then((value) =>
                                    {
                                        if (value)
                                        {
                                            message.channel.send(
                                            {
                                                files: [row.alias_url]
                                            })
                                        }
                                        else
                                        {
                                            message.reply("vous n'êtes pas autorisé à faire cette action")
                                            .catch(console.error)
                                        }
                                    })
                                    .catch((e) =>
                                    {
                                        message.channel.send(`Erreur: le serveur indique "${e}"`)
                                            .catch(console.error)
                                        console.error(e)
                                    })

                            }
                            else
                            {
                                message.channel.send("Cette commande n'existe pas")
                                .catch(console.error)
                            }
                        })
                        .catch((err) =>
                        {
                            message.channel.send(`Erreur: le serveur indique "${err}"`)
                            .catch(console.error)
                            console.error(err)
                        })
                }
            }
        })
        this._client.on('guildCreate', async (guild) =>
        {
            this._communicationDB.dbRun(`INSERT INTO Servers  (
                    server_id,
                    server_name
                )
                VALUES ( ? , ? )`, [guild.id, guild.name])
                .then(() =>
                {
                    this._communicationDB.dbRun(`INSERT INTO Users  (
                    user_id,
                    server_id,
                    user_name,
                    is_owner
                )
                VALUES ( ? , ? , ? , ?)`, [guild.ownerID, guild.id, guild.owner.displayName, '1'])
                })
                .catch((err) =>
                {
                    console.error(err)
                })

        })
        this._client.on('guildDelete', async (guild) =>
        {
            this._rainbow.deleteAllRainbow(guild.id)
            this._communicationDB.dbRun(`DELETE FROM Servers \
            WHERE server_id = ?`, [guild.id])
        })
        this._client.login(this._config.TOKEN)
            .catch((err) =>
            {
                console.error(err)
            })
    }
}