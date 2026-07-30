import Callout from "../../components/lab/Callout";
import LabCard from "../../components/lab/LabCard";
import LabLayout from "../../components/lab/LabLayout";
import LabSection from "../../components/lab/LabSection";
//import PerformanceComparison from "../../components/lab/PerformanceComparison";
import Parent from "./parent";

function UseMemoLabs() {
  return (
    <LabLayout
      title="React Rendering Fundamentals"
      description="Learn when and why React components render."
    >
      <LabSection title="Problem">
        <Callout title="Question" variant="warning">
          <p>
            The child component is wrapped in <code>React.memo</code>, but it
            still renders whenever the parent's <code>name</code> changes.
          </p>

          <p>
            Can we keep the <code>data</code> object the same between renders?
          </p>
        </Callout>
      </LabSection>

      <LabSection title="Interactive Demo">
        <LabCard title="Render Demo">
          <Parent />
        </LabCard>
      </LabSection>

      <LabSection title="What's Happening?">
        <Callout title="Observation" variant="success">
          <p>
            The child no longer renders when only the parent's
            <code>name</code> changes.
          </p>

          <p>What changed?</p>
        </Callout>
      </LabSection>

      <LabSection title="Before vs After">
        <LabCard title="Without useMemo">
          <pre>{`
Parent render

↓

new object

↓

Child renders
`}</pre>
        </LabCard>

        <LabCard title="With useMemo">
          <pre>{`
Parent render

↓

same object

↓

Child skipped
`}</pre>
        </LabCard>
      </LabSection>

      <LabSection title="The Dependency Array">
        <Callout title="The Rule" variant="info">
          <p>
            React compares the values in the dependency array with the previous
            render.
          </p>

          <p>
            If none of them changed, React reuses the previous value instead of
            creating a new one.
          </p>
        </Callout>

        <LabCard title="Our Example">
          <pre>{`const data = useMemo(() => {
  return {
    count,
  };
}, [count]);`}</pre>
        </LabCard>

        <LabCard title="What Happens?">
          <pre>{`
Parent renders

↓

Did count change?

↓

No

↓

Reuse previous object

↓

Child skipped
`}</pre>
        </LabCard>
        <LabCard title="When count Changes">
          <pre>{`
Parent renders

↓

Did count change?

↓

Yes

↓

Create new object

↓

Child renders
`}</pre>
        </LabCard>
        <Callout variant="success" title="Back to the Buttons">
          <p>
            Clicking <strong>Change Name</strong> does not change{" "}
            <code>count</code>, so React reuses the previous <code>data</code>{" "}
            object.
          </p>

          <p>
            Clicking <strong>Increment Count</strong> changes <code>count</code>
            , so React creates a new object.
          </p>
        </Callout>

        <Callout variant="warning" title="Important">
          <p>
            React still renders the parent component. <code>useMemo</code> does
            not prevent renders.
          </p>

          <p>
            It only decides whether to reuse the previous value or create a new
            one.
          </p>
        </Callout>
      </LabSection>

      <LabSection title="When Should You Use useMemo?">
        <Callout title="Ask This First" variant="info">
          <p>
            Before adding <code>useMemo</code>, ask yourself:
          </p>

          <ul>
            <li>Am I trying to preserve object or array identity?</li>
            <li>Am I avoiding unnecessary work?</li>
            <li>Is this value passed to a memoized component?</li>
          </ul>
        </Callout>
        <LabCard title="Good Candidate">
          <pre>{`const data = useMemo(() => ({
  count,
}), [count]);

return <Child data={data} />;`}</pre>

          <p>
            The child is wrapped in <code>React.memo</code>, so preserving the
            object's identity prevents unnecessary renders.
          </p>
        </LabCard>

        <LabCard title="Probably Unnecessary">
          <pre>{`const greeting = useMemo(() => {
  return "Hello";
}, []);`}</pre>

          <p>
            Creating this string is already inexpensive, and preserving its
            identity provides no meaningful benefit.
          </p>
        </LabCard>

        <Callout variant="warning" title="Avoid Premature Optimization">
          <p>
            Don't add <code>useMemo</code> everywhere by default. Use it when
            you've identified a real problem that preserving a value or avoiding
            repeated work will solve.
          </p>
        </Callout>

        <Callout variant="success" title="Why We Used It Here">
          <p>
            In this lab, <code>useMemo</code> wasn't added because creating an
            object was expensive. It was added because we wanted to preserve the
            object's identity so that <code>React.memo</code> could skip an
            unnecessary render.
          </p>
        </Callout>
      </LabSection>
    </LabLayout>
  );
}

export default UseMemoLabs;
