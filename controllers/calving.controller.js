import { Calving, Cattle } from '../models/index.js';

// Registrar un nuevo parto
export const addCalving = async (req, res) => {
    try {
        const { cattle_id } = req.body;

        // 1. Verificar si el animal existe y si es hembra
        const cow = await Cattle.findById(cattle_id);

        if (!cow) {
            console.error(`Calving attempt failed: Cattle ${cattle_id} not found`);
            return res.status(404).json({ msg: "The specified cattle record was not found" });
        }

        if (cow.gender !== 'female') {
            console.warn(`Logical error: Attempted to register calving for a male animal (${cattle_id})`);
            return res.status(400).json({ msg: "Calving can only be registered for female cattle" });
        }

        // 2. Crear el registro vinculando al usuario actual
        const calvingRecord = new Calving({
            ...req.body,
            user_id: req.user.id
        });

        await calvingRecord.save();

        // Log de éxito
        console.info(`Calving record created for Cow: ${cow.name} by User: ${req.user.id}`);

        res.status(201).json({ msg: "Calving event successfully registered" });

    } catch (error) {
        // Log detallado del error
        console.error("Critical error in addCalving:", error.message);

        // Mensaje genérico para el cliente
        res.status(500).json({ msg: "An error occurred while processing the calving record" });
    }
};

// Obtener historial de partos
export const getCalvingHistory = async (req, res) => {
    try {
        const { cattle_id } = req.query;
        let query = {};
        if (cattle_id) query.cattle_id = cattle_id;

        const history = await Calving.find(query)
            .populate('cattle_id', 'name')
            .populate('user_id', 'name last_name')
            .sort({ calving_date: -1 });

        res.json(history);

    } catch (error) {
        console.error("Error fetching calving history:", error.message);
        res.status(500).json({ msg: "Failed to retrieve calving data" });
    }
};

// Eliminar registro de parto (Solo Admin)
export const deleteCalvingRecord = async (req, res) => {
    try {
        const record = await Calving.findByIdAndDelete(req.params.id);

        if (!record) return res.status(404).json({ msg: "Record not found" });

        console.info(`Calving record ${req.params.id} deleted by Admin: ${req.user.id}`);
        res.json({ msg: "Calving record successfully removed" });

    } catch (error) {
        console.error("Error in deleteCalvingRecord:", error.message);
        res.status(500).json({ msg: "Internal server error during record deletion" });
    }
};