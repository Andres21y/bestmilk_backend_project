import mongoose from 'mongoose';

const productionSchema = new mongoose.Schema({
    cattle_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cattle',
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    milking_date: {
        type: Date,
        required: true
    },
    amount_milk: {
        type: Number,
        required: true
    }, // DECIMAL(6,2) -> Number
    time_extraction: {
        type: Number,
        required: true
    }, // en minutos
    observation: { type: String }
}, { timestamps: true });

export default mongoose.model('Production', productionSchema);