import mongoose from 'mongoose';

const cattleSchema = new mongoose.Schema({
    name: {
        type: String,
        required:
            true,
        trim: true
    },
    date_birthday: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },
    health_state: {
        type: String,
        enum: ['active', 'deceased', 'sick', 'solid'],
        default: 'active'
    },
    // Referencias a otros documentos (Relaciones)
    mother_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Cattle', default: null },
    father_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Cattle', default: null },
    breed_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Breed', required: true },

    state_production: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Cattle', cattleSchema);