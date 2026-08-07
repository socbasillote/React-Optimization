export default function PageHeader({ title, description, children }) {
  return (
    <div className="flex flex-col gap-4 border-b pb-5 md:flex-row md:items-start md:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>

        {description && (
          <p className="mt-1 text-muted-foreground">{description}</p>
        )}
      </div>

      {children}
    </div>
  );
}
