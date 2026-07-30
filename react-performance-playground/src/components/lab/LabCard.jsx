function LabCard({ title, children }) {
  return (
    <article className="lab-card">
      {title && <h3 className="lab-card-title">{title}</h3>}

      <div className="lab-card-content">{children}</div>
    </article>
  );
}

export default LabCard;
