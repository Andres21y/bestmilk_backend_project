import { check, validationResult } from 'express-validator';

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.warn(`[Validation Error] ${req.path}`, errors.array());
        return res.status(400).json({ ok: false, errors: errors.array() });
    }
    next();
};

// Validadores reutilizables
const cattleIdValidator = check('cattle_id', 'Invalid cattle identification').isMongoId();
const dateValidator = (field, label = null) =>
    check(field, `A valid ${label || field.replace('_', ' ')} is required`).isISO8601();

// Reglas para el REGISTRO
export const validateRegister = [
    check('nit', 'The NIT is required').notEmpty().trim(),
    check('name', 'The name is required and must have at least 4 characters').isLength({ min: 4 }).trim(),
    check('last_name', 'The last name is required').notEmpty().trim(),
    check('email', 'Please enter a valid email address').isEmail().normalizeEmail(),
    check('password', 'The password must be at least 8 characters long, include an uppercase letter and a number')
        .isLength({ min: 8 })
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
    check('phone', 'The phone number must be valid').optional({ checkFalsy: true }).isNumeric(),
    handleValidationErrors
];

// Reglas para el LOGIN
export const validateLogin = [
    check('email', 'A valid email is required').isEmail().normalizeEmail(),
    check('password', 'Password is required').notEmpty(),
    handleValidationErrors
];

// Reglas para la BREED
export const validateBreed = [
    check('name', 'The breed name is required and must be at least 3 characters long.')
        .isLength({ min: 3 })
        .trim(),
    check('description', 'The description cannot exceed 200 characters')
        .optional({ checkFalsy: true })
        .isLength({ max: 200 }),
    handleValidationErrors
];

// Reglas para CATTLE
export const validateCattle = [
    check('name', 'Name is required').notEmpty().trim(),
    dateValidator('date_birthday', 'birth date'),
    check('gender', 'Gender must be male or female').isIn(['male', 'female']),
    check('breed_id', 'Valid Breed ID is required').isMongoId(),
    check('mother_id', 'Invalid Mother ID').optional({ nullable: true }).isMongoId(),
    check('father_id', 'Invalid Father ID').optional({ nullable: true }).isMongoId(),
    handleValidationErrors
];

// Reglas para VACCINE
export const validateVaccine = [
    check('name', 'Vaccine name is required').notEmpty().trim(),
    check('company', 'Laboratory or company name is required').notEmpty().trim(),
    check('lote', 'Batch number (lote) is required').notEmpty().trim(),
    dateValidator('expiration_date', 'expiration date'),
    handleValidationErrors
];

// Reglas para RECORD
export const validateRecord = [
    check('cattle_id', 'Valid Cattle ID is required').isMongoId(),
    check('vaccine_id', 'Valid Vaccine ID is required').isMongoId(),
    dateValidator('application_date', 'application date'),
    check('dose', 'Dose must be a positive number').isFloat({ min: 0.1 }),
    check('next_dose', 'Next dose must be a valid date').optional({ nullable: true }).isISO8601(),
    handleValidationErrors
];

// Reglas para PRODUCTION
export const validateProduction = [
    cattleIdValidator,
    dateValidator('milking_date', 'milking date'),
    check('amount_milk', 'Milk amount must be a positive number').isFloat({ min: 0.01 }),
    check('time_extraction', 'Extraction time must be a positive number (minutes)').isInt({ min: 1 }),
    check('observation', 'Observations cannot exceed 100 characters').optional({ checkFalsy: true }).isLength({ max: 100 }),
    handleValidationErrors
];

// Reglas para CALVING
export const validateCalving = [
    cattleIdValidator,
    dateValidator('calving_date', 'calving date'),
    check('number_babys', 'Number of offspring must be at least 1').isInt({ min: 1 }),
    check('complication', 'Complication must be a boolean value').isBoolean(),
    check('observations', 'Observations cannot exceed 150 characters').optional({ checkFalsy: true }).isLength({ max: 150 }),
    handleValidationErrors
];

// Reglas para HEALTH
export const validateHealth = [
    cattleIdValidator,
    dateValidator('inspection_date', 'inspection date'),
    check('state', 'State must be ILLNESS, INJURY, or CHECKUP').isIn(['ILLNESS', 'INJURY', 'CHECKUP']),
    check('dosage', 'Dosage must be a number').optional({ nullable: true }).isFloat({ min: 0 }),
    check('diagnosis', 'Diagnosis cannot exceed 255 characters').optional({ checkFalsy: true }).isLength({ max: 255 }),
    handleValidationErrors
];

