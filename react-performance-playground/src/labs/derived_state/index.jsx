import Callout from "../../components/lab/Callout";
import LabCard from "../../components/lab/LabCard";

import LabLayout from "../../components/lab/LabLayout";
import LabSection from "../../components/lab/LabSection";
import Cart from "./CArt";

function DeriveState() {
  return (
    <LabLayout
      title="Derived State"
      description="Don't store data that can be calculated from existing state."
    >
      <LabSection title="Problem">
        <Callout title="Two Sources of Truth" variant="warning">
          <p>
            The cart already contains everything needed to calculate the total.
          </p>

          <p>Why are we storing the total separately?</p>
        </Callout>
      </LabSection>

      <LabSection title="Interactive Demo">
        <LabCard title="Render Demo">
          <Cart />
        </LabCard>
      </LabSection>

      <LabSection title="Derived State">
        <Callout title="One Source of Truth" variant="success">
          <p>The cart is the source of truth.</p>

          <p>
            The total is derived from the cart whenever the component renders.
          </p>
        </Callout>

        <Callout title="Avoid Duplicate State" variant="info">
          <p>
            If a value can be calculated from existing state, prefer deriving it
            instead of storing it separately.
          </p>
        </Callout>
      </LabSection>

      <LabSection title="Question">
        <Callout title="Think Before Running" variant="warning">
          <p>Toggling the theme doesn't change the cart.</p>

          <p>Will React calculate the total again?</p>
        </Callout>

        <Callout title="Observation" variant="warning">
          <p>
            React recalculated the total even though the cart never changed.
          </p>

          <p>Why?</p>
        </Callout>

        <Callout title="React Is Doing Its Job" variant="info">
          <p>React doesn't know that calculating the total is expensive.</p>

          <p>It simply executes the component again whenever state changes.</p>
        </Callout>
      </LabSection>

      <LabSection title="Observation">
        <Callout title="What Changed?" variant="success">
          <p>Changing the theme still causes the component to render.</p>

          <p>
            But React reuses the previous total because the
            <code>cart</code> hasn't changed.
          </p>
        </Callout>
      </LabSection>

      <LabSection title="Two Uses of useMemo">
        <LabCard title="Identity">
          <pre>{`
const data = useMemo(
  () => ({ count }),
  [count]
);
`}</pre>

          <p>
            Preserve an object's identity so memoized children can skip
            rerendering.
          </p>
        </LabCard>

        <LabCard title="Computation">
          <pre>{`
const total = useMemo(
  () => calculateTotal(cart),
  [cart]
);
`}</pre>

          <p>Reuse the previous calculation when its inputs haven't changed.</p>
        </LabCard>

        <Callout title="One Hook, One Behavior" variant="info">
          <p>
            <code>useMemo</code> always does the same thing:
          </p>

          <p>
            It reuses a previously computed value when its dependencies haven't
            changed.
          </p>

          <p>
            Sometimes that value is an object. Sometimes it's an expensive
            calculation.
          </p>
        </Callout>
      </LabSection>
    </LabLayout>
  );
}

export default DeriveState;
