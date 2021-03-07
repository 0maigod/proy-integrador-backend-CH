export interface Producto {
    timestamp: number
    nombre: string
    descripcion: string
    precio: number
    codigo: string
    stock: number
    foto: string
    id: string
  }

export class Producto {
    constructor(timestamp: number, nombre: string, descripcion: string, precio: number, codigo: string, stock: number, foto: string, id: string) {
        this.id = id
        this.timestamp = timestamp
        this.nombre = nombre
        this.descripcion = descripcion
        this.precio = precio
        this.codigo = codigo
        this.stock = stock
        this.foto = foto
    }
}