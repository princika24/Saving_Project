// Shows a combined financial summary across all goals
import useExchangeRate from "../hooks/useExchangeRate";
import { formatCurrency } from "../utils";

function FinancialOverview({ goals = [] }) {
  const { rate, isLoading, error, refreshRate, formatLastUpdated } =
    useExchangeRate();

  const calculateTotals = () => {
    let totalTargetINR = 0;
    let totalTargetUSD = 0;
    let totalSavedINR = 0;
    let totalSavedUSD = 0;
    let totalProgress = 0;
    let goalsWithProgress = 0;

    goals.forEach((goal) => {
      const saved =
        goal.contributions?.reduce((sum, contribution) => {
          return sum + (contribution.amount || 0);
        }, 0) || 0;

      if (goal.currency === "INR") {
        totalTargetINR += goal.targetAmount;
        totalSavedINR += saved;
      } else {
        totalTargetUSD += goal.targetAmount;
        totalSavedUSD += saved;
      }

      if (goal.targetAmount > 0) {
        const goalProgress = Math.min((saved / goal.targetAmount) * 100, 100);
        totalProgress += goalProgress;
        goalsWithProgress++;
      }
    });

    const averageProgress =
      goalsWithProgress > 0 ? totalProgress / goalsWithProgress : 0;

    return {
      totalTargetINR,
      totalTargetUSD,
      totalSavedINR,
      totalSavedUSD,
      averageProgress,
    };
  };

  const totals = calculateTotals();
  const convertUSDToINR = (usdAmount) => {
    if (!rate || rate <= 0) return 0;
    return usdAmount * rate;
  };
  const convertINRToUSD = (inrAmount) => {
    if (!rate || rate <= 0) return 0;
    return inrAmount / rate;
  };

  const totalTargetINR =
    totals.totalTargetINR + convertUSDToINR(totals.totalTargetUSD);
  const totalTargetUSD =
    totals.totalTargetUSD + convertINRToUSD(totals.totalTargetINR);
  const totalSavedINR =
    totals.totalSavedINR + convertUSDToINR(totals.totalSavedUSD);
  const totalSavedUSD =
    totals.totalSavedUSD + convertINRToUSD(totals.totalSavedINR);

  const handleRefresh = () => {
    refreshRate();
  };

  const formatExchangeRate = () => {
    if (isLoading) {
      return "Loading...";
    }
    if (error && !rate) {
      return "Error loading rate";
    }
    if (!rate || rate <= 0) {
      return "Rate unavailable";
    }
    return `1 USD = ₹${rate.toFixed(2)}`;
  };

  return (
    <section className="financial-overview">
      <div className="financial-overview-header">
        <h2 className="financial-overview-title">
          <span className="icon">📊</span>
          Financial Overview
        </h2>
        <button
          className={`refresh-rates-btn ${isLoading ? "loading" : ""}`}
          onClick={handleRefresh}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Refresh Rates"}
        </button>
      </div>
      {error && !rate && <div className="exchange-rate-error">⚠️ {error}</div>}
      {error && rate && <div className="exchange-rate-warning">ℹ️ {error}</div>}

      <div className="metrics-container">
        <div className="metric-card">
          <div className="metric-label">Total Targets</div>
          <div className="metric-value-primary">
            {formatCurrency(totalTargetINR, "INR")}
          </div>
          <div className="metric-value-secondary">
            {formatCurrency(totalTargetUSD, "USD")}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Total Saved</div>
          <div className="metric-value-primary">
            {formatCurrency(totalSavedINR, "INR")}
          </div>
          <div className="metric-value-secondary">
            {formatCurrency(totalSavedUSD, "USD")}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Overall Progress</div>
          <div className="metric-value-primary">
            {totals.averageProgress.toFixed(1)}%
          </div>
          <div className="metric-value-secondary">Total goals completion</div>
        </div>
      </div>

      <div className="financial-overview-footer">
        <div className="exchange-rate-display">
          Exchange Rate: {formatExchangeRate()}
        </div>
        <div className="last-updated">Last updated: {formatLastUpdated()}</div>
      </div>
    </section>
  );
}

export default FinancialOverview;
