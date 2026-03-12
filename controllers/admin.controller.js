import User from '../models/User.model.js';

// Obtener todos los visitantes (solo admin)
export const getUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'visitor' }).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ msg: "Error getting users" });
    }
};

// Dar de alta o Activar/Desactivar usuario
export const toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ msg: "User not found" });

        user.active = !user.active; // Cambia el estado
        await user.save();

        res.json({ msg: `User ${user.active ? 'activated' : 'deactivated'} correctly`, user });
    } catch (error) {
        res.status(500).json({ msg: "Error updating status" });
    }
};

// Eliminar usuario
export const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ msg: "The user has been successfully removed from the system" });
    } catch (error) {
        res.status(500).json({ msg: "Error deleting user" });
    }
};