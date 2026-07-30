function LabSection({ title, children }) {
  return (
    <section className="lab-section">
      <h2 className="lab-section-title">{title}</h2>

      <div className="lab-section-content">{children}</div>
    </section>
  );
}

export default LabSection;
