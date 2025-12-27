/**
 * Test file for state machine validation
 * Run with: node backend/constants/states.test.js
 */

const {
  REQUEST_STATES,
  validateStateTransition,
  getAllowedTransitions,
  isTerminalState,
} = require('./states');

console.log('🧪 Running State Machine Tests...\n');

// Test 1: Valid transitions from NEW
console.log('Test 1: Valid transitions from NEW');
let result = validateStateTransition(REQUEST_STATES.NEW, REQUEST_STATES.IN_PROGRESS);
console.log(`  new → in_progress: ${result.valid ? '✅ PASS' : '❌ FAIL'}`);

result = validateStateTransition(REQUEST_STATES.NEW, REQUEST_STATES.SCRAP);
console.log(`  new → scrap: ${result.valid ? '✅ PASS' : '❌ FAIL'}`);

// Test 2: Invalid transition from NEW
console.log('\nTest 2: Invalid transition from NEW');
result = validateStateTransition(REQUEST_STATES.NEW, REQUEST_STATES.REPAIRED);
console.log(`  new → repaired: ${!result.valid ? '✅ PASS' : '❌ FAIL'}`);
if (!result.valid) {
  console.log(`  Error message: "${result.error}"`);
}

// Test 3: Valid transitions from IN_PROGRESS
console.log('\nTest 3: Valid transitions from IN_PROGRESS');
result = validateStateTransition(REQUEST_STATES.IN_PROGRESS, REQUEST_STATES.REPAIRED);
console.log(`  in_progress → repaired: ${result.valid ? '✅ PASS' : '❌ FAIL'}`);

result = validateStateTransition(REQUEST_STATES.IN_PROGRESS, REQUEST_STATES.SCRAP);
console.log(`  in_progress → scrap: ${result.valid ? '✅ PASS' : '❌ FAIL'}`);

// Test 4: Invalid transitions from IN_PROGRESS
console.log('\nTest 4: Invalid transitions from IN_PROGRESS');
result = validateStateTransition(REQUEST_STATES.IN_PROGRESS, REQUEST_STATES.NEW);
console.log(`  in_progress → new: ${!result.valid ? '✅ PASS' : '❌ FAIL'}`);
if (!result.valid) {
  console.log(`  Error message: "${result.error}"`);
}

// Test 5: Terminal state - REPAIRED
console.log('\nTest 5: Terminal state - REPAIRED');
result = validateStateTransition(REQUEST_STATES.REPAIRED, REQUEST_STATES.NEW);
console.log(`  repaired → new: ${!result.valid ? '✅ PASS' : '❌ FAIL'}`);
if (!result.valid) {
  console.log(`  Error message: "${result.error}"`);
}

result = validateStateTransition(REQUEST_STATES.REPAIRED, REQUEST_STATES.IN_PROGRESS);
console.log(`  repaired → in_progress: ${!result.valid ? '✅ PASS' : '❌ FAIL'}`);

console.log(`  isTerminalState(REPAIRED): ${isTerminalState(REQUEST_STATES.REPAIRED) ? '✅ PASS' : '❌ FAIL'}`);

// Test 6: Terminal state - SCRAP
console.log('\nTest 6: Terminal state - SCRAP');
result = validateStateTransition(REQUEST_STATES.SCRAP, REQUEST_STATES.NEW);
console.log(`  scrap → new: ${!result.valid ? '✅ PASS' : '❌ FAIL'}`);
if (!result.valid) {
  console.log(`  Error message: "${result.error}"`);
}

console.log(`  isTerminalState(SCRAP): ${isTerminalState(REQUEST_STATES.SCRAP) ? '✅ PASS' : '❌ FAIL'}`);

// Test 7: Idempotent transitions (same state) - Non-terminal states
console.log('\nTest 7: Idempotent transitions (same state) - Non-terminal states');
result = validateStateTransition(REQUEST_STATES.NEW, REQUEST_STATES.NEW);
console.log(`  new → new: ${result.valid ? '✅ PASS' : '❌ FAIL'}`);

result = validateStateTransition(REQUEST_STATES.IN_PROGRESS, REQUEST_STATES.IN_PROGRESS);
console.log(`  in_progress → in_progress: ${result.valid ? '✅ PASS' : '❌ FAIL'}`);

// Test 7b: Idempotent transitions on terminal states (should fail)
console.log('\nTest 7b: Idempotent transitions on terminal states (should be rejected)');
result = validateStateTransition(REQUEST_STATES.REPAIRED, REQUEST_STATES.REPAIRED);
console.log(`  repaired → repaired: ${!result.valid ? '✅ PASS' : '❌ FAIL'}`);
if (!result.valid) {
  console.log(`  Error message: "${result.error}"`);
}

result = validateStateTransition(REQUEST_STATES.SCRAP, REQUEST_STATES.SCRAP);
console.log(`  scrap → scrap: ${!result.valid ? '✅ PASS' : '❌ FAIL'}`);
if (!result.valid) {
  console.log(`  Error message: "${result.error}"`);
}

// Test 8: Get allowed transitions
console.log('\nTest 8: Get allowed transitions');
let allowedTransitions = getAllowedTransitions(REQUEST_STATES.NEW);
console.log(`  Allowed from NEW: [${allowedTransitions.join(', ')}]`);
console.log(`  Expected: [in_progress, scrap] - ${JSON.stringify(allowedTransitions) === JSON.stringify(['in_progress', 'scrap']) ? '✅ PASS' : '❌ FAIL'}`);

allowedTransitions = getAllowedTransitions(REQUEST_STATES.IN_PROGRESS);
console.log(`  Allowed from IN_PROGRESS: [${allowedTransitions.join(', ')}]`);
console.log(`  Expected: [repaired, scrap] - ${JSON.stringify(allowedTransitions) === JSON.stringify(['repaired', 'scrap']) ? '✅ PASS' : '❌ FAIL'}`);

allowedTransitions = getAllowedTransitions(REQUEST_STATES.REPAIRED);
console.log(`  Allowed from REPAIRED: [${allowedTransitions.join(', ')}]`);
console.log(`  Expected: [] - ${allowedTransitions.length === 0 ? '✅ PASS' : '❌ FAIL'}`);

// Test 9: Invalid state values in validateStateTransition
console.log('\nTest 9: Invalid state values in validateStateTransition');
result = validateStateTransition('invalid_state', REQUEST_STATES.IN_PROGRESS);
console.log(`  invalid_state → in_progress: ${!result.valid ? '✅ PASS' : '❌ FAIL'}`);
if (!result.valid) {
  console.log(`  Error message: "${result.error}"`);
}

result = validateStateTransition(REQUEST_STATES.NEW, 'invalid_state');
console.log(`  new → invalid_state: ${!result.valid ? '✅ PASS' : '❌ FAIL'}`);
if (!result.valid) {
  console.log(`  Error message: "${result.error}"`);
}

// Test 10: getAllowedTransitions with invalid state
console.log('\nTest 10: getAllowedTransitions with invalid state');
allowedTransitions = getAllowedTransitions('invalid_state');
console.log(`  getAllowedTransitions('invalid_state'): [${allowedTransitions.join(', ')}]`);
console.log(`  Expected: [] - ${allowedTransitions.length === 0 ? '✅ PASS' : '❌ FAIL'}`);

// Test 11: isTerminalState with invalid state
console.log('\nTest 11: isTerminalState with invalid state');
let isTerminal = isTerminalState('invalid_state');
console.log(`  isTerminalState('invalid_state'): ${isTerminal}`);
console.log(`  Expected: false - ${isTerminal === false ? '✅ PASS' : '❌ FAIL'}`);

// Test 12: isTerminalState on non-terminal states
console.log('\nTest 12: isTerminalState on non-terminal states');
isTerminal = isTerminalState(REQUEST_STATES.NEW);
console.log(`  isTerminalState(NEW): ${isTerminal}`);
console.log(`  Expected: false - ${isTerminal === false ? '✅ PASS' : '❌ FAIL'}`);

isTerminal = isTerminalState(REQUEST_STATES.IN_PROGRESS);
console.log(`  isTerminalState(IN_PROGRESS): ${isTerminal}`);
console.log(`  Expected: false - ${isTerminal === false ? '✅ PASS' : '❌ FAIL'}`);

// Re-verify terminal states return true
isTerminal = isTerminalState(REQUEST_STATES.REPAIRED);
console.log(`  isTerminalState(REPAIRED): ${isTerminal}`);
console.log(`  Expected: true - ${isTerminal === true ? '✅ PASS' : '❌ FAIL'}`);

isTerminal = isTerminalState(REQUEST_STATES.SCRAP);
console.log(`  isTerminalState(SCRAP): ${isTerminal}`);
console.log(`  Expected: true - ${isTerminal === true ? '✅ PASS' : '❌ FAIL'}`);

// Test 13: getAllowedTransitions for all states
console.log('\nTest 13: getAllowedTransitions comprehensive check');
allowedTransitions = getAllowedTransitions(REQUEST_STATES.SCRAP);
console.log(`  Allowed from SCRAP: [${allowedTransitions.join(', ')}]`);
console.log(`  Expected: [] - ${allowedTransitions.length === 0 ? '✅ PASS' : '❌ FAIL'}`);

console.log('\n✅ All state machine tests completed!\n');
console.log('State Machine Summary:');
console.log('  Valid workflows:');
console.log('    1. new → in_progress → repaired (normal workflow)');
console.log('    2. new → in_progress → scrap (equipment cannot be repaired)');
console.log('    3. new → scrap (emergency scrap without starting work)');
console.log('  Terminal states: repaired, scrap');

