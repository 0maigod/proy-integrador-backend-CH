import { model, Schema, Model, Document } from 'mongoose';

interface IProducto extends Document {
    timestamp: number;
    nombre: string;
    descripcion: string;
    precio: number;
    codigo: string;
    stock: number;
    foto: string;
}

const ProductoSchema = new Schema({
    timestamp: { type: Number, required: true },
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true },
    codigo: { type: String, required: true },
    stock: { type: Number, required: true },
    foto: { type: String, required: true }
});

export default model<IProducto>('productos', ProductoSchema);
