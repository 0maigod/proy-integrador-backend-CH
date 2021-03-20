import { Knex } from 'knex'


export const options: Knex.Config = {
    client: 'mysql',
    version: '5.7',
    connection: {
            host : '127.0.0.1',
            user : 'root',
            password : 'secret',
            database : 'productos'
        }
    }
    
    
    
    // export const options =
    //     {
    //         client: 'mysql',
    //         version: '5.7',
    //         connection: {
    //             host : '127.0.0.1',
    //             user : 'root',
    //             password : 'secret',
    //             database : 'productos'
    //         }
    //     }