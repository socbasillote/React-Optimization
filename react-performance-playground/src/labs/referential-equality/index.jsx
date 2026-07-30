import Callout from "../../components/lab/Callout";
import LabCard from "../../components/lab/LabCard";
import LabLayout from "../../components/lab/LabLayout";
import LabSection from "../../components/lab/LabSection";

import Playground from "./Playground";

function RenderingFundamentalsLabReferential() {
  return (
    <LabLayout
      title="Referential Equality"
      description="Understand how JavaScript compares values."
    >
      <LabSection title="Interactive Playground">
        <LabCard title="Comparison">
          <Playground />
        </LabCard>
        <Callout variant="warning" title="Question">
          <p>
            Both objects contain the same value. Why does JavaScript say they
            are different?
          </p>
        </Callout>
      </LabSection>
      <LabSection title="Identity">
        <Callout title="The Key Idea" variant="info">
          <p>
            Every object that you create has its own identity. Even if two
            objects contain exactly the same data, they are still two different
            objects.
          </p>
        </Callout>
        <LabCard title="Two Different Objects">
          <pre>{`
objectA ─────► { value: 1 }

objectB ─────► { value: 1 }
`}</pre>
        </LabCard>

        <LabCard title="One Shared Object">
          <pre>{`
const objectA = { value: 1 };

const objectB = objectA;


objectA ───┐
           ▼
      { value: 1 }
           ▲
objectB ───┘
`}</pre>
        </LabCard>

        <Callout variant="success" title="Observation">
          <p>
            JavaScript is not asking whether two objects look the same. It is
            asking whether they are the very same object.
          </p>
        </Callout>
      </LabSection>

      <LabSection title="React Connection">
        <Callout title="Every Render Runs Your Component Again" variant="info">
          <p>
            A React component is just a JavaScript function. Every time React
            renders a component, that function executes from top to bottom.
          </p>
        </Callout>

        <LabCard title="What React Does">
          <pre>{`
Render 1

const renderObject = { value: 1 };

↓

Render 2

const renderObject = { value: 1 };

↓

Render 3

const renderObject = { value: 1 };
`}</pre>
        </LabCard>

        <Callout variant="warning" title="What Changed?">
          <p>
            The code looks identical on every render, but each execution creates
            a new object with a new identity.
          </p>
        </Callout>

        <LabCard title="Remember React.memo?">
          <p>
            In the previous lab, the parent created a new object during every
            render. Although the object's contents never changed, its identity
            did.
          </p>

          <p>
            That is why <code>React.memo</code> rendered the child again.
          </p>
        </LabCard>
      </LabSection>
    </LabLayout>
  );
}

export default RenderingFundamentalsLabReferential;
