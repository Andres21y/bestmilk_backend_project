import mongoose from 'mongoose';

const breedSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: { type: String }
}, { timestamps: true });

export default mongoose.model('Breed', breedSchema);