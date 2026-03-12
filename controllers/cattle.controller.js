import { Cattle} from '../models/index.js';

// Crear una nueva res
export const createCattle = async (req, res) => {
    try {
        const newCattle = new Cattle(req.body);
        await newCattle.save();

        res.status(201).json({ msg: "Process successfully", cattle: newCattle });

    } catch (error) {
        console.error("Create Cattle Error:", error);
        res.status(500).json({ msg: "An error occurred while registering the animal" });
    }
};

// Obtener todo el ganado
export const getAllCattle = async (req, res) => {
    try {
        // Traemos los datos y "poblamos" la referencia de la raza para ver el nombre
        const animals = await Cattle.find()
            .populate('breed_id', 'nombre')
            .populate('mother_id', 'name')
            .populate('father_id', 'name')
            .sort({ createdAt: -1 });

        res.json(animals);

    } catch (error) {
        res.status(500).json({ msg: "Could not retrieve cattle data" });
    }
};

// Obtener una res por ID
export const getCattleById = async (req, res) => {
    try {
        const animal = await Cattle.findById(req.params.id)
            .populate('breed_id')
            .populate('mother_id', 'name')
            .populate('father_id', 'name');

        if (!animal) return res.status(404).json({ msg: "Animal not found" });

        res.json(animal);

    } catch (error) {
        res.status(500).json({ msg: "Error fetching resource" });
    }
};

// Actualizar datos de una res
export const updateCattle = async (req, res) => {
    try {
        const updatedAnimal = await Cattle.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedAnimal) return res.status(404).json({ msg: "Animal not found" });
        res.json({ msg: "The process has been successful", cattle: updatedAnimal });

    } catch (error) {
        res.status(500).json({ msg: "Error updating information" });
    }
};

// Eliminar una res (Solo Admin suele tener este permiso)
export const deleteCattle = async (req, res) => {
    try {
        // Verificamos si esta res es madre o padre de otra antes de borrar
        const isParent = await Cattle.findOne({
            $or: [{ mother_id: req.params.id }, { father_id: req.params.id }]
        });

        if (isParent) {
            return res.status(400).json({
                msg: "Cannot delete this animal because it is registered as a parent of another cattle"
            });
        }

        const animal = await Cattle.findByIdAndDelete(req.params.id);
        if (!animal) return res.status(404).json({ msg: "Animal not found" });

        res.json({ msg: "The process has been successful" });

    } catch (error) {
        res.status(500).json({ msg: "Error deleting the record" });
    }
};