/**
 * Query Builder Utility
 * Build complex Prisma queries dynamically
 */

/**
 * Build where clause for search
 * @param {string} searchText - Search text
 * @param {string[]} fields - Fields to search in
 * @returns {object} Prisma where clause
 */
const buildSearchWhere = (searchText, fields) => {
  if (!searchText) return {};

  const searchConditions = fields.map((field) => {
    const fieldPath = field.split('.');
    if (fieldPath.length === 1) {
      // Direct field
      return {
        [field]: {
          contains: searchText,
          mode: 'insensitive',
        },
      };
    } else {
      // Nested field
      const [relation, nestedField] = fieldPath;
      return {
        [relation]: {
          [nestedField]: {
            contains: searchText,
            mode: 'insensitive',
          },
        },
      };
    }
  });

  return {
    OR: searchConditions,
  };
};

/**
 * Build where clause for filters
 * @param {object} filters - Filter object
 * @returns {object} Prisma where clause
 */
const buildFilterWhere = (filters) => {
  const where = {};

  Object.keys(filters).forEach((key) => {
    const value = filters[key];
    
    if (value === undefined || value === null || value === '') {
      return;
    }

    // Handle comma-separated values (for multi-select filters)
    if (typeof value === 'string' && value.includes(',')) {
      const values = value.split(',').map((v) => v.trim());
      where[key] = { in: values };
      return;
    }

    // Handle range filters (gt, gte, lt, lte)
    if (typeof value === 'object' && !Array.isArray(value)) {
      where[key] = value;
      return;
    }

    // Simple equality
    where[key] = value;
  });

  return where;
};

/**
 * Build date range filter
 * @param {string} dateFrom - Start date (ISO 8601)
 * @param {string} dateTo - End date (ISO 8601)
 * @param {string} field - Date field name
 * @returns {object} Prisma where clause
 */
const buildDateRangeWhere = (dateFrom, dateTo, field = 'created_at') => {
  const where = {};

  if (dateFrom || dateTo) {
    where[field] = {};
    
    if (dateFrom) {
      where[field].gte = new Date(dateFrom);
    }
    
    if (dateTo) {
      where[field].lte = new Date(dateTo);
    }
  }

  return where;
};

/**
 * Build order by clause
 * @param {string} sortBy - Field to sort by
 * @param {string} sortOrder - Sort order (asc/desc)
 * @returns {object} Prisma orderBy clause
 */
const buildOrderBy = (sortBy = 'created_at', sortOrder = 'desc') => {
  const validOrders = ['asc', 'desc'];
  const order = validOrders.includes(sortOrder) ? sortOrder : 'desc';

  // Handle nested fields
  if (sortBy.includes('.')) {
    const [relation, field] = sortBy.split('.');
    return {
      [relation]: {
        [field]: order,
      },
    };
  }

  return {
    [sortBy]: order,
  };
};

/**
 * Build pagination
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {object} Skip and take values
 */
const buildPagination = (page = 1, limit = 10) => {
  const validPage = Math.max(1, parseInt(page) || 1);
  const validLimit = Math.min(100, Math.max(1, parseInt(limit) || 10)); // Max 100 items

  return {
    skip: (validPage - 1) * validLimit,
    take: validLimit,
  };
};

/**
 * Merge multiple where clauses
 * @param {object[]} whereClauses - Array of where objects
 * @returns {object} Merged where clause
 */
const mergeWhereClaus

es = (...whereClauses) => {
  const merged = {};
  const andConditions = [];

  whereClauses.forEach((clause) => {
    if (!clause || Object.keys(clause).length === 0) return;

    Object.keys(clause).forEach((key) => {
      if (key === 'AND') {
        andConditions.push(...clause[key]);
      } else if (key === 'OR') {
        andConditions.push({ OR: clause[key] });
      } else {
        if (merged[key]) {
          // If key already exists, merge into AND
          andConditions.push({ [key]: merged[key] });
          andConditions.push({ [key]: clause[key] });
          delete merged[key];
        } else {
          merged[key] = clause[key];
        }
      }
    });
  });

  if (andConditions.length > 0) {
    merged.AND = andConditions;
  }

  return merged;
};

/**
 * Build complete query options
 * @param {object} params - Query parameters
 * @returns {object} Complete Prisma query options
 */
const buildCompleteQuery = (params) => {
  const {
    search,
    searchFields = [],
    filters = {},
    dateFrom,
    dateTo,
    dateField = 'created_at',
    sortBy,
    sortOrder,
    page,
    limit,
    include,
    select,
  } = params;

  const query = {};

  // Build where clause
  const whereClauses = [];

  if (search && searchFields.length > 0) {
    whereClauses.push(buildSearchWhere(search, searchFields));
  }

  if (Object.keys(filters).length > 0) {
    whereClauses.push(buildFilterWhere(filters));
  }

  if (dateFrom || dateTo) {
    whereClauses.push(buildDateRangeWhere(dateFrom, dateTo, dateField));
  }

  if (whereClauses.length > 0) {
    query.where = mergeWhereClauses(...whereClauses);
  }

  // Build orderBy
  if (sortBy) {
    query.orderBy = buildOrderBy(sortBy, sortOrder);
  }

  // Build pagination
  const pagination = buildPagination(page, limit);
  query.skip = pagination.skip;
  query.take = pagination.take;

  // Include/select
  if (include) {
    query.include = include;
  } else if (select) {
    query.select = select;
  }

  return query;
};

module.exports = {
  buildSearchWhere,
  buildFilterWhere,
  buildDateRangeWhere,
  buildOrderBy,
  buildPagination,
  mergeWhereClauses,
  buildCompleteQuery,
};


