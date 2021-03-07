import {Producto} from './producto'

export interface Carrito {
    id: string
    timestamp: number
    productos: Producto []
  }

export class Carrito {
    constructor(id: string, productos: Producto []) {
        this.id = id
        this.timestamp = Date.now()
        this.productos = productos
    }
}