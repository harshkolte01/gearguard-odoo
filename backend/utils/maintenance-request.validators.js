const { body, param } = require('express-validator');

/**
 * Validation rules for maintenance request creation
 */
const createRequestValidation = [
  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Subject must be between 3 and 200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),

  body('category')
    .optional()
    .isIn(['equipment', 'work_center'])
    .withMessage('Category must be equipment or work_center'),

  body('equipment_id')
    .optional()
    .isUUID()
    .withMessage('Equipment ID must be a valid UUID'),

  body('work_center_id')
    .optional()
    .isUUID()
    .withMessage('Work center ID must be a valid UUID'),

  body('type')
    .notEmpty()
    .withMessage('Type is required')
    .isIn(['corrective', 'preventive'])
    .withMessage('Type must be corrective or preventive'),

  body('scheduled_date')
    .optional()
    .isISO8601()
    .withMessage('Scheduled date must be a valid ISO 8601 date'),
];

/**
 * Validation rules for request state update
 */
const updateStateValidation = [
  param('id')
    .isUUID()
    .withMessage('Request ID must be a valid UUID'),

  body('state')
    .notEmpty()
    .withMessage('State is required')
    .isIn(['new', 'in_progress', 'repaired', 'scrap'])
    .withMessage('State must be new, in_progress, repaired, or scrap'),

  body('duration_hours')
    .optional()
    .isFloat({ min: 0.1, max: 1000 })
    .withMessage('Duration hours must be a positive number between 0.1 and 1000'),

  body('assigned_technician_id')
    .optional()
    .isUUID()
    .withMessage('Assigned technician ID must be a valid UUID'),
];

/**
 * Validation rules for request ID parameter
 */
const requestIdValidation = [
  param('id')
    .isUUID()
    .withMessage('Request ID must be a valid UUID'),
];

module.exports = {
  createRequestValidation,
  updateStateValidation,
  requestIdValidation,
};


