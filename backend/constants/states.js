/**
 * State Machine Constants for Maintenance Requests
 * Defines valid states and allowed transitions
 */

/**
 * Valid maintenance request states
 */
const REQUEST_STATES = {
  NEW: 'new',
  IN_PROGRESS: 'in_progress',
  REPAIRED: 'repaired',
  SCRAP: 'scrap',
};

/**
 * State transition rules
 * Each state maps to an array of states it can transition to
 * 
 * Valid transition flows:
 * - new → in_progress → repaired (normal workflow)
 * - new → in_progress → scrap (equipment cannot be repaired)
 * - new → scrap (emergency scrap without starting work)
 * 
 * Invalid transitions:
 * - Cannot go directly from 'new' to 'repaired' (must go through 'in_progress')
 * - Cannot transition back to 'new' from any other state
 * - Cannot transition from 'repaired' or 'scrap' (terminal states)
 */
const ALLOWED_STATE_TRANSITIONS = {
  [REQUEST_STATES.NEW]: [
    REQUEST_STATES.IN_PROGRESS,
    REQUEST_STATES.SCRAP, // Emergency scrap
  ],
  [REQUEST_STATES.IN_PROGRESS]: [
    REQUEST_STATES.REPAIRED,
    REQUEST_STATES.SCRAP,
  ],
  [REQUEST_STATES.REPAIRED]: [], // Terminal state - no transitions to other states allowed
  [REQUEST_STATES.SCRAP]: [], // Terminal state - no transitions to other states allowed
};

/**
 * Human-readable state names for error messages
 */
const STATE_DISPLAY_NAMES = {
  [REQUEST_STATES.NEW]: 'New',
  [REQUEST_STATES.IN_PROGRESS]: 'In Progress',
  [REQUEST_STATES.REPAIRED]: 'Repaired',
  [REQUEST_STATES.SCRAP]: 'Scrap',
};

/**
 * Validate if a state transition is allowed
 * @param {string} currentState - Current state
 * @param {string} newState - Desired new state
 * @returns {object} - { valid: boolean, error?: string }
 */
const validateStateTransition = (currentState, newState) => {
  // Validate current state exists
  if (!ALLOWED_STATE_TRANSITIONS.hasOwnProperty(currentState)) {
    return {
      valid: false,
      error: `Invalid current state: ${currentState}`,
    };
  }

  // Validate new state exists
  if (!Object.values(REQUEST_STATES).includes(newState)) {
    return {
      valid: false,
      error: `Invalid target state: ${newState}`,
    };
  }

  // If state is not changing, allow it for non-terminal states (idempotent operation)
  // Terminal states should not allow any transitions, including to themselves
  if (currentState === newState) {
    if (isTerminalState(currentState)) {
      const currentDisplayName = STATE_DISPLAY_NAMES[currentState] || currentState;
      return {
        valid: false,
        error: `Cannot change state from '${currentDisplayName}'. This is a terminal state.`,
      };
    }
    return { valid: true };
  }

  // Check if transition is allowed
  const allowedTransitions = ALLOWED_STATE_TRANSITIONS[currentState];
  if (!allowedTransitions.includes(newState)) {
    const currentDisplayName = STATE_DISPLAY_NAMES[currentState] || currentState;
    const newDisplayName = STATE_DISPLAY_NAMES[newState] || newState;
    
    // Provide helpful error messages based on the attempted transition
    if (currentState === REQUEST_STATES.NEW && newState === REQUEST_STATES.REPAIRED) {
      return {
        valid: false,
        error: `Cannot transition from '${currentDisplayName}' to '${newDisplayName}'. Work must be started first (transition to 'In Progress').`,
      };
    }
    
    if (currentState === REQUEST_STATES.REPAIRED || currentState === REQUEST_STATES.SCRAP) {
      return {
        valid: false,
        error: `Cannot change state from '${currentDisplayName}'. This is a terminal state.`,
      };
    }

    return {
      valid: false,
      error: `Invalid state transition from '${currentDisplayName}' to '${newDisplayName}'. Allowed transitions: ${allowedTransitions.map(s => STATE_DISPLAY_NAMES[s]).join(', ') || 'none'}.`,
    };
  }

  return { valid: true };
};

/**
 * Get allowed transitions for a given state
 * @param {string} currentState - Current state
 * @returns {string[]} - Array of allowed next states (empty array for invalid/terminal states)
 */
const getAllowedTransitions = (currentState) => {
  // Validate that the state exists
  if (!ALLOWED_STATE_TRANSITIONS.hasOwnProperty(currentState)) {
    return [];
  }
  return ALLOWED_STATE_TRANSITIONS[currentState];
};

/**
 * Check if a state is terminal (no further transitions to other states allowed)
 * @param {string} state - State to check
 * @returns {boolean} - True if terminal state, false for invalid or non-terminal states
 */
const isTerminalState = (state) => {
  // Validate that the state exists
  if (!ALLOWED_STATE_TRANSITIONS.hasOwnProperty(state)) {
    return false;
  }
  return ALLOWED_STATE_TRANSITIONS[state].length === 0;
};

module.exports = {
  REQUEST_STATES,
  ALLOWED_STATE_TRANSITIONS,
  STATE_DISPLAY_NAMES,
  validateStateTransition,
  getAllowedTransitions,
  isTerminalState,
};

