export function validateGoalName(name) {
  if (!name || name.trim().length === 0) {
    return 'Goal name is required';
  }
  if (name.trim().length < 2) {
    return 'Goal name must be at least 2 characters';
  }
  return null;
}

export function validateTargetAmount(amount) {
  const numAmount = parseFloat(amount);

  if (isNaN(numAmount)) {
    return 'Target amount is required';
  }

  if (numAmount <= 0) {
    return 'Target amount must be greater than 0';
  }

  return null;
}
