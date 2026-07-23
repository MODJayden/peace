import { Link } from "react-router-dom";
import { TwitterIcon, FacebookIcon, LinkedinIcon, YoutubeIcon } from "@/components/ui/social-icons";

const SECTIONS = [
  {
    title: "Sections",
    links: [
      { label: "Politics", to: "/category/politics" },
      { label: "Business", to: "/category/business" },
      { label: "Technology", to: "/category/technology" },
      { label: "Sports", to: "/category/sports" },
      { label: "World News", to: "/category/world-news" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About SirPeace", to: "/about" },
      { label: "Contact", to: "/contact" },
      { label: "Newsletter", to: "/newsletter" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", to: "/privacy-policy" },
      { label: "Terms of Service", to: "/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-ink text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2">
            <Link to="/" className="font-display text-2xl font-bold text-paper">
              Sir<span className="text-gold">Peace</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-slate-400">
              Ghana's premium digital newsroom — reporting the stories that shape the nation, every single day.
            </p>
            <div className="mt-5 flex gap-4">
              <a href="#" aria-label="Twitter" className="text-slate-400 hover:text-gold">
                <TwitterIcon size={18} />
              </a>
              <a href="#" aria-label="Facebook" className="text-slate-400 hover:text-gold">
                <FacebookIcon size={18} />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-slate-400 hover:text-gold">
                <LinkedinIcon size={18} />
              </a>
              <a href="#" aria-label="YouTube" className="text-slate-400 hover:text-gold">
                <YoutubeIcon size={18} />
              </a>
            </div>
          </div>

          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-500">
                {section.title}
              </h4>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-slate-300 hover:text-gold">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-slate-700 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} SirPeace. All rights reserved.</p>
          <p className="font-mono">Built in Accra, Ghana</p>
        </div>
      </div>
    </footer>
  );
}
