import FPSMonitor from "./FPSMonitor";
import MemoryMonitor from "./MemoryMonitor";
import DOMMonitor from "./DOMMonitor";

function PerformanceMonitor() {
  return (
    <>
      <FPSMonitor />
      <MemoryMonitor />
      <DOMMonitor />
    </>
  );
}

export default PerformanceMonitor;
