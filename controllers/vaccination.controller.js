import { Cattle, Vaccine, Vaccination } from '../models/index.js';

// Registrar una nueva aplicación de vacuna
export const applyVaccine = async (req, res) => {
    try {
        const { cattle_id, vaccine_id } = req.body;

        // 1. Verificar si el animal existe
        const animal = await Cattle.findById(cattle_id);
        if (!animal) {
            console.warn(`Attempted to vaccinate non-existent animal: ${cattle_id}`);
            return res.status(404).json({ msg: "Cattle record not found" });
        }

        // 2. Verificar si la vacuna existe en el catálogo
        const vaccine = await Vaccine.findById(vaccine_id);
        if (!vaccine) {
            console.warn(`Attempted to use non-existent vaccine: ${vaccine_id}`);
            return res.status(404).json({ msg: "Vaccine not found in catalog" });
        }

        // 3. Crear el registro vinculando al usuario logueado (req.user.id)
        const newRecord = new Vaccination({
            ...req.body,
            user_id: req.user.id 
        });

        await newRecord.save();

        console.info(`Vaccination record created: Cattle ${cattle_id} - Vaccine ${vaccine_id}`);
        res.status(201).json({ msg: "Vaccination record created successfully", record: newRecord });

    } catch (error) {
        console.error("Error in applyVaccine:", error.message);
        res.status(500).json({ msg: "An error occurred while saving the vaccination record" });
    }
};

// Obtener el historial de vacunación (opcionalmente filtrado por animal)
export const getVaccinationHistory = async (req, res) => {
    try {
        const { cattleId } = req.query;
        let query = {};

        // Si se pasa cattleId por query, filtramos el historial de ese animal
        if (cattleId) query.cattle_id = cattleId;

        const history = await Vaccination.find(query)
            .populate('cattle_id', 'name')
            .populate('vaccine_id', 'name lote company')
            .populate('user_id', 'name last_name')
            .sort({ application_date: -1 });

        res.json(history);

    } catch (error) {
        console.error("Error fetching vaccination history:", error.message);
        res.status(500).json({ msg: "Could not retrieve vaccination history" });
    }
};

// Eliminar un registro de vacunación (Solo Admin)
export const deleteVaccinationRecord = async (req, res) => {
    try {
        const record = await Vaccination.findByIdAndDelete(req.params.id);
        if (!record) return res.status(404).json({ msg: "Record not found" });

        console.info(`Vaccination record ${req.params.id} deleted by admin ${req.user.id}`);
        res.json({ msg: "Record deleted successfully" });

    } catch (error) {
        console.error("Error deleting vaccination record:", error.message);
        res.status(500).json({ msg: "Internal server error" });
    }
};