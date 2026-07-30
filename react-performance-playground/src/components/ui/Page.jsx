function Page({ title, description, children }) {
  return (
    <section className="page-container">
      <header className="page-header">
        <h2>{title}</h2>

        {description && <p>{description}</p>}
      </header>

      <div className="page-content">{children}</div>
    </section>
  );
}

export default Page;
