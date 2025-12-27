const { validationResult } = require('express-validator');

/**
 * Middleware to validate request data and return errors if validation fails
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    // Extract error messages
    const extractedErrors = errors.array().map(err => ({
      field: err.path,
      message: err.msg,
    }));

    return res.status(400).json({
      success: false,
      errors: extractedErrors,
    });
  }
  
  next();
};

module.exports = { validate };

