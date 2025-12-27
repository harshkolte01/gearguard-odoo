/**
 * Form Validation Utilities
 * Client-side validation matching backend requirements
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate subject field (3-200 characters)
 */
export function validateSubject(text: string): ValidationResult {
  if (!text || text.trim().length === 0) {
    return { isValid: false, error: 'Subject is required' };
  }
  
  if (text.trim().length < 3) {
    return { isValid: false, error: 'Subject must be at least 3 characters' };
  }
  
  if (text.length > 200) {
    return { isValid: false, error: 'Subject must not exceed 200 characters' };
  }
  
  return { isValid: true };
}

/**
 * Validate description field (max 500 characters)
 */
export function validateDescription(text: string): ValidationResult {
  if (!text) {
    return { isValid: true }; // Description is optional
  }
  
  if (text.length > 500) {
    return { isValid: false, error: 'Description must not exceed 500 characters' };
  }
  
  return { isValid: true };
}

/**
 * Validate equipment selection
 */
export function validateEquipment(equipmentId: string): ValidationResult {
  if (!equipmentId || equipmentId.trim().length === 0) {
    return { isValid: false, error: 'Please select equipment' };
  }
  
  // Basic UUID format check
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(equipmentId)) {
    return { isValid: false, error: 'Invalid equipment selection' };
  }
  
  return { isValid: true };
}

/**
 * Validate work center selection
 */
export function validateWorkCenter(workCenterId: string): ValidationResult {
  if (!workCenterId || workCenterId.trim().length === 0) {
    return { isValid: false, error: 'Please select work center' };
  }
  
  // Basic UUID format check
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(workCenterId)) {
    return { isValid: false, error: 'Invalid work center selection' };
  }
  
  return { isValid: true };
}

/**
 * Validate scheduled date for preventive maintenance
 */
export function validateScheduledDate(
  date: string,
  type: 'corrective' | 'preventive'
): ValidationResult {
  // Scheduled date is required for preventive maintenance
  if (type === 'preventive') {
    if (!date || date.trim().length === 0) {
      return { isValid: false, error: 'Scheduled date is required for preventive maintenance' };
    }
  }
  
  // If date is provided, validate it's not in the past
  if (date) {
    try {
      const selectedDate = new Date(date);
      
      // Check if date is valid
      if (isNaN(selectedDate.getTime())) {
        return { isValid: false, error: 'Invalid date format' };
      }
      
      // Compare dates only (not time) to avoid timezone issues
      // Set both dates to midnight in local timezone for comparison
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const selected = new Date(selectedDate);
      selected.setHours(0, 0, 0, 0);
      
      if (selected < today) {
        return { isValid: false, error: 'Scheduled date cannot be in the past' };
      }
    } catch (err) {
      return { isValid: false, error: 'Invalid date format' };
    }
  }
  
  return { isValid: true };
}

/**
 * Validate duration hours (for marking as repaired)
 */
export function validateDurationHours(hours: number | string): ValidationResult {
  const num = typeof hours === 'string' ? parseFloat(hours) : hours;
  
  if (isNaN(num)) {
    return { isValid: false, error: 'Duration must be a valid number' };
  }
  
  if (num <= 0) {
    return { isValid: false, error: 'Duration must be greater than 0' };
  }
  
  if (num > 1000) {
    return { isValid: false, error: 'Duration seems too high' };
  }
  
  return { isValid: true };
}

/**
 * Validate entire create request form
 */
export function validateCreateRequestForm(data: {
  subject: string;
  description?: string;
  category?: 'equipment' | 'work_center';
  equipment_id?: string;
  work_center_id?: string;
  type: 'corrective' | 'preventive';
  scheduled_date?: string;
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  
  const subjectResult = validateSubject(data.subject);
  if (!subjectResult.isValid) {
    errors.subject = subjectResult.error!;
  }
  
  if (data.description) {
    const descResult = validateDescription(data.description);
    if (!descResult.isValid) {
      errors.description = descResult.error!;
    }
  }
  
  // Validate based on category
  const category = data.category || 'equipment';
  if (category === 'equipment') {
    if (data.equipment_id) {
      const equipmentResult = validateEquipment(data.equipment_id);
      if (!equipmentResult.isValid) {
        errors.equipment_id = equipmentResult.error!;
      }
    } else {
      errors.equipment_id = 'Please select equipment';
    }
  } else if (category === 'work_center') {
    if (data.work_center_id) {
      const workCenterResult = validateWorkCenter(data.work_center_id);
      if (!workCenterResult.isValid) {
        errors.work_center_id = workCenterResult.error!;
      }
    } else {
      errors.work_center_id = 'Please select work center';
    }
  }
  
  const dateResult = validateScheduledDate(data.scheduled_date || '', data.type);
  if (!dateResult.isValid) {
    errors.scheduled_date = dateResult.error!;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

