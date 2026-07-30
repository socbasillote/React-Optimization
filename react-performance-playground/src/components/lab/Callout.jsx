import React from "react";

function Callout({ title, children, variant = "info" }) {
  return (
    <div className={`callout callout-${variant}`}>
      {title && <h3 className="callout-title">{title}</h3>}

      <div className="callout-content">{children}</div>
    </div>
  );
}

export default Callout;
