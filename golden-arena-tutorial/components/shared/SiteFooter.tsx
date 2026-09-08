"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import ProtectedLink from "./ProtectedLink";

type SiteFooterProps = {
  user?: {
    id?: string;
    email?: string;
    isPaid?: boolean;
  } | null;
};

// Map each footer link to its route destination and protection rules
const footerSections = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "/", isPublic: true },
      { label: "About", href: "/about", isPublic: true },
      { label: "Pricing", href: "/#pricing", isPublic: true },
      { label: "Past Questions", href: "/past-questions", isPublic: false, requiresPaid: false },
      { label: "Contact", href: "/#contact", isPublic: true },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Study Notes", href: "/study-notes", isPublic: false, requiresPaid: false },
      { label: "Mock Exams", href: "/mock-exams", isPublic: false, requiresPaid: true },
      { label: "Subjects", href: "/#subjects", isPublic: true },
      { label: "FAQs", href: "/#faq", isPublic: true },
      { label: "Support", href: "/#contact", isPublic: true },
    ],
  },
];

// Inline SVG Icons for Socials
const socialLinks = [
  {
    label: "WhatsApp",
    href: "https://wa.me/2348160764272",
    icon: (props: any) => <MessageCircle {...props} />,
  },
  {
    label: "X (Twitter)",
    href: "https://twitter.com",
    icon: (props: any) => (
      <svg {...props} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (props: any) => (
      <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: (props: any) => (
      <svg {...props} viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    icon: (props: any) => (
      <svg {...props} viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

export function SiteFooter({ user = null }: SiteFooterProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Smart Navigation and Scroll Handler
  const handleScrollClick = (href: string, e: React.MouseEvent) => {
    // 1. Home Link Handling
    if (href === "/") {
      if (user) {
        // Logged-in user clicking logo/home goes to their dashboard
        e.preventDefault();
        router.push("/dashboard");
        return;
      }

      if (pathname === "/") {
        // Visitor on home page smooth scrolls to top
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    // 2. Section Anchors (e.g., /#pricing, /#contact, /#subjects, /#faq)
    if (href.startsWith("/#")) {
      const targetId = href.replace("/#", "");

      if (pathname === "/") {
        // Currently on home page -> smooth scroll directly to section element
        const element = document.getElementById(targetId);
        if (element) {
          e.preventDefault();
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        // On another page (e.g. /dashboard or /past-questions) -> navigate back to home with anchor
        e.preventDefault();
        router.push(href);
      }
    }
  };

  return (
    <footer className="bg-[#171717] text-white">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:px-8">
        
        {/* Brand & Socials Column */}
        <div className="space-y-4">
          <Link
            href={user ? "/dashboard" : "/"}
            onClick={(e) => handleScrollClick(user ? "/dashboard" : "/", e)}
            className="inline-flex items-center gap-3 group"
          >
            {/* Logo Container */}
            <div className="relative h-12 w-auto shrink-0 transition-transform duration-200 group-hover:scale-105">
              <Image
                src="/images/gatLogo.png"
                alt="Golden Arena Tutorial Logo"
                width={120}
                height={120}
                className="h-12 w-auto object-contain"
              />
            </div>
            <div>
              <p className="text-xl font-black leading-tight transition-colors group-hover:text-[#833b0c]">
                GAT
              </p>
              <p className="text-[9px] text-white/50">Golden Arena Tutorial</p>
            </div>
          </Link>

          <p className="max-w-xs text-xs leading-5 text-white/55">
            Empowering Nigerian students with the right tools for academic success in UTME and Post-UTME exams.
          </p>

          {/* Social Media Icons */}
          <div className="pt-2 flex items-center gap-2.5">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="grid size-8 place-items-center rounded-lg bg-white/5 text-white/70 transition-all duration-200 hover:bg-[#833b0c] hover:text-white hover:scale-110"
                >
                  <Icon className="size-4" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Dynamic Link Columns */}
        {footerSections.map((column) => (
          <div key={column.title}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">{column.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={link.label}>
                  {link.isPublic ? (
                    <Link
                      href={link.href}
                      onClick={(e) => handleScrollClick(link.href, e)}
                      className="text-xs text-white/55 transition-colors duration-200 hover:text-[#833b0c]"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <ProtectedLink
                      href={link.href}
                      user={user}
                      requiresPaid={link.requiresPaid}
                      className="text-xs text-white/55 transition-colors duration-200 hover:text-[#833b0c]"
                    >
                      {link.label}
                    </ProtectedLink>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Contact Information Section */}
        <div id="contact" className="scroll-mt-24">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">Contact Us</h3>
          <p className="mt-4 text-xs text-white/55">+234 816 076 4272</p>
          <p className="mt-2 text-xs text-white/55">support@gat.com</p>
          <p className="mt-2 text-xs text-white/55">Lagos, Nigeria</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-5 py-4 text-[10px] text-white/40 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>© 2026 GAT. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="transition-colors duration-200 hover:text-[#833b0c]">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors duration-200 hover:text-[#833b0c]">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}