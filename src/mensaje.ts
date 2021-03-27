export interface Mensaje {
    timestamp: number;
    email: string;
    mensaje: string;
    id: string;
}

export class Mensaje {
    constructor(timestamp: number, email: string, mensaje: string, id: string) {
        this.id = id;
        this.timestamp = timestamp;
        this.email = email;
        this.mensaje = mensaje;
    }
}
