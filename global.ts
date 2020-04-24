export class Global {
    public static verifMessage(message: string, callback: Function, empty = false): void
    {
        if(message || empty) {
            let debut = 0
            let fin = 0
            for(let i = 0 ; i <= Math.floor(message.length)/2000 ; i++)
            {
                debut = fin
                fin+=2000
                if(Math.floor(message.length)/2000 === i)
                {
                    callback(message.slice(debut, message.length))
                }
                else
                {
                    callback(message.slice(debut, fin-1))
                }
                
            }
        }
    }
}