import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    nit: { type: String, required: true },
    name: { type: String, required: true },
    last_name: String,
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^.+@.+$/
    },
    password: { type: String, required: true },
    rol: {
        type: String,
        required: true,
        enum: ['ADMIN', 'OPERATOR', 'VISITANTE'],
        default: 'VISITANTE'
    },
    state: {
        type: String,
        required: true,
        enum: ['ACTIVE', 'INACTIVE', 'PENDING'],
        default: 'PENDING'
    },
    phone: String,
    address: String,
    date_register: { type: Date, default: Date.now },
    last_login: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date
}, { collection: 'Users' });

export default mongoose.model('User', UserSchema);