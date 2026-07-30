import Callout from "../../components/lab/Callout";
import LabCard from "../../components/lab/LabCard";
import LabLayout from "../../components/lab/LabLayout";
import LabSection from "../../components/lab/LabSection";

import PerformanceComparison from "../../components/lab/PerformanceComparison";

export default function LabsPage() {
  return (
    <LabLayout
      title="Optimization Labs"
      description="Interactive expirements for learing react performance."
    >
      <LabSection title="Problem">
        <p>Each lab will begin by explaining the performance issue.</p>
      </LabSection>

      <LabSection title="Naive Solution">
        <p>The unoptimized implementation will appear here.</p>
      </LabSection>

      <LabSection title="Optimized Solution">
        <p>The improved implementation will appear here.</p>
      </LabSection>

      <LabSection title="Performance Comparison">
        <PerformanceComparison
          before={{
            fps: 42,
            memory: 38.7,
            domNodes: 10024,
          }}
          after={{
            fps: 60,
            memory: 16.2,
            domNodes: 42,
          }}
        />
      </LabSection>

      <LabSection title="Key Takeaways">
        <Callout variant="info" title="Why this matters">
          <p>
            Every optimization should be validated with measurable improvements,
            not assumptions.
          </p>
        </Callout>
      </LabSection>

      <LabSection title="Naive Solution">
        <LabCard title="Example">
          <p>The unoptimized implementation will be displayed here.</p>
        </LabCard>
      </LabSection>
    </LabLayout>
  );
}
