export interface Producto {
    timestamp: number;
    nombre: string;
    descripcion: string;
    precio: number;
    codigo: string;
    stock: number;
    foto: string;
    _id: number;
}

export class Producto {
    constructor(timestamp: number, nombre: string, descripcion: string, precio: number, codigo: string, stock: number, foto: string, _id: number) {
        this._id = _id;
        this.timestamp = timestamp;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.codigo = codigo;
        this.stock = stock;
        this.foto = foto;
    }
}
