import { cardTocItems } from "./cardGuideChapters";

const CardGuideTOC = () => (
  <section className="container mx-auto px-4 py-14">
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold text-secondary text-center mb-8">Table of Contents</h2>
      <nav className="space-y-1">
        {cardTocItems.map((entry) => (
          <a
            key={entry.id}
            href={`#${entry.id}`}
            className="block font-bold text-secondary hover:text-primary transition-colors py-2 text-base md:text-lg"
          >
            {entry.label}
          </a>
        ))}
      </nav>
    </div>
  </section>
);

export default CardGuideTOC;