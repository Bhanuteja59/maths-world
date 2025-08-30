import Header from "../Header"

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main className="fluid-container mt-5">{children}</main>
    </>
  );
}
