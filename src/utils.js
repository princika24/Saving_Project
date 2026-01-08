export function validateGoalName(name) {
  if (!name || name.trim().length === 0) {
    return "Goal name is required";
  }
  if (name.trim().length < 2) {
    return "Goal name must be at least 2 characters";
  }
  return null;
}

export function validateTargetAmount(amount) {
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) {
    return "Target amount is required";
  }
  if (numAmount <= 0) {
    return "Target amount must be greater than 0";
  }
  return null;
}

export function formatCurrency(amount, currency) {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return currency === "INR" ? "₹0" : "$0";
  }
  const formatted = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(amount);
  return currency === "INR" ? `₹${formatted}` : `$${formatted}`;
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function validateContributionAmount(amount) {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(numAmount) || numAmount === "") {
    return "Contribution amount is required";
  }
  if (numAmount <= 0) {
    return "Contribution amount must be greater than 0";
  }
  return null;
}

export function validateDate(date) {
  if (!date || date.trim().length === 0) {
    return "Date is required";
  }
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return "Please enter a valid date";
  }
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  if (dateObj > today) {
    return "Date cannot be in the future";
  }
  return null;
}

export function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
}
