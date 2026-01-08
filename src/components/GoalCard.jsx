import { formatCurrency } from "../utils";
import useExchangeRate from "../hooks/useExchangeRate";
import "./GoalCard.css";

function GoalCard({ goal, onAddContribution }) {
  const { rate } = useExchangeRate();
  const currentSaved =
    goal.contributions?.reduce((sum, contribution) => {
      return sum + (contribution.amount || 0);
    }, 0) || 0;

  const progressPercentage =
    goal.targetAmount > 0
      ? Math.min((currentSaved / goal.targetAmount) * 100, 100)
      : 0;

  const remaining = Math.max(goal.targetAmount - currentSaved, 0);

  const targetFormatted = formatCurrency(goal.targetAmount, goal.currency);
  const savedFormatted = formatCurrency(currentSaved, goal.currency);
  const remainingFormatted = formatCurrency(remaining, goal.currency);

  let convertedAmount = 0;
  if (rate && rate > 0) {
    if (goal.currency === "INR") {
      convertedAmount = goal.targetAmount / rate;
    } else {
      convertedAmount = goal.targetAmount * rate;
    }
  }

  const convertedFormatted = rate
    ? formatCurrency(convertedAmount, goal.currency === "INR" ? "USD" : "INR")
    : "--";

  const contributionCount = goal.contributions?.length || 0;

  const handleAddContributionClick = () => {
    if (onAddContribution) {
      onAddContribution(goal.id);
    }
  };

  return (
    <div className="goal-card">
      <div className="goal-card-header">
        <h3 className="goal-title">{goal.name}</h3>
        <span className="goal-progress-percent">
          {progressPercentage.toFixed(1)}%
        </span>
      </div>
      <div className="goal-target">
        <div className="goal-target-primary">{targetFormatted}</div>
        <div className="goal-target-secondary">{convertedFormatted}</div>
      </div>
      <div className="goal-progress-bar-container">
        <div className="goal-progress-bar">
          <div
            className="goal-progress-bar-fill"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
      <div className="goal-saved-info">
        <span className="goal-saved">{savedFormatted} saved</span>
        <span className="goal-remaining">{remainingFormatted} remaining</span>
      </div>
      <div className="goal-contributions-count">
        {contributionCount}{" "}
        {contributionCount === 1 ? "contribution" : "contributions"}
      </div>
      <button
        className="add-contribution-btn"
        onClick={handleAddContributionClick}
      >
        + Add Contribution
      </button>
    </div>
  );
}

export default GoalCard;
