const healthSchema = new mongoose.Schema({
    cattle_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cattle'
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    inspection_date: {
        type: Date,
        default: Date.now
    },
    state: {
        type: String,
        enum: ['ILLNESS', 'INJURY', 'CHECKUP'],
        default: 'CHECKUP'
    },
    diagnosis: String,
    treatment: String,
    medication: String,
    dosage: Number,
    observations: String
}, { timestamps: true });
export const Health = mongoose.model('Health', healthSchema);