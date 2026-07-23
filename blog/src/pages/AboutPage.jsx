import { useDocumentHead } from "@/hooks/useDocumentHead";

export default function AboutPage() {
  useDocumentHead({
    title: "About Us",
    description: "Learn about SirPeace, Ghana's premium digital newsroom.",
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="font-display text-3xl font-bold text-ink">About SirPeace</h1>
      <div className="mt-6 space-y-5 text-body leading-relaxed">
        <p>
          SirPeace is Ghana's premium digital newsroom, built to deliver fast, accurate, and deeply reported
          journalism across politics, business, technology, sports, and culture. We believe Ghanaians deserve a
          news platform that matches the ambition and pace of the stories shaping the nation.
        </p>
        <p>
          Our newsroom brings together experienced journalists, editors, and contributors who hold themselves to a
          rigorous editorial process — every article passes through review before it reaches you. We combine that
          editorial discipline with modern publishing technology: real-time breaking news, personalized reading
          experiences, and tools that help our authors do their best work.
        </p>
        <p>
          Whether you're catching up on the day's headlines or diving deep into an investigative feature, SirPeace
          is built to be the most trusted read in Ghana's digital media landscape.
        </p>
      </div>
    </div>
  );
}
