import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setDomNodes } from "../../store/performanceSlice";

function DOMMonitor() {
  const dispatch = useDispatch();

  useEffect(() => {
    function updateDOMNodes() {
      const count = document.querySelectorAll("*").length;

      dispatch(setDomNodes(count));
    }

    updateDOMNodes();

    const interval = setInterval(updateDOMNodes, 1000);

    return () => clearInterval(interval);
  }, [dispatch]);

  return null;
}

export default DOMMonitor;
