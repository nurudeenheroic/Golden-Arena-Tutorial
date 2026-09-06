// components/shared/SiteFooter.tsx
//
// Shared footer used by both the marketing layout and the candidate
// layout. Static content — no auth-state branching needed here, since
// both visitors and logged-in students want the same links (support,
// resources, contact) at the bottom of every page.

const footerColumns = [
  {
    title: "Quick Links",
    links: ["Home", "About", "Pricing", "Past Questions", "Contact"],
  },
  {
    title: "Resources",
    links: ["Study Notes", "Mock Exams", "Subjects", "FAQs", "Support"],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-[#171717] text-white">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="grid size-10 place-items-center rounded-xl bg-white text-[#833b0c]">
              G
            </div>
            <div>
              <p className="text-xl font-black">GAT</p>
              <p className="text-[9px] text-white/50">Golden Arena Tutorial</p>
            </div>
          </div>

          <p className="mt-4 max-w-xs text-xs leading-5 text-white/55">
            Empowering Nigerian students with the right tools for academic success.
          </p>
        </div>

        {footerColumns.map((column) => (
          <div key={column.title}>
            <h3 className="text-xs font-bold">{column.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-xs text-white/55 hover:text-white">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="text-xs font-bold">Contact Us</h3>
          <p className="mt-4 text-xs text-white/55">+234 812 345 6789</p>
          <p className="mt-2 text-xs text-white/55">support@gat.com</p>
          <p className="mt-2 text-xs text-white/55">Lagos, Nigeria</p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-5 py-4 text-[10px] text-white/40 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>© 2026 GAT. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
