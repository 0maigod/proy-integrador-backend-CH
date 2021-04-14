import { model, Schema, Document } from 'mongoose';

interface IMensaje extends Document {
    id: string;
    [author: number]: {
        email: string;
        nombre: string;
        apellido: string;
        edad: number;
        alias: string;
        avatar: string;
    };
    text: string;
    fecha: string;
}

const MensajeSchema = new Schema({
    id: { type: String, required: true },
    author: [
        {
            email: { type: String, required: true },
            nombre: { type: String, required: true },
            apellido: { type: String, required: true },
            edad: { type: Number, required: true },
            alias: { type: String, required: true },
            avatar: { type: String, required: true }
        }
    ],
    text: { type: String, required: true },
    fecha: { type: String, requider: true }
});

export default model<IMensaje>('mensajes', MensajeSchema);
