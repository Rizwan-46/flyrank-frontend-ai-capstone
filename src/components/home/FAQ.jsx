import { homeFaqs } from "@/data/faqData";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  return (
    <section aria-labelledby="faq-heading" className="py-20 sm:py-32" data-testid="faq-section">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-sm font-semibold tracking-wide text-primary uppercase">
            Got Questions?
          </h2>
          <p
            id="faq-heading"
            className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
          >
            Frequently asked questions
          </p>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Everything you might want to know before signing up.
          </p>
        </div>

        {/* Accordion Card */}
        <div className="mt-16 overflow-hidden rounded-3xl border border-border/50 bg-card px-6 py-4 shadow-sm sm:px-10 sm:py-8">
          <Accordion 
            type="single" 
            collapsible="true" 
            className="w-full" 
            data-testid="faq-accordion"
          >
            {homeFaqs.map((faq, index) => (
              <AccordionItem 
                key={faq.question} 
                value={`item-${index}`} 
                data-testid={`faq-item-${index}`}
                className="border-border/50 last:border-0"
              >
                <AccordionTrigger 
                  className="py-6 text-left text-lg font-semibold transition-all hover:text-primary hover:no-underline"
                  data-testid={`faq-trigger-${index}`}
                >
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent 
                  className="pb-6 text-base leading-relaxed text-muted-foreground"
                  data-testid={`faq-content-${index}`}
                >
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

      </div>
    </section>
  );
}