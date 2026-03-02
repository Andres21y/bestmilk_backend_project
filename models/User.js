import  mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    nit: String,
    name: String,
    last_name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rol: String,
    state: String,
    phone: String,
    address: String,
    date_register: Date,
    last_login: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date
}, { collection: 'Users' });

export default mongoose.model('User', UserSchema);