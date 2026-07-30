import Callout from "../../components/lab/Callout";
import LabCard from "../../components/lab/LabCard";
import LabLayout from "../../components/lab/LabLayout";
import LabSection from "../../components/lab/LabSection";
import PerformanceComparison from "../../components/lab/PerformanceComparison";
import Parent from "./parent";

function RenderingFundamentalsLabMemo() {
  return (
    <LabLayout
      title="React Rendering Fundamentals"
      description="Learn when and why React components render."
    >
      <LabSection title="Problem">
        <Callout title="Question">
          <p>
            The child only uses the <code>count</code> prop. Should it render
            again when only the parent's <code>name</code> state changes?
          </p>
        </Callout>
        <Callout title="Experiment">
          <p>
            The child is still wrapped in <code>React.memo</code>, yet it
            renders when only the parent's <code>name</code> changes.
          </p>
          <p>Why?</p>
        </Callout>
      </LabSection>

      <LabSection title="Interactive Demo">
        <LabCard title="Render Demo">
          <Parent />
        </LabCard>
      </LabSection>

      <LabSection title="What's Happening?">
        <Callout title="Observation" variant="info">
          <p>
            Although <code>data.count</code> still has the same value, the{" "}
            <code>data</code> object itself is recreated every time the parent
            component renders.
          </p>
        </Callout>
        <LabCard title="Every Render">
          <pre>{`const data = {
  count,
};`}</pre>
        </LabCard>

        <LabCard title="Think About It">
          <p>Every time the parent function executes, this line runs again.</p>

          <p>That means a brand new object is created on every render.</p>
        </LabCard>

        <Callout variant="success" title="Mental Model">
          <p>
            React doesn't remember that this object was created on a previous
            render. It only sees the object that exists during the current
            render.
          </p>
        </Callout>
      </LabSection>

      <LabSection title="Referential Equality">
        <Callout title="Definition" variant="info">
          <p>
            Primitive values (numbers, strings, booleans) are compared by their
            value. Objects and arrays are compared by their identity
            (reference).
          </p>

          <p>
            Two different objects with the same contents are still considered
            different.
          </p>
        </Callout>

        <LabCard title="Primitive Values">
          <pre>{`1 === 1 // true

"React" === "React" // true`}</pre>
        </LabCard>

        <LabCard title="Objects">
          <pre>{`{ count: 1 } === { count: 1 } // false`}</pre>
        </LabCard>

        <Callout title="Back to Our Demo" variant="success">
          <p>
            Every time the parent renders, it creates a new <code>data</code>{" "}
            object. Although the contents are the same, it is a different
            object, so <code>React.memo</code> treats the prop as changed and
            renders the child again.
          </p>
        </Callout>

        <PerformanceComparison
          before={{
            fps: "--",
            memory: "--",
            domNodes: "--",
          }}
          after={{
            fps: "--",
            memory: "--",
            domNodes: "--",
          }}
        />
      </LabSection>
    </LabLayout>
  );
}

export default RenderingFundamentalsLabMemo;
