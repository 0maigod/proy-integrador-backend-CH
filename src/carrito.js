export class Carrito {
    constructor(id, productos) {
        this.id = id;
        this.timestamp = Date.now();
        this.productos = productos;
    }
}
