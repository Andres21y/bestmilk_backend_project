import { check, validationResult } from 'express-validator';

// Reglas para el REGISTRO
const validateRegister = [
    check('nit', 'The NIT is required').not().isEmpty().trim(),
    check('name', 'The name is required and must have at least 4 characters').isLength({ min: 4 }).trim(),
    check('last_name', 'The last name is required').not().isEmpty().trim(),
    check('email', 'Please enter a valid email address').isEmail().normalizeEmail(),
    check('password', 'The password must be at least 8 characters long, include an uppercase letter and a number')
        .isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
    check('phone', 'The phone number must be valid').optional().isNumeric(),

    // Función que captura los errores y los envía al cliente
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                ok: false,
                errors: errors.array() // Enviamos la lista de errores detallada
            });
        }
        next();
    }
];

// Reglas para el LOGIN
const validateLogin = [
    check('email', 'A valid email is required').isEmail().normalizeEmail(),
    check('password', 'Password is required').not().isEmpty(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ ok: false, errors: errors.array() });
        }
        next();
    }
];

// Reglas para la RAZA
const validateBreed = [
    check('name', 'The breed name is required and must be at least 3 characters long.').not().isEmpty().trim().isLength({ min: 3 }),
    check('description', 'The description cannot exceed 200 characters').optional().isLength({ max: 200 }),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ ok: false, errors: errors.array() });
        }
        next();
    }
];

export default {
    validateRegister,
    validateLogin,
    validateBreed
}