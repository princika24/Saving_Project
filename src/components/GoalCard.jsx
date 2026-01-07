import "./GoalCard.css";

function GoalCard({ goal }) {
  return (
    <div className="goal-card">
      <h3 className="goal-title">{goal.name}</h3>

      <div className="goal-info">
        <span className="goal-amount">
          Target: {goal.currency === "INR" ? "₹" : "$"}
          {goal.targetAmount}
        </span>
      </div>
    </div>
  );
}

export default GoalCard;
