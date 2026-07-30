import { useSelector } from "react-redux";

function PerformanceOverlay() {
  const { fps, memory, domNodes } = useSelector((state) => state.performance);

  return (
    <footer className="performance-overlay">
      <span>FPS: {fps}</span>

      <span>Memory: {memory !== "--" ? `${memory} MB` : "--"}</span>

      <span>DOM Nodes: {domNodes}</span>
    </footer>
  );
}

export default PerformanceOverlay;
