import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setFPS } from "../../store/performanceSlice";

function FPSMonitor() {
  const dispatch = useDispatch();

  useEffect(() => {
    let frameCount = 0;
    let animationId;
    let lastTime = performance.now();

    function measure(currentTime) {
      frameCount++;

      if (currentTime - lastTime >= 1000) {
        dispatch(setFPS(frameCount));

        frameCount = 0;
        lastTime = currentTime;
      }

      animationId = requestAnimationFrame(measure);
    }

    animationId = requestAnimationFrame(measure);

    return () => cancelAnimationFrame(animationId);
  }, [dispatch]);

  return null;
}

export default FPSMonitor;
