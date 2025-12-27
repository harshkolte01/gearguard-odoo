const prisma = require('../prisma/client');

/**
 * Equipment Category Service
 * Handle business logic for equipment categories
 */

/**
 * Get all equipment categories
 * @returns {Promise<Array>} List of categories
 */
const getAllCategories = async () => {
  const categories = await prisma.equipmentCategory.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { equipment: true }
      }
    }
  });

  return categories;
};

/**
 * Get single category by ID
 * @param {string} categoryId - Category ID
 * @returns {Promise<object>} Category details
 */
const getCategoryById = async (categoryId) => {
  const category = await prisma.equipmentCategory.findUnique({
    where: { id: categoryId },
    include: {
      equipment: {
        select: {
          id: true,
          name: true,
          serial_number: true,
          status: true
        }
      },
      _count: {
        select: { equipment: true }
      }
    }
  });

  if (!category) {
    throw new Error('Category not found');
  }

  return category;
};

/**
 * Create new equipment category
 * @param {object} data - Category data
 * @returns {Promise<object>} Created category
 */
const createCategory = async (data) => {
  const { name, description } = data;

  // Check if category already exists
  const existing = await prisma.equipmentCategory.findUnique({
    where: { name }
  });

  if (existing) {
    throw new Error('Category with this name already exists');
  }

  const category = await prisma.equipmentCategory.create({
    data: {
      name,
      description
    }
  });

  return category;
};

/**
 * Update equipment category
 * @param {string} categoryId - Category ID
 * @param {object} data - Update data
 * @returns {Promise<object>} Updated category
 */
const updateCategory = async (categoryId, data) => {
  const { name, description } = data;

  // Check if category exists
  const existing = await prisma.equipmentCategory.findUnique({
    where: { id: categoryId }
  });

  if (!existing) {
    throw new Error('Category not found');
  }

  // If name is being changed, check for duplicates
  if (name && name !== existing.name) {
    const duplicate = await prisma.equipmentCategory.findUnique({
      where: { name }
    });

    if (duplicate) {
      throw new Error('Category with this name already exists');
    }
  }

  const category = await prisma.equipmentCategory.update({
    where: { id: categoryId },
    data: {
      ...(name && { name }),
      ...(description !== undefined && { description })
    }
  });

  return category;
};

/**
 * Delete equipment category
 * @param {string} categoryId - Category ID
 * @returns {Promise<void>}
 */
const deleteCategory = async (categoryId) => {
  // Check if category exists
  const existing = await prisma.equipmentCategory.findUnique({
    where: { id: categoryId },
    include: {
      _count: {
        select: { equipment: true }
      }
    }
  });

  if (!existing) {
    throw new Error('Category not found');
  }

  // Check if category has equipment
  if (existing._count.equipment > 0) {
    throw new Error('Cannot delete category with associated equipment');
  }

  await prisma.equipmentCategory.delete({
    where: { id: categoryId }
  });
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};


