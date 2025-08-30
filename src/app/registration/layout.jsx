import React from "react";

export default function Layout({ children }) {
  return (
    <>
      <main className="fluid-ontainer mt-5">{children}</main>
    </>
  );
}
