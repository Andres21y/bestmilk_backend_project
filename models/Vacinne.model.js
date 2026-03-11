const vaccineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    lote: {
        type: String,
        required: true
    },
    expiration_date: {
        type: Date,
        required: true
    },
    description: String
}, { timestamps: true });
vaccineSchema.index({ lote: 1, company: 1 }, { unique: true }); // Índice único compuesto
export const Vaccine = mongoose.model('Vaccine', vaccineSchema);