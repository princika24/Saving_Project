import { describe, it, expect } from "vitest";

import {
  validateGoalName,
  validateTargetAmount,
  formatCurrency,
  generateId,
  validateContributionAmount,
  validateDate,
  formatDate,
} from "../utils";

describe("utils.js", () => {
  it("returns error if goal name is empty", () => {
    expect(validateGoalName("")).toBe("Goal name is required");
  });

  it("returns error if goal name is too short", () => {
    expect(validateGoalName("A")).toBe(
      "Goal name must be at least 2 characters"
    );
  });

  it("returns null if goal name is valid", () => {
    expect(validateGoalName("My Goal")).toBe(null);
  });

  it("returns error if target amount is not a number", () => {
    expect(validateTargetAmount("abc")).toBe("Target amount is required");
  });

  it("returns error if target amount is <= 0", () => {
    expect(validateTargetAmount(0)).toBe(
      "Target amount must be greater than 0"
    );
  });

  it("returns null if target amount is valid", () => {
    expect(validateTargetAmount(1000)).toBe(null);
  });

  it("formats INR correctly", () => {
    const result = formatCurrency(1000, "INR");
    expect(result).toContain("₹");
  });

  it("formats USD correctly", () => {
    const result = formatCurrency(100, "USD");
    expect(result).toContain("$");
  });

  it("returns 0 if amount is invalid", () => {
    expect(formatCurrency(null, "INR")).toBe("₹0");
  });

  it("generates a non-empty unique id", () => {
    const id1 = generateId();
    const id2 = generateId();

    expect(id1).not.toBe("");
    expect(id2).not.toBe("");
    expect(id1).not.toBe(id2);
  });

  it("returns error if contribution amount is invalid", () => {
    expect(validateContributionAmount("abc")).toBe(
      "Contribution amount is required"
    );
  });

  it("returns error if contribution amount <= 0", () => {
    expect(validateContributionAmount(0)).toBe(
      "Contribution amount must be greater than 0"
    );
  });

  it("returns null if contribution amount is valid", () => {
    expect(validateContributionAmount(500)).toBe(null);
  });

  it("returns error if date is empty", () => {
    expect(validateDate("")).toBe("Date is required");
  });

  it("returns error if date is invalid", () => {
    expect(validateDate("not-a-date")).toBe("Please enter a valid date");
  });

  it("returns error if date is in the future", () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);

    const iso = futureDate.toISOString().split("T")[0];
    expect(validateDate(iso)).toBe("Date cannot be in the future");
  });

  it("returns null if date is valid", () => {
    const today = new Date().toISOString().split("T")[0];
    expect(validateDate(today)).toBe(null);
  });

  it("formats date correctly", () => {
    const result = formatDate("2026-01-09T10:00:00.000Z");
    expect(result).toBe("2026-01-09");
  });

  it("returns empty string if no date is provided", () => {
    expect(formatDate("")).toBe("");
  });
});
