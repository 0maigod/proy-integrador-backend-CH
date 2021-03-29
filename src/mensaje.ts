export interface Mensaje {
    fecha: string;
    email: string;
    mensaje: string;
}

export class Mensaje {
    constructor(fecha: string, email: string, mensaje: string) {
        this.fecha = fecha;
        this.email = email;
        this.mensaje = mensaje;
    }
}
