const { hasRole } = require('../services/rbac.service');

/**
 * RBAC Middleware
 * Check user role permissions
 */

/**
 * Require specific role(s)
 * @param {string[]} allowedRoles - Array of allowed roles
 * @returns {Function} Express middleware
 */
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
          details: 'Please login to access this resource',
        },
      });
    }

    if (!hasRole(req.user, allowedRoles)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Insufficient permissions',
          details: `This action requires one of these roles: ${allowedRoles.join(', ')}`,
        },
      });
    }

    next();
  };
};

/**
 * Require admin role
 */
const requireAdmin = requireRole(['admin']);

/**
 * Require admin or manager role
 */
const requireManager = requireRole(['admin', 'manager']);

/**
 * Require technician role (includes admin and manager)
 */
const requireTechnician = requireRole(['admin', 'manager', 'technician']);

/**
 * Allow all authenticated users
 */
const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
        details: 'Please login to access this resource',
      },
    });
  }
  next();
};

module.exports = {
  requireRole,
  requireAdmin,
  requireManager,
  requireTechnician,
  requireAuth,
};


