// app/(marketing)/layout.js
// app/(marketing)/layout.tsx

export default function MarketingLayout({
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