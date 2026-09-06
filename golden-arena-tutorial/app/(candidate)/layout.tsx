// app/(candidate)/layout.js
//  export default function CandidateLayout({ children }) {
  // Auth check will go here later (redirect to /login if not signed in)
 /* return (
    <div>
      { Dashboard sidebar/nav goes here}
      <main>{children}</main>
    </div>
  );
} */// app/(marketing)/layout.tsx

export default function CandidateLayout({
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