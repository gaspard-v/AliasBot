import * as sqlite3 from 'sqlite3'
import
{
    Promise, resolve, reject
}
from 'bluebird'
import {ICommunicationDB, IComCallback} from './api'
import * as odbc from 'odbc'
import * as fs from 'fs'

export class CommunicationDB implements ICommunicationDB
{
    private _methode: string
    private _dbSqlite3: sqlite3.Database
    private _connectionDB: any
    private _sqliteDbFile: string
    private _firstStartFile: string
    private _firstStart: boolean

    constructor(methode: string, dbFile = "AliasBot.sqlite3")
    {
        this._methode = methode
        this._firstStart = true
        if (this._methode == "sqlite3-local")
        {
            this._sqliteDbFile = dbFile
            this._firstStartFile = './sql_config_file/config_sqlite3.sql'
        }
    }
    public start(): Promise<any>
    {
        const that = this
        return new Promise((resolve, reject) =>
        {
            if (this._firstStart && this._methode == "sqlite3-local")
            {
                this._firstStart = false
                this._dbSqlite3 = new sqlite3.Database(this._sqliteDbFile, (err) =>
                {
                    if (err)
                    {
                        reject(err)
                    }
                    console.log('Connected to the sqlite database.');
                    fs.readFile(this._firstStartFile, 'utf8', function(err, contents)
                    {
                        if (err)
                        {
                            reject(err)
                        }
                        that._dbSqlite3.exec(contents, function(err)
                        {
                            if (err)
                            {
                                reject(err)
                            }
                            else
                            {
                                resolve("connexion et configuration de la BDD SQLite réussies")
                            }
                        })

                    })

                })
            }
            else if(this._firstStart) {
                const connectionConfig = {
                    connectionString: `DSN=${this._methode}`,
                    loginTimeout: 10
                }
                odbc.connect(connectionConfig, (error, connection) => {
                    if(error)
                    {
                        reject(error)
                    }
                    else
                    {
                        this._connectionDB = connection
                        resolve(connection)
                    }
                })
                    /*.then((value) => {
                        console.log(this._connectionDB)
                        resolve(value)
                    })
                    .catch((err) => {
                        reject(err)
                    })*/
            }
            else {
                reject("fonction Start() appelée plusieurs fois")
            }
        })
    }
    public dbRun(query: string, param: string[] = []): Promise<any>
    /*
     * Exécute une commande, ne retourne rien
     * (utile pour insert, etc)
     */
    {
        return new Promise((resolve, reject) =>
        {
            if (this._methode == "sqlite3-local")
            {
                query = query.concat(';')
                this._dbSqlite3.run(query, param, function(err)
                {
                    if (err)
                    {
                        reject(err)
                    }
                    else
                    {
                        resolve(
                        {
                            id: this.lastID,
                            changes: this.changes
                        })
                    }
                })
            }
            else {
                //reject("méthode sql non trouvée")
                this._connectionDB.query(query, param)
                    .then((value) => {
                        resolve(value)
                    })
                    .catch((err) => {
                        reject(err)
                    })
            }
        })

    }
    public dbAll(query: string, param: string[] = []): Promise<any>
    /*
     * Exécute une commande
     * et retourne tout dans une variable
     */
    {
        return new Promise((resolve, reject) => {
            if(this._methode == "sqlite3-local") 
            {
                query = query.concat(';')
                this._dbSqlite3.all(query, param, (err, rows) => {
                    if(err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                })
            }
            else {
                //reject("méthode sql non trouvée")
                this._connectionDB.query(query, param)
                    .then((value) => {
                        resolve(value)
                    })
                    .catch((err) => {
                        reject(err)
                    })
            }
        })
    }
    public dbEach(Query: string, Callback: IComCallback): void
    public dbEach(Query: string, Param: string[], Callback: IComCallback): void
    public dbEach(query: string, arg1: string[] | IComCallback, arg2?: IComCallback): void
    /*
     * Exécute une commande
     * et pour chaque row
     * il la place dans un callback
     * (utile pour les commande qui retourne beaucoup)
     * (évite de stocker le résulta dans une variable)
     */ 
    {

        if(arg1 instanceof Array) {
            const param = arg1
            const callback = arg2
            if(this._methode == "sqlite3-local") {
                this._dbSqlite3.each(query, param, (err, row) => {           
                    callback(err, row)
                })
            } else {
                this._connectionDB.query(query, param)
                    .then((rows) => {
                        rows.forEach(element => {
                            callback(null, element)
                        })
                    })
                    .catch((err) => {
                        callback(err)
                    })
            }
        }
        else if(arg1 instanceof Function) {
            const callback = arg1
            if(this._methode == "sqlite3-local") {
                this._dbSqlite3.each(query, (err, row) => {
                    callback(err, row)
                })
            }
            else
            {
                this._connectionDB.query(query)
                    .then((rows) => {
                        rows.forEach(element => {
                            callback(null, element)
                        })
                    })
                    .catch((err) => {
                        callback(err)
                    })
            }
        }
    }
    public dbGet(query: string, param: string[] = []): Promise<any>
    /*
     * Retourne la 1er ligne uniquement
     * (utile pour récupé un serveur ou un role)
     */
    {
        return new Promise((resolve, reject) => {
            if(this._methode == "sqlite3-local")
            {
                query = query.concat(';')
                this._dbSqlite3.get(query, param, (err, row) => {
                    if(err) {
                        reject(err)
                    }
                    else {
                        resolve(row)
                    }
                })
            }
            else {
                console.log(query)
                console.log(param)
                this._connectionDB.query(query, param, (error, result) => {
                    if(error)
                    {
                        reject(error)
                    }
                    else if(result.count <= 0)
                    {
                        resolve(null)
                    }
                    else
                    {
                        resolve(result[0])
                    }
                })
            }
        })
    }
    public dbExec(query: string): Promise<any>
    /*
     * Exécute plusieurs requête mais ne retourne rien !
     * (utile pour le script de démarrage d'une BDD)
     */
    {
        return new Promise((resolve, reject) => {
            if(this._methode == "sqlite3-local")
            {
                this._dbSqlite3.exec(query, (err) => {
                    if(err) {
                        reject(err)
                    }
                    else {
                        resolve(`requête sqlite exec réussit`)
                    }
                })
            }
            else
            {
                const statements = query.split(';')
                this._connectionDB.beginTransaction()
                    .then(() => {
                        statements.forEach((statement) => {
                            this._connectionDB.query(statement)
                               .then((value) => {
                                    resolve(value)
                                })
                                .catch((err) => {
                                    reject(err)
                                })
                        })
                        this._connectionDB.commit()
                        .catch((err) => {
                            reject(err)
                        })
                    })
                    .catch((err) => {
                        reject(err)
                    })
            }
        })
    }
    public dbClose(): Promise<any>
    /*
     * Ferme la BDD 
     */
    {
        return new Promise((resolve, reject) =>
        {
            if(this._methode == "sqlite3-local") {

            
                this._dbSqlite3.close((err) =>
                {
                    if (err)
                    {
                        reject(err)
                    }
                    else
                    {
                        resolve("Close the sqlite database connection.")
                    }
                })
            }
            else {
                this._connectionDB.close()
                    .then((value) => {
                        resolve(value)
                    })
                    .catch((err) => {
                        reject(err)
                    })
            }
        })
    }
}