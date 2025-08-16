import Header from "../Header";

// frontend/src/app/profile/layout.jsx
export default function ProfileLayout({ children }) {
  return <div className="min-h-screen">
    <Header />
    {children}
    </div>;
}
