const { model, Schema, Model, Document } = require('mongoose');

const ProductoSchema = new Schema({
    timestamp: { type: Number, required: true },
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true },
    codigo: { type: String, required: true },
    stock: { type: Number, required: true },
    foto: { type: String, required: true }
});

module.exports = model('productos', ProductoSchema);
