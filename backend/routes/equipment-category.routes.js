const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/equipment-category.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/rbac.middleware');

/**
 * Equipment Category Routes
 * All routes require authentication
 * Create/Update/Delete require admin role
 */

/**
 * @route   GET /api/equipment-categories
 * @desc    Get all equipment categories
 * @access  All authenticated users
 */
router.get('/', authMiddleware, categoryController.getCategories);

/**
 * @route   GET /api/equipment-categories/:id
 * @desc    Get single category details
 * @access  All authenticated users
 */
router.get('/:id', authMiddleware, categoryController.getCategoryById);

/**
 * @route   POST /api/equipment-categories
 * @desc    Create new equipment category
 * @access  Admin only
 */
router.post('/', authMiddleware, requireAdmin, categoryController.createCategory);

/**
 * @route   PATCH /api/equipment-categories/:id
 * @desc    Update equipment category
 * @access  Admin only
 */
router.patch('/:id', authMiddleware, requireAdmin, categoryController.updateCategory);

/**
 * @route   DELETE /api/equipment-categories/:id
 * @desc    Delete equipment category
 * @access  Admin only
 */
router.delete('/:id', authMiddleware, requireAdmin, categoryController.deleteCategory);

module.exports = router;


