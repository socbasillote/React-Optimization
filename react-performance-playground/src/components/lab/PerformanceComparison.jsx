import MetricCard from "./MetricCard";

function PerformanceComparison({ before = {}, after = {} }) {
  return (
    <div className="performance-comparison">
      <div className="comparison-column">
        <h3>Naive</h3>

        <MetricCard label="FPS" value={before.fps ?? "--"} />

        <MetricCard
          label="Memory"
          value={before.memory ?? "--"}
          unit={before.memory ? "MB" : ""}
        />

        <MetricCard label="DOM Nodes" value={before.domNodes ?? "--"} />
      </div>

      <div className="comparison-column">
        <h3>Optimized</h3>

        <MetricCard label="FPS" value={after.fps ?? "--"} />

        <MetricCard
          label="Memory"
          value={after.memory ?? "--"}
          unit={after.memory ? "MB" : ""}
        />

        <MetricCard label="DOM Nodes" value={after.domNodes ?? "--"} />
      </div>
    </div>
  );
}

export default PerformanceComparison;
