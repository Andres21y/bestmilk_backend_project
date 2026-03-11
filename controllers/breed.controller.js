import Breed from '../models/Breed.js';

// Create
export const createBreeds = async (req, res) => {
    try {
        const data = req.body;

        // Si data es un arreglo, usamos insertMany
        if (Array.isArray(data)) {
            // Validamos que no esté vacío
            if (data.length === 0) {
                console.warn("Attempted to insert empty array of breeds");
                return res.status(400).json({ msg: "Invalid request" });
            }

            const newBreeds = await Breed.insertMany(data);
            console.info("Breeds inserted successfully (bulk)");
            return res.status(201).json({ msg: "Process completed successfully", newBreeds });
        }

        // Si es un solo objeto
        const { name, descripcion } = data;

        // Verificar si ya existe
        const exists = await Breed.findOne({ nombre: name.trim() });
        if (exists) {
            console.warn(`Duplicate breed insertion attempt. Name: ${name}`);
            return res.status(400).json({ msg: "The request could not be processed" });
        }

        const newBreed = new Breed({ name, descripcion });
        await newBreed.save();

        console.info(`Breed created successfully. Name: ${name}`);
        res.status(201).json({ msg: "Process completed successfully", newBreed });

    } catch (error) {
        // Log interno con detalle del error
        console.error("Error creating breed:", error);

        // Mensaje genérico para el cliente
        res.status(500).json({ msg: "Internal server error" });
    }
};

// Read
export const getBreeds = async (req, res) => {
    try {
        // Buscar todas las razas en la base de datos
        // Ordenadas alfabéticamente por el campo "name"
        const breeds = await Breed.find().sort({ name: 1 });

        console.info("Breeds retrieved successfully");
        res.json(breeds);

    } catch (error) {
        console.error("Error retrieving breeds:", error);
        res.status(500).json({ msg: "Internal server error" });
    }
};

// Update
export const updateBreed = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, descripcion } = req.body;

        // Buscar y actualizar. { new: true } devuelve el documento modificado
        const updatedBreed = await Breed.findByIdAndUpdate(
            id,
            { name, descripcion },
            { new: true, runValidators: true }
        );

        if (!updatedBreed) {
            console.warn(`Breed not found for update. ID: ${id}`);
            return res.status(404).json({ msg: "Resource not available" });
        }

        console.info(`Breed updated successfully. ID: ${id}`);
        res.json({ msg: "Process completed successfully", updatedBreed });

    } catch (error) {
        console.error("Error updating breed:", error);
        res.status(500).json({ msg: "Internal server error" });
    }
};

// Delete
export const deleteBreed = async (req, res) => {
    try {
        const { id } = req.params;

        // No eliminar si la raza está siendo utilizada por algún ganado
        const isUsed = await Cattle.findOne({ breed_id: id });

        if (isUsed) {
            console.warn(`Attempt to eliminate race in use. ID: ${id}`);
            return res.status(400).json({ msg: "The operation could not be completed" });
        }

        const breed = await Breed.findByIdAndDelete(id);

        if (!breed) {
            console.warn(`Raza no encontrada para eliminar. ID: ${id}`);
            return res.status(404).json({ msg: "Resource not available" });
        }

        console.info(`Breed successfully eliminated. ID: ${id}`);
        res.json({ msg: "The process was successful" });

    } catch (error) {
        console.error("Error deleting breed:", error);
        res.status(500).json({ msg: "Internal server error" });
    }
};
