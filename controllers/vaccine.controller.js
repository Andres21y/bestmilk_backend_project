import { Vaccine, Vaccination } from '../models/index.js';

// Crear una nueva vacuna 
export const createVaccine = async (req, res) => {
    try {
        const { lote, company } = req.body;

        // Verificar si ya existe el mismo lote de la misma empresa (Evita duplicados)
        const exists = await Vaccine.findOne({ lote, company });
        if (exists) {
            return res.status(400).json({ msg: "This vaccine batch is already registered" });
        }

        const newVaccine = new Vaccine(req.body);
        await newVaccine.save();

        console.info(`Vaccine created successfully - {Name: ${newVaccine}}`);
        res.status(201).json({ msg: "Vaccine added to catalog successfully", vaccine: newVaccine });

    } catch (error) {
        console.error("Error creating vaccine:", error);
        res.status(500).json({ msg: "Error saving the vaccine record" });
    }
};

// Obtener todas las vacunas
export const getAllVaccines = async (req, res) => {
    try {
        const vaccines = await Vaccine.find().sort({ expiration_date: 1 });
        res.json(vaccines);
    } catch (error) {
        res.status(500).json({ msg: "Internal server error" });
    }
};

// Actualizar una vacuna
export const updateVaccine = async (req, res) => {
    try {
        const updatedVaccine = await Vaccine.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedVaccine) return res.status(404).json({ msg: "Vaccine not found" });
        res.json({ msg: "Vaccine updated successfully", vaccine: updatedVaccine });
    } catch (error) {
        res.status(500).json({ msg: "Internal server error" });
    }
};

// Eliminar una vacuna
export const deleteVaccine = async (req, res) => {
    try {
        // SEGURIDAD: No borrar si ya ha sido aplicada a algún animal
        // Esto mantiene la integridad de los registros históricos
        const isUsed = await Vaccination.findOne({ vaccine_id: req.params.id });
        if (isUsed) {
            return res.status(400).json({
                msg: "Cannot delete. This vaccine has already been applied to cattle and has history."
            });
        }

        const vaccine = await Vaccine.findByIdAndDelete(req.params.id);
        if (!vaccine) return res.status(404).json({ msg: "Vaccine not found" });

        res.json({ msg: "Vaccine removed from catalog" });

    } catch (error) {
        console.error("Error deleting vaccine:", error);
        res.status(500).json({ msg: "Internal server error" });
    }
};