// frontend/src/app/registration/loading.jsx
export default function RegistrationLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-200">
      <div className="flex space-x-2">
        <span className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></span>
        <span className="w-4 h-4 bg-blue-600 rounded-full animate-bounce [animation-delay:-.15s]"></span>
        <span className="w-4 h-4 bg-blue-600 rounded-full animate-bounce [animation-delay:-.3s]"></span>
      </div>
    </div>
  );
}
