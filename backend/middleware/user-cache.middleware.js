const prisma = require('../prisma/client');

/**
 * User Cache Middleware
 * Fetches user data with team memberships once per request and caches it
 * This eliminates redundant user queries in service functions
 */

/**
 * Cache user data with team memberships
 * Attaches full user object to req.userWithTeams
 */
const cacheUserData = async (req, res, next) => {
  try {
    if (req.user && req.user.id) {
      // Fetch user with team memberships once per request
      const fullUser = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: { 
          teamMemberships: {
            select: {
              team_id: true,
              team: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });
      
      if (!fullUser) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found',
          },
        });
      }

      // Attach to request object for use in services
      req.userWithTeams = fullUser;
    }
    next();
  } catch (error) {
    console.error('User cache middleware error:', error);
    next(error);
  }
};

module.exports = { cacheUserData };

