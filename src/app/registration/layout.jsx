import 'bootstrap/dist/css/bootstrap.min.css';


export default function Layout({ children }) {
  return (
    <div>
      <main className="container mt-5">{children}</main>
    </div>
  );
}
