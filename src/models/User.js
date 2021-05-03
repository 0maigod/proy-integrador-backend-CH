const { model, Schema } = require('mongoose');

const UserSchema = new Schema({
    // timestamp: { type: Number, required: true },
    username: { type: String, required: true },
    facebookId: { type: String, required: true }
    // password: { type: String, required: true }
});

module.exports = model('usuarios', UserSchema);
