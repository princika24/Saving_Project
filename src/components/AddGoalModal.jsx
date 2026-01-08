import { useState } from "react";
import { validateGoalName, validateTargetAmount } from "../utils";
import "./AddGoalModal.css";

function AddGoalModal({ isOpen, onClose, onAddGoal }) {
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currency, setCurrency] = useState("INR");

  const [errors, setErrors] = useState({
    name: null,
    targetAmount: null,
  });

  if (!isOpen) {
    return null;
  }

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    if (errors.name) {
      setErrors({ ...errors, name: null });
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setTargetAmount(value);
    if (errors.targetAmount) {
      setErrors({ ...errors, targetAmount: null });
    }
  };

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  const validateForm = () => {
    const nameError = validateGoalName(name);
    const amountError = validateTargetAmount(targetAmount);
    setErrors({
      name: nameError,
      targetAmount: amountError,
    });
    return !nameError && !amountError;
  };

  const resetForm = () => {
    setName("");
    setTargetAmount("");
    setCurrency("INR");
    setErrors({ name: null, targetAmount: null });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const newGoal = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      name: name.trim(),
      targetAmount: parseFloat(targetAmount),
      currency: currency,
      contributions: [],
      createdAt: new Date().toISOString(),
    };

    onAddGoal(newGoal);
    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Goal</h2>
          <button className="modal-close-btn" onClick={handleClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="goal-form">
          <div className="form-group">
            <label htmlFor="goal-name" className="form-label">
              Goal Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="goal-name"
              className={`form-input ${errors.name ? "form-input-error" : ""}`}
              value={name}
              onChange={handleNameChange}
              placeholder="e.g., Emergency Fund, Trip"
              maxLength={100}
            />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="target-amount" className="form-label">
              Target Amount <span className="required">*</span>
            </label>
            <input
              type="number"
              id="target-amount"
              className={`form-input ${
                errors.targetAmount ? "form-input-error" : ""
              }`}
              value={targetAmount}
              onChange={handleAmountChange}
              placeholder="Enter target amount"
              min="0"
              step="1"
            />
            {errors.targetAmount && (
              <div className="form-error">{errors.targetAmount}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="currency" className="form-label">
              Currency <span className="required">*</span>
            </label>
            <select
              id="currency"
              className="form-select"
              value={currency}
              onChange={handleCurrencyChange}
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Add Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddGoalModal;
