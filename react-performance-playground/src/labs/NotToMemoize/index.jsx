import Callout from "../../components/lab/Callout";

import LabLayout from "../../components/lab/LabLayout";
import LabSection from "../../components/lab/LabSection";

function NotToMeMoize() {
  return (
    <LabLayout
      title="When Not to Memoize"
      description="Memoization is a tradeoff, not a default."
    >
      <LabSection title="Question">
        <Callout title="Should We Optimize?" variant="warning">
          <p>
            We can wrap almost any calculation in <code>useMemo</code>.
          </p>

          <p>But should we?</p>
        </Callout>
      </LabSection>
      <LabSection title="Tradeoffs">
        <Callout title="Every Optimization Has a Cost" variant="info">
          <ul>
            <li>React stores the previous value.</li>
            <li>React compares dependencies.</li>
            <li>The code becomes more complex.</li>
            <li>Future readers have more to understand.</li>
          </ul>
        </Callout>
        <Callout title="Optimize Intentionally" variant="success">
          <p>The simplest code is usually the best code.</p>

          <p>
            Add memoization when you've identified a real problem it solves, not
            because it's available.
          </p>
        </Callout>
      </LabSection>
    </LabLayout>
  );
}

export default NotToMeMoize;
