import Cattle from '../models/Cattle.js';
import Production from '../models/Production.js';

export const createCattle = async (req, res) => {
    try {
        const newCattle = new Cattle(req.body);
        await newCattle.save();
        res.status(201).json({ msg: "Res registrada correctamente", newCattle });
    } catch (error) {
        res.status(400).json({ msg: "Error al registrar res", error: error.message });
    }
};

export const addProduction = async (req, res) => {
    try {
        // Asignamos automáticamente el ID del usuario logueado que registra
        const production = new Production({
            ...req.body,
            user_id: req.user.id
        });
        await production.save();
        res.status(201).json({ msg: "Producción registrada", production });
    } catch (error) {
        res.status(400).json({ msg: "Error en el registro de producción" });
    }
};

export const getCattle = async (req, res) => {
    try {
        // .populate trae la información de la Raza en lugar de solo el ID
        const cattle = await Cattle.find().populate('breed_id', 'nombre');
        res.json(cattle);
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener ganado" });
    }
};