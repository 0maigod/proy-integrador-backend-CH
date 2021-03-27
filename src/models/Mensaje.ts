import { model, Schema, Model, Document } from 'mongoose';

interface IMensaje extends Document {
    timestamp: number;
    email: string;
    mensaje: string;
}

const MensajeSchema: Schema = new Schema({
    timestamp: { type: Number, required: true },
    email: { type: String, required: true },
    mensaje: { type: String, required: true }
});

export default model('mensajes', MensajeSchema);
