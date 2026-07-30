function MetricCard({ label, value, unit }) {
  return (
    <div className="metric-card">
      <span className="metric-label">{label}</span>

      <strong className="metric-value">
        {value}
        {unit ? ` ${unit}` : ""}
      </strong>
    </div>
  );
}

export default MetricCard;
