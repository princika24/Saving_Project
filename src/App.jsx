import { useState } from "react";
import Header from "./components/Header";
import AddGoalModal from "./components/AddGoalModal";
import "./App.css";

function App() {
  const [goals, setGoals] = useState([]);
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);

  const handleOpenAddGoalModal = () => {
    setIsAddGoalModalOpen(true);
  };

  const handleCloseAddGoalModal = () => {
    setIsAddGoalModalOpen(false);
  };

  // Adding new goal to list
  const handleAddGoal = (newGoal) => {
    setGoals((prevGoals) => [...prevGoals, newGoal]);
  };

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <section className="goals-section">
          <div className="goals-section-header">
            <h2 className="goals-section-title">Your Goals</h2>
            <button className="add-goal-btn" onClick={handleOpenAddGoalModal}>
              + Add Goal
            </button>
          </div>
        </section>
      </main>
      <AddGoalModal
        isOpen={isAddGoalModalOpen}
        onClose={handleCloseAddGoalModal}
        onAddGoal={handleAddGoal}
      />
    </div>
  );
}

export default App;
