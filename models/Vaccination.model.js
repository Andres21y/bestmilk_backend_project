const vaccinationRecordSchema = new mongoose.Schema({
    cattle_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cattle',
        required: true
    },
    vaccine_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vaccine',
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    application_date: {
        type: Date,
        required: true
    },
    dose: Number,
    next_dose: Date,
    observations: String
});
export const Vaccination = mongoose.model('Vaccination', vaccinationRecordSchema);