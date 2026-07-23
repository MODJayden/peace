import { useDocumentHead } from "@/hooks/useDocumentHead";

const SECTIONS = [
  {
    title: "Acceptance of Terms",
    body: "By accessing or using SirPeace, you agree to be bound by these Terms of Service and our Privacy Policy.",
  },
  {
    title: "User Accounts",
    body: "You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account. You must provide accurate information when registering.",
  },
  {
    title: "User-Generated Content",
    body: "Comments and other content you submit must not be unlawful, defamatory, or infringe on the rights of others. SirPeace reserves the right to moderate, edit, or remove content that violates these terms.",
  },
  {
    title: "Author Content",
    body: "Authors publishing on SirPeace retain ownership of their work but grant SirPeace a license to host, distribute, and promote that content on the platform. All published content passes through editorial review.",
  },
  {
    title: "Intellectual Property",
    body: "All SirPeace branding, design, and original editorial content are the property of SirPeace unless otherwise credited. Reproduction without permission is prohibited.",
  },
  {
    title: "Limitation of Liability",
    body: "SirPeace is provided \"as is\" without warranties of any kind. We are not liable for any damages arising from your use of the platform.",
  },
  {
    title: "Changes to These Terms",
    body: "We may update these terms from time to time. Continued use of SirPeace after changes constitutes acceptance of the revised terms.",
  },
];

export default function TermsPage() {
  useDocumentHead({ title: "Terms of Service" });

  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="font-display text-3xl font-bold text-ink">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted">Last updated: January 2026</p>

      <div className="mt-8 space-y-8">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <h2 className="font-display text-xl font-semibold text-ink">{section.title}</h2>
            <p className="mt-2 text-body leading-relaxed">{section.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
