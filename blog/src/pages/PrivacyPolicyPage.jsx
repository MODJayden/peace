import { useDocumentHead } from "@/hooks/useDocumentHead";

const SECTIONS = [
  {
    title: "Information We Collect",
    body: "We collect information you provide directly (such as your name, email, and profile details when you register), along with usage data (pages viewed, articles read, and interactions) collected automatically through cookies and analytics tools.",
  },
  {
    title: "How We Use Your Information",
    body: "We use your information to operate and improve SirPeace, personalize your reading experience, send newsletters you've subscribed to, moderate content, and maintain the security of our platform.",
  },
  {
    title: "Cookies",
    body: "SirPeace uses cookies to keep you logged in, remember your preferences, and understand how our audience engages with our content. You can control cookies through your browser settings.",
  },
  {
    title: "Third-Party Services",
    body: "We use trusted third-party providers for image hosting, email delivery, and advertising (including Google AdSense). These providers process data under their own privacy policies.",
  },
  {
    title: "Your Rights",
    body: "You may access, update, or delete your account information at any time from your profile settings, or by contacting our team directly.",
  },
  {
    title: "Contact",
    body: "Questions about this policy can be directed to privacy@sirpeace.com.",
  },
];

export default function PrivacyPolicyPage() {
  useDocumentHead({ title: "Privacy Policy" });

  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="font-display text-3xl font-bold text-ink">Privacy Policy</h1>
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
