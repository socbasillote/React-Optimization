import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setMemory } from "../../store/performanceSlice";

function MemoryMonitor() {
  const dispatch = useDispatch();

  useEffect(() => {
    function updateMemory() {
      if (!performance.memory) {
        dispatch(setMemory("--"));
        return;
      }

      const useHeap = performance.memory.usedJSHeapSize / 1024 / 1024;

      dispatch(setMemory(useHeap.toFixed(2)));
    }

    updateMemory();

    const interval = setInterval(updateMemory, 1000);

    return () => clearInterval(interval);
  }, [dispatch]);

  return null;
}

export default MemoryMonitor;
