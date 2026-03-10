export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex flex-col justify-center items-center bg-blue-700 text-white p-12">
        <h1 className="text-4xl font-bold mb-4">HealthQueue</h1>
        <p className="text-lg text-center max-w-md">
          Manage your doctor appointments easily and securely. Book
          consultations, track history, and stay connected with healthcare
          professionals.
        </p>
      </div>
      <div className="flex items-center justify-center bg-slate-50 p-6">
        {children}
      </div>
    </div>
  );
}
