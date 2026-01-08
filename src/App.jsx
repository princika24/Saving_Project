import { useState, useEffect } from "react";
import Header from "./components/Header";
import AddGoalModal from "./components/AddGoalModal";
import GoalCard from "./components/GoalCard";
import AddContributionModal from "./components/AddContributionModal";
import FinancialOverview from "./components/FinancialOverview";
import useExchangeRate from "./hooks/useExchangeRate";
import "./App.css";

const STORAGE_KEY = "savings_planner_goals";

function App() {
  const [goals, setGoals] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error("Failed to load goals from storage", err);
      return [];
    }
  });

  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [isAddContributionModalOpen, setIsAddContributionModalOpen] =
    useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState(null);

  const {
    rate: exchangeRate,
    isLoading: isRateLoading,
    error: rateError,
    refreshRate,
    formatLastUpdated,
  } = useExchangeRate();

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
    } catch (err) {
      console.error("Failed to save goals to storage", err);
    }
  }, [goals]);

  const handleOpenAddGoalModal = () => {
    setIsAddGoalModalOpen(true);
  };

  const handleCloseAddGoalModal = () => {
    setIsAddGoalModalOpen(false);
  };

  const handleOpenAddContribution = (goalId) => {
    setSelectedGoalId(goalId);
    setIsAddContributionModalOpen(true);
  };

  const handleCloseAddContributionModal = () => {
    setIsAddContributionModalOpen(false);
    setSelectedGoalId(null);
  };

  const handleAddGoal = (newGoal) => {
    setGoals((prevGoals) => [...prevGoals, newGoal]);
  };

  const handleAddContribution = (goalId, newContribution) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) => {
        if (goal.id === goalId) {
          return {
            ...goal,
            contributions: [...(goal.contributions || []), newContribution],
          };
        }
        return goal;
      })
    );
  };

  const selectedGoal = goals.find((goal) => goal.id === selectedGoalId);

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <FinancialOverview
          goals={goals}
          exchangeRate={exchangeRate}
          isRateLoading={isRateLoading}
          rateError={rateError}
          refreshRate={refreshRate}
          formatLastUpdated={formatLastUpdated}
        />
        <section className="goals-section">
          <div className="goals-section-header">
            <h2 className="goals-section-title">Your Goals</h2>
            <button className="add-goal-btn" onClick={handleOpenAddGoalModal}>
              + Add Goal
            </button>
          </div>
          <div className="goals-grid">
            {goals.length === 0 ? (
              <p>No goals yet. Add your first goal.</p>
            ) : (
              goals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onAddContribution={handleOpenAddContribution}
                />
              ))
            )}
          </div>
        </section>
      </main>

      <AddGoalModal
        isOpen={isAddGoalModalOpen}
        onClose={handleCloseAddGoalModal}
        onAddGoal={handleAddGoal}
      />

      <AddContributionModal
        isOpen={isAddContributionModalOpen}
        onClose={handleCloseAddContributionModal}
        onAddContribution={handleAddContribution}
        goal={selectedGoal}
      />
    </div>
  );
}

export default App;
