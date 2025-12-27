const prisma = require('../prisma/client');
const bcrypt = require('bcryptjs');

/**
 * Find a user by email
 * @param {string} email - User email
 * @returns {Promise<Object|null>} User object or null
 */
const findUserByEmail = async (email) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  } catch (error) {
    throw new Error(`Error finding user: ${error.message}`);
  }
};

/**
 * Create a new user
 * @param {Object} userData - User data (name, email, password, role)
 * @returns {Promise<Object>} Created user object
 */
const createUser = async (userData) => {
  try {
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password_hash: userData.password_hash,
        role: userData.role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
      },
    });
    return user;
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};

/**
 * Update user password
 * @param {string} userId - User ID
 * @param {string} newPassword - New password (plain text, will be hashed)
 * @returns {Promise<Object>} Updated user object
 */
const updatePassword = async (userId, newPassword) => {
  try {
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(newPassword, saltRounds);

    const user = await prisma.user.update({
      where: { id: userId },
      data: { password_hash },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
    return user;
  } catch (error) {
    throw new Error(`Error updating password: ${error.message}`);
  }
};

/**
 * Assign equipment to user
 * @param {string} userId - User ID
 * @param {string[]} equipmentIds - Array of equipment IDs to assign
 * @returns {Promise<Object[]>} Updated equipment records
 */
const assignEquipmentToUser = async (userId, equipmentIds) => {
  try {
    // Update all specified equipment to set employee_owner_id
    const updatedEquipment = await prisma.equipment.updateMany({
      where: {
        id: { in: equipmentIds },
        status: 'active', // Only assign active equipment
      },
      data: {
        employee_owner_id: userId,
      },
    });

    return updatedEquipment;
  } catch (error) {
    throw new Error(`Error assigning equipment: ${error.message}`);
  }
};

/**
 * Auto-assign random equipment to new user
 * @param {string} userId - User ID
 * @param {number} count - Number of equipment to assign (default: 2)
 * @returns {Promise<Object[]>} Assigned equipment records
 */
const autoAssignEquipment = async (userId, count = 2) => {
  try {
    // Find random active equipment that are not already assigned
    const availableEquipment = await prisma.equipment.findMany({
      where: {
        status: 'active',
        employee_owner_id: null,
      },
      take: count,
      select: {
        id: true,
        name: true,
        serial_number: true,
      },
    });

    if (availableEquipment.length === 0) {
      return [];
    }

    const equipmentIds = availableEquipment.map(eq => eq.id);
    await assignEquipmentToUser(userId, equipmentIds);

    return availableEquipment;
  } catch (error) {
    throw new Error(`Error auto-assigning equipment: ${error.message}`);
  }
};

module.exports = {
  findUserByEmail,
  createUser,
  updatePassword,
  assignEquipmentToUser,
  autoAssignEquipment,
};

