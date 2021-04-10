import { model, Schema, Model, Document } from 'mongoose';

interface IMensaje extends Document {
    [author: number]: {
        id: string;
        nombre: string;
        apellido: string;
        edad: number;
        alias: string;
        avatar: string;
    };
    text: string;
}

const MensajeSchema = new Schema({
    author: [
        {
            id: { type: String, required: true },
            nombre: { type: String, required: true },
            apellido: { type: String, required: true },
            edad: { type: Number, required: true },
            alias: { type: String, required: true },
            avatar: { type: String, required: true }
        }
    ],
    text: { type: String, required: true }
});

export default model<IMensaje>('mensajes', MensajeSchema);
