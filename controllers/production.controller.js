import { Production, Cattle } from '../models/index.js';

// Registrar un nuevo ordeño
export const addProduction = async (req, res) => {
    try {
        const { cattle_id } = req.body;

        // 1. Verificar si el animal existe antes de registrar producción
        const cattleExists = await Cattle.findById(cattle_id);

        if (!cattleExists) {
            console.error(`Production failed: Cattle ID ${cattle_id} not found`);
            return res.status(404).json({ msg: "The specified animal record was not found" });
        }

        // 2. Crear registro vinculando al usuario logueado automáticamente
        const record = new Production({
            ...req.body,
            user_id: req.user.id // ID obtenido del token JWT
        });

        await record.save();

        // Log de éxito
        console.info(`Production record saved: ${record.amount_milk}L for cattle ${cattle_id} by user ${req.user.id}`);

        res.status(201).json({ msg: "Production record saved successfully" });

    } catch (error) {
        // Log detallado para el desarrollador
        console.error("Critical error in addProduction:", error.message);

        // Mensaje genérico para el cliente
        res.status(500).json({ msg: "An internal error occurred while processing the production record" });
    }
};

// Obtener historial de producción (con filtros opcionales)
export const getProductionHistory = async (req, res) => {
    try {
        const { cattle_id, startDate, endDate } = req.query;
        let filters = {};

        if (cattle_id) filters.cattle_id = cattle_id;

        // Filtro por rango de fechas si se proporcionan
        if (startDate && endDate) {
            filters.milking_date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const history = await Production.find(filters)
            .populate('cattle_id', 'name')
            .populate('user_id', 'name last_name')
            .sort({ milking_date: -1 });

        res.json(history);

    } catch (error) {
        console.error("Error in getProductionHistory:", error.message);
        res.status(500).json({ msg: "Failed to retrieve production history" });
    }
};

// Eliminar un registro (Solo Admin)
export const deleteProductionRecord = async (req, res) => {
    try {
        const record = await Production.findByIdAndDelete(req.params.id);

        if (!record) return res.status(404).json({ msg: "Record not found" });

        console.info(`Production record ${req.params.id} deleted by admin ${req.user.id}`);
        res.json({ msg: "Record successfully removed" });

    } catch (error) {
        console.error("Error in deleteProductionRecord:", error.message);
        res.status(500).json({ msg: "Internal server error during deletion" });
    }
};