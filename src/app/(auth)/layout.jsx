export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4 transition-colors">
      <div className="w-full max-w-md">
        {/* You could add a simple back-to-home logo or icon here later */}
        {children}
      </div>
    </div>
  );
}