import Callout from "../../components/lab/Callout";
import LabCard from "../../components/lab/LabCard";

import LabLayout from "../../components/lab/LabLayout";
import LabSection from "../../components/lab/LabSection";

import Parent from "./Parent";

function Normalization() {
  return (
    <LabLayout
      title="Normalization"
      description="Nested and duplicated state becomes difficult to update and keep consistent."
    >
      <LabSection title="Problem">
        <Callout title="Duplicated Data" variant="warning">
          <p>The same author exists in multiple places.</p>

          <p>Updating one copy doesn't update the others.</p>
        </Callout>

        <Callout title="Does This Feel Familiar?" variant="info">
          <p>Earlier we learned not to duplicate state.</p>

          <p>
            Here we're duplicating data instead of derived values, but the
            underlying problem is the same: multiple sources of truth.
          </p>
        </Callout>
      </LabSection>

      <LabSection title="Interactive Demo">
        <LabCard title="Render Demo">
          <Parent />
        </LabCard>
      </LabSection>

      <LabSection title="Observation">
        <Callout title="What Changed?" variant="warning">
          <p>The posts no longer contain the full author object.</p>

          <p>
            They only store an <code>authorId</code>.
          </p>

          <p>Why might that be useful?</p>
        </Callout>

        <Callout title="Normalized State" variant="success">
          <p>Each entity is stored once.</p>

          <p>
            Relationships are represented using IDs instead of nested objects.
          </p>
        </Callout>

        <Callout title="A Familiar Principle" variant="info">
          <p>Earlier we removed duplicate derived state.</p>

          <p>Now we've removed duplicate entity data.</p>

          <p>
            In both cases, the goal is the same: maintain a single source of
            truth.
          </p>
        </Callout>
      </LabSection>

      <LabSection title="Problem">
        <Callout title="Repeated Lookup" variant="warning">
          <p>Every component is responsible for finding the author.</p>

          <p>What happens if this lookup logic changes?</p>
        </Callout>
      </LabSection>

      <LabSection title="Searching an Array">
        <LabCard title="How find() Works">
          <pre>{`
Author 1

↓

Author 2

↓

Author 3

↓

Author 4 ✓
`}</pre>
        </LabCard>

        <Callout title="Observation" variant="warning">
          <p>
            Why does finding the last author take longer than finding the first?
          </p>
        </Callout>

        <Callout title="Time Complexity" variant="info">
          <p>
            Searching an array with <code>find()</code> requires checking items
            one by one.
          </p>

          <p>
            Looking up a value by key in an object is effectively constant time
            for typical JavaScript object access.
          </p>
        </Callout>

        <Callout title="Two Structures, One Goal" variant="success">
          <p>
            The <code>ids</code> array stores the order of entities.
          </p>

          <p>
            The <code>entities</code> object stores the entities themselves.
          </p>

          <p>
            Together they provide efficient rendering and efficient lookups.
          </p>
        </Callout>
      </LabSection>
    </LabLayout>
  );
}

export default Normalization;
