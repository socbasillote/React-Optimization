import Callout from "../../components/lab/Callout";
import LabCard from "../../components/lab/LabCard";

import LabLayout from "../../components/lab/LabLayout";
import LabSection from "../../components/lab/LabSection";

import Parent from "./Parent";

function SelectorLabs() {
  return (
    <>
      <LabLayout
        title="Selectors"
        description="A selector is a function that derives data from state."
      >
        <LabSection title="Problem">
          <Callout title="Repeated Logic" variant="warning">
            <p>
              Both components calculate the cart total in exactly the same way.
            </p>

            <p>What happens if the calculation changes?</p>
          </Callout>
        </LabSection>

        <LabSection title="Interactive Demo">
          <LabCard title="Render Demo">
            <Parent />
          </LabCard>
        </LabSection>

        <LabSection title="Question">
          <Callout title="What Changed?" variant="info">
            <p>We didn't make the calculation faster.</p>

            <p>So why is this better?</p>
          </Callout>

          <Callout title="One Place" variant="success">
            <ul>
              <li>One implementation.</li>
              <li>Reusable across components.</li>
              <li>Easier to test.</li>
              <li>Easier to maintain.</li>
            </ul>
          </Callout>

          <Callout title="Selector" variant="info">
            <p>
              A selector is simply a function that reads state and returns
              derived data.
            </p>
          </Callout>
        </LabSection>
      </LabLayout>

      <LabLayout
        title="Memoized Selectors"
        description="A selector can remember its previous result and reuse it when the input hasn't changed."
      >
        <LabSection title="Problem">
          <Callout title="Repeated Work" variant="warning">
            <p>
              If this selector performs expensive work and is called repeatedly
              with the same input, we're repeating the same computation.
            </p>
          </Callout>

          <Callout title="Does This Feel Familiar?" variant="success">
            <p>
              <code>useMemo</code> remembers a value inside a component.
            </p>

            <p>A memoized selector remembers a value outside the component.</p>

            <p>The idea is exactly the same.</p>
          </Callout>
          <Callout title="Think in Inputs" variant="success">
            <p>A selector should describe the data it depends on.</p>

            <p>
              If those inputs haven't changed, the previous result can be
              reused.
            </p>
          </Callout>
        </LabSection>
      </LabLayout>
    </>
  );
}

export default SelectorLabs;
