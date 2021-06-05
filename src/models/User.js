const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    timestamp: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    usuario: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: Number, required: true },
    address: { type: String, required: true },
    age: { type: Number, required: true },
    avatar: { type: String, required: true }
});

UserSchema.pre(
  'save',
  async function(next) {
    const user = this;
    const hash = await bcrypt.hash(user.password, 10);
    this.password = hash;
    this.timestamp = Date.now();
    next();
  }
);

UserSchema.methods.isValidPassword = async function(password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
}


const UserModel = mongoose.model('usuarios', UserSchema);

module.exports = UserModel;
