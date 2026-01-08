import { useState, useEffect } from "react";
import {
  validateContributionAmount,
  validateDate,
  formatCurrency,
} from "../utils";
import "./AddContributionModal.css";

function AddContributionModal({ isOpen, onClose, onAddContribution, goal }) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const [errors, setErrors] = useState({
    amount: null,
    date: null,
  });

  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split("T")[0];
      setDate(today);
      setAmount("");
      setErrors({ amount: null, date: null });
    }
  }, [isOpen]);

  if (!isOpen || !goal) {
    return null;
  }

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    if (errors.amount) {
      setErrors({ ...errors, amount: null });
    }
  };

  const handleDateChange = (e) => {
    const value = e.target.value;
    setDate(value);
    if (errors.date) {
      setErrors({ ...errors, date: null });
    }
  };

  const validateForm = () => {
    const amountError = validateContributionAmount(amount);
    const dateError = validateDate(date);

    setErrors({
      amount: amountError,
      date: dateError,
    });

    return !amountError && !dateError;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const newContribution = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      amount: parseFloat(amount),
      date: date,
      createdAt: new Date().toISOString(),
    };

    onAddContribution(goal.id, newContribution);

    setAmount("");
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
    setErrors({ amount: null, date: null });
    onClose();
  };

  const handleClose = () => {
    setAmount("");
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
    setErrors({ amount: null, date: null });
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const currentSaved =
    goal.contributions?.reduce((sum, contribution) => {
      return sum + (contribution.amount || 0);
    }, 0) || 0;

  const newTotal = currentSaved + (parseFloat(amount) || 0);
  const willExceedTarget = newTotal > goal.targetAmount;

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add Contribution</h2>
          <button className="modal-close-btn" onClick={handleClose}>
            ×
          </button>
        </div>

        <div className="contribution-goal-info">
          <p className="contribution-goal-name">Goal: {goal.name}</p>
          <p className="contribution-goal-target">
            Target: {formatCurrency(goal.targetAmount, goal.currency)}
          </p>
          <p className="contribution-goal-saved">
            Currently saved: {formatCurrency(currentSaved, goal.currency)}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="contribution-form">
          <div className="form-group">
            <label htmlFor="contribution-amount" className="form-label">
              Contribution Amount <span className="required">*</span>
            </label>
            <input
              type="number"
              id="contribution-amount"
              className={`form-input ${
                errors.amount ? "form-input-error" : ""
              }`}
              value={amount}
              onChange={handleAmountChange}
              placeholder="Enter amount"
              min="0"
              step="1"
            />
            {errors.amount && <div className="form-error">{errors.amount}</div>}
            {willExceedTarget && amount && !errors.amount && (
              <div className="form-warning">
                This will exceed the target by{" "}
                {formatCurrency(newTotal - goal.targetAmount, goal.currency)}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="contribution-date" className="form-label">
              Date <span className="required">*</span>
            </label>
            <input
              type="date"
              id="contribution-date"
              className={`form-input ${errors.date ? "form-input-error" : ""}`}
              value={date}
              onChange={handleDateChange}
              max={new Date().toISOString().split("T")[0]}
            />
            {errors.date && <div className="form-error">{errors.date}</div>}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Add Contribution
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddContributionModal;
