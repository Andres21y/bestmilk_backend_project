import { Health, Cattle } from '../models/index.js';

// Registrar una nueva inspección de salud
export const addHealthRecord = async (req, res) => {
    try {
        const { cattle_id } = req.body;

        // 1. Verificar existencia del animal
        const animal = await Cattle.findById(cattle_id);
        if (!animal) {
            console.error(`Health record failed: Cattle ${cattle_id} not found`);
            return res.status(404).json({ msg: "The specified cattle record was not found" });
        }

        // 2. Crear el registro vinculando al usuario logueado
        const healthRecord = new Health({
            ...req.body,
            user_id: req.user.id
        });

        await healthRecord.save();

        // Log de auditoría
        console.info(`Health record created: [${req.body.state}] for Cattle ${cattle_id} by User ${req.user.id}`);

        res.status(201).json({ msg: "Health record successfully saved" });

    } catch (error) {
        console.error("Critical error in addHealthRecord:", error.message);
        res.status(500).json({ msg: "An internal error occurred while saving the health record" });
    }
};

// Obtener historial médico
export const getHealthHistory = async (req, res) => {
    try {
        const { cattle_id } = req.query;
        let query = {};
        if (cattle_id) query.cattle_id = cattle_id;

        const history = await Health.find(query)
            .populate('cattle_id', 'name')
            .populate('user_id', 'name last_name')
            .sort({ inspection_date: -1 });

        res.json(history);

    } catch (error) {
        console.error("Error fetching health history:", error.message);
        res.status(500).json({ msg: "Could not retrieve medical records" });
    }
};

// Actualizar un registro médico (Solo Admin)
export const updateHealthRecord = async (req, res) => {
    try {
        const updatedRecord = await Health.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedRecord) return res.status(404).json({ msg: "Record not found" });

        console.info(`Health record ${req.params.id} updated by Admin ${req.user.id}`);
        res.json({ msg: "Medical record updated successfully" });
        
    } catch (error) {
        console.error("Error in updateHealthRecord:", error.message);
        res.status(500).json({ msg: "Internal server error during update" });
    }
};

// Eliminar registro médico (Solo Admin)
export const deleteHealthRecord = async (req, res) => {
    try {
        const record = await Health.findByIdAndDelete(req.params.id);
        if (!record) return res.status(404).json({ msg: "Record not found" });

        console.info(`Health record ${req.params.id} deleted by Admin ${req.user.id}`);
        res.json({ msg: "Medical record successfully removed" });

    } catch (error) {
        console.error("Error in deleteHealthRecord:", error.message);
        res.status(500).json({ msg: "Internal server error during deletion" });
    }
};