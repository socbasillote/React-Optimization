import Page from "../ui/Page";

function LabLayout({ title, description, children }) {
  return (
    <Page title={title} description={description}>
      <div className="lab-layout">{children}</div>
    </Page>
  );
}

export default LabLayout;
