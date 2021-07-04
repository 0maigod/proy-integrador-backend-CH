const { model, Schema } = require('mongoose');

const UserSchema = new Schema({
    timestamp: { type: Number, required: true },
    username: { type: String, required: true },
    usuario: { type: String, required: true },
    adress: { type: String, required: true },
    age: { type: Number, required: true },
    phone: { type: Number, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: false},
    avatar: { type: String, required: true }
});

module.exports = model('usuarios', UserSchema);
