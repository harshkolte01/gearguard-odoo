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

module.exports = {
  findUserByEmail,
  createUser,
  updatePassword,
};

