import React, { useState } from "react";

function Parent() {
  const authors = Array.from({ length: 100000 }, (_, id) => ({
    id,
    name: `Author ${id}`,
  }));
  return <div>Parent</div>;
}

export default Parent;
