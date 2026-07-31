import Callout from "../../components/lab/Callout";
import LabCard from "../../components/lab/LabCard";
import LabLayout from "../../components/lab/LabLayout";
import LabSection from "../../components/lab/LabSection";
import Parent from "./Parent";

function UseCallbackLabs() {
  return (
    <LabLayout
      title="useCallback"
      description="useCallback preserves a function's identity between renders when its dependencies haven't changed."
    >
      <LabSection title="Observation">
        <Callout title="What Changed?" variant="success">
          <p>
            The child no longer renders when only the parent's
            <code>name</code> changes.
          </p>

          <p>
            The only change we made was wrapping the function with
            <code>useCallback</code>.
          </p>
        </Callout>
      </LabSection>

      <LabSection title="Interactive Demo">
        <LabCard title="Render Demo">
          <Parent />
        </LabCard>
      </LabSection>

      <LabSection title="Before vs After">
        <LabCard title="Without useCallback">
          <pre>{`
Parent render

↓

new function

↓

Child renders
`}</pre>
        </LabCard>

        <LabCard title="With useCallback">
          <pre>{`
Parent render

↓

same function

↓

Child skipped
`}</pre>
        </LabCard>
        <Callout title="A Familiar Pattern" variant="info">
          <p>
            <code>useMemo</code> preserves the identity of a value.
          </p>

          <p>
            <code>useCallback</code> preserves the identity of a function.
          </p>

          <p>
            Both hooks solve the same underlying problem: preventing unnecessary
            changes in identity between renders.
          </p>
        </Callout>
      </LabSection>

      <LabSection title="Dependency Array">
        <Callout title="Question" variant="warning">
          <p>
            React will reuse the previous function as long as none of the
            dependencies change.
          </p>

          <p>Why is the dependency array empty in this example?</p>
        </Callout>

        <LabCard title="Inspect the Function">
          <pre>{`
handleIncrement

↓

Uses count?

No

↓

Uses name?

No

↓

Uses setCount?

Yes (stable)

↓

Dependencies: []
`}</pre>
        </LabCard>

        <Callout title="Something Changed" variant="warning">
          <p>
            The callback now reads <code>name</code>.
          </p>

          <p>
            Since <code>name</code> can change, it becomes a dependency of the
            callback.
          </p>
        </Callout>

        <Callout title="Think About Dependencies" variant="success">
          <p>Don't start with the dependency array.</p>

          <p>
            Start by reading the callback and identifying the values it depends
            on.
          </p>

          <p>
            The dependency array is simply a reflection of those dependencies.
          </p>
        </Callout>
      </LabSection>
    </LabLayout>
  );
}

export default UseCallbackLabs;
