import Callout from "../../components/lab/Callout";
import LabCard from "../../components/lab/LabCard";
import LabLayout from "../../components/lab/LabLayout";
import LabSection from "../../components/lab/LabSection";
import Parent from "./Parent";
import Playground from "./Playground";

function FunctionIdentityLabs() {
  return (
    <LabLayout
      title="Function Identity"
      description="Every function you create has its own identity."
    >
      <LabSection title="Question">
        <Callout title="Observation" variant="warning">
          <p>
            Both functions have the same implementation. Why does JavaScript
            consider them different?
          </p>
        </Callout>
        <Playground />
      </LabSection>

      <LabSection title="Interactive Demo">
        <LabCard title="Render Demo">
          <Parent />
        </LabCard>
      </LabSection>

      <LabSection title="Problem">
        <Callout title="Question" variant="warning">
          <p>
            The child is wrapped in <code>React.memo</code>, but it still
            renders whenever the parent's <code>name</code> changes.
          </p>

          <p>Why?</p>
        </Callout>
      </LabSection>

      <LabSection title="Think Back">
        <Callout title="Hint" variant="info">
          <p>
            Earlier, we learned that creating an object during render produces a
            new object every time the component renders.
          </p>

          <p>Does the same thing happen with functions?</p>
        </Callout>

        <LabCard title="What Happens?">
          <pre>{`
Parent renders

↓

handleIncrement is created

↓

New function identity

↓

React.memo sees changed prop

↓

Child renders
`}</pre>
        </LabCard>

        <Callout title="Does This Look Familiar?" variant="success">
          <p>In the previous lab, a new object caused the child to render.</p>

          <p>In this lab, a new function causes the child to render.</p>

          <p>
            The underlying problem is the same: a new identity is created on
            every render.
          </p>
        </Callout>
      </LabSection>
    </LabLayout>
  );
}

export default FunctionIdentityLabs;
