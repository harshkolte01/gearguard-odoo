const categoryService = require('../services/equipment-category.service');

/**
 * Equipment Category Controller
 * Handle HTTP requests for equipment categories
 */

/**
 * Get all equipment categories
 * GET /api/equipment-categories
 */
const getCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to get categories',
        details: error.message
      }
    });
  }
};

/**
 * Get single category by ID
 * GET /api/equipment-categories/:id
 */
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id);

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Get category error:', error);
    
    if (error.message === 'Category not found') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Category not found',
          details: 'The requested category does not exist'
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to get category',
        details: error.message
      }
    });
  }
};

/**
 * Create new equipment category
 * POST /api/equipment-categories
 */
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validation
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Category name is required',
          details: 'Please provide a valid category name'
        }
      });
    }

    const category = await categoryService.createCategory({ name, description });

    res.status(201).json({
      success: true,
      data: category,
      message: 'Category created successfully'
    });
  } catch (error) {
    console.error('Create category error:', error);

    if (error.message === 'Category with this name already exists') {
      return res.status(409).json({
        success: false,
        error: {
          code: 'DUPLICATE_ERROR',
          message: 'Category already exists',
          details: error.message
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to create category',
        details: error.message
      }
    });
  }
};

/**
 * Update equipment category
 * PATCH /api/equipment-categories/:id
 */
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await categoryService.updateCategory(id, { name, description });

    res.json({
      success: true,
      data: category,
      message: 'Category updated successfully'
    });
  } catch (error) {
    console.error('Update category error:', error);

    if (error.message === 'Category not found') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Category not found',
          details: 'The category you are trying to update does not exist'
        }
      });
    }

    if (error.message === 'Category with this name already exists') {
      return res.status(409).json({
        success: false,
        error: {
          code: 'DUPLICATE_ERROR',
          message: 'Category name already in use',
          details: error.message
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to update category',
        details: error.message
      }
    });
  }
};

/**
 * Delete equipment category
 * DELETE /api/equipment-categories/:id
 */
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await categoryService.deleteCategory(id);

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);

    if (error.message === 'Category not found') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Category not found',
          details: 'The category you are trying to delete does not exist'
        }
      });
    }

    if (error.message === 'Cannot delete category with associated equipment') {
      return res.status(409).json({
        success: false,
        error: {
          code: 'CONFLICT',
          message: 'Cannot delete category',
          details: 'This category has associated equipment. Please reassign or remove the equipment first.'
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to delete category',
        details: error.message
      }
    });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};


