export interface Mensaje {
    [author: number]: {
        mail: string;
        nombre: string;
        apellido: string;
        edad: number;
        alias: string;
        avatar: string;
    };
    text: string;
}

// export class Mensaje {
//     constructor(id: string, nombre: string, apellido: string, edad: number, alias: string, avatar: string, text: string) {
//         author: Array = {
//             this.id = id;
//             this.nombre = nombre;
//             this.apellido = apellido;
//             this.edad = edad;
//             this.alias = alias;
//             this.avatar = avatar
//         };
//     this.text = text
//     }
// }
