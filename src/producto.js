export class Producto {
    constructor(timestamp, nombre, descripcion, precio, codigo, stock, foto, id) {
        this.id = id;
        this.timestamp = timestamp;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.codigo = codigo;
        this.stock = stock;
        this.foto = foto;
    }
}
