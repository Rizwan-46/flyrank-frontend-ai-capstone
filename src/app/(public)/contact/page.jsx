import ContactForm from "./ContactForm";

export const metadata = {
  title: "Contact Us | PetCare App",
  description:
    "Get in touch with the PetCare App team. Send us a message and we'll get back to you.",
};

export default function ContactPage() {
  return (
    <section aria-labelledby="contact-heading" className="py-10">
      <div className="mx-auto max-w-xl">
        <h1
          id="contact-heading"
          className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
        >
          Contact Us
        </h1>
        <p className="mt-4 text-muted-foreground">
          Have a question or feedback? Fill out the form below and we&apos;ll
          get back to you as soon as we can.
        </p>

        <div className="mt-8">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}