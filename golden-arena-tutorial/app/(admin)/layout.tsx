// app/(marketing)/layout.tsx

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* Navbar */}

      <main>{children}</main>

      {/* Footer */}
    </div>
  );
}