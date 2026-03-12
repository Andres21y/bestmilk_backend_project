import mongoose from 'mongoose';

const calvingSchema = new mongoose.Schema({
    cattle_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cattle',
        required: true
    },
    calving_date: { type: Date, required: true },
    number_babys: { type: Number, default: 1 },
    complication: { type: Boolean, default: false },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    observations: String
}, { timestamps: true });
export default mongoose.model('Calving', calvingSchema);