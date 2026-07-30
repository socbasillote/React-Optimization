import Callout from "../../components/lab/Callout";
import LabCard from "../../components/lab/LabCard";
import LabLayout from "../../components/lab/LabLayout";
import LabSection from "../../components/lab/LabSection";
import Parent from "./parent";

function RenderingFundamentalsLab() {
  return (
    <LabLayout
      title="React Rendering Fundamentals"
      description="Learn when and why React components render."
    >
      <LabSection title="Problem">
        <Callout title="Background">
          <p>
            Try changing both pieces of state. Observe which components render
            and ask yourself why the child renders even though it doesn't use
            either state value.
          </p>
        </Callout>
        <Callout title="Experiment">
          <p>
            The child receives the <code>count</code> prop. Click both buttons
            and observe that the child renders even when only the parent's
            <code>name</code> state changes.
          </p>
        </Callout>
      </LabSection>

      <LabSection title="Interactive Demo">
        <LabCard title="Render Demo">
          <Parent />
        </LabCard>
      </LabSection>

      <LabSection title="How React Thinks">
        <Callout title="Rendering vs DOM Updates" variant="info">
          <p>
            When a parent component renders, React evaluates its children and
            builds a new virtual component tree. It then compares that tree with
            the previous one and updates only the parts of the DOM that actually
            changed.
          </p>

          <p>
            A component rendering does not automatically mean the browser DOM is
            updated.
          </p>
        </Callout>
        <LabCard title="Render Flow">
          <pre>{`
State Update
     │
     ▼
Parent Render
     │
     ▼
Child Render
     │
     ▼
Virtual Tree Comparison
     │
     ▼
DOM Updates (only if needed)
`}</pre>
        </LabCard>
      </LabSection>
    </LabLayout>
  );
}

export default RenderingFundamentalsLab;
