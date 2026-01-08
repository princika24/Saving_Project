import { useState, useEffect } from "react";
import { validateContributionAmount, validateDate } from "../utils";
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
      date,
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
              step="0.01"
            />
            {errors.amount && <div className="form-error">{errors.amount}</div>}
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
