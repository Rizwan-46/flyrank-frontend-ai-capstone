import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import FAQ from "@/components/home/FAQ";
import CTASection from "@/components/home/CTASection";

export const metadata = {
  title: "PetCare App — Simple Pet Health & Care Management",
  description:
    "Track vaccinations, medical history, and appointments for all your pets in one organized dashboard. Free demo, no backend required.",
  openGraph: {
    title: "PetCare App — Simple Pet Health & Care Management",
    description:
      "Track vaccinations, medical history, and appointments for all your pets in one organized dashboard.",
    type: "website",
  },
};

// FAQPage structured data — improves SEO rich-result eligibility.
// Keep this in sync with the questions/answers in components/home/FAQ.jsx.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is this a real veterinary service?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. PetCare App is a demo/portfolio project using locally stored demo data with no real backend.",
      },
    },
    {
      "@type": "Question",
      name: "Where is my data stored?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "All data is stored locally in your browser using localStorage.",
      },
    },
    {
      "@type": "Question",
      name: "How are vaccination statuses calculated?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Statuses are calculated automatically from the vaccination's next due date compared to today's date.",
      },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Hero />
      <Features />
      {/* Future section slot: e.g. an interactive/3D showcase
          can be added here as its own component, between
          Features and FAQ, without touching either. */}
      <FAQ />
    </>
  );
}