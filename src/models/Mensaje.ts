import { model, Schema, Model, Document } from 'mongoose';

interface IMensaje extends Document {
    fecha: string;
    email: string;
    mensaje: string;
}

const MensajeSchema = new Schema({
    fecha: { type: String, required: true },
    email: { type: String, required: true },
    mensaje: { type: String, required: true }
});

export default model<IMensaje>('mensajes', MensajeSchema);
