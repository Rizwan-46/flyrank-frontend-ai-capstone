import ContactForm from "./ContactForm";
import { Mail, MapPin } from "lucide-react";

export const metadata = {
  title: "Contact Us | Pet Care Management",
  description:
    "Get in touch with the Pet Care Management team. Send us a message and we'll get back to you.",
};

export default function ContactPage() {
  return (
    <section aria-labelledby="contact-heading" className="bg-background py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-8">
          
          {/* Left Column: Text & Contact Info */}
          <div className="flex flex-col justify-center">
            <h2 className="text-sm font-semibold tracking-wide text-primary uppercase">
              Get in Touch
            </h2>
            <h1
              id="contact-heading"
              className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
            >
              Let's talk about your pets.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Have a question, feedback, or need help managing your records? Fill out the form, and our team will get back to you as soon as possible.
            </p>

            <dl className="mt-10 space-y-6 text-base text-muted-foreground">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                  <Mail className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <dt className="sr-only">Email</dt>
                  <dd className="font-medium text-foreground">support@petcare.com</dd>
                  <dd className="text-sm">Drop us a line anytime!</dd>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <dt className="sr-only">Location</dt>
                  <dd className="font-medium text-foreground">Rawalpindi, Pakistan</dd>
                  <dd className="text-sm">Headquarters</dd>
                </div>
              </div>
            </dl>
          </div>

          {/* Right Column: The Form Card */}
          <div className="rounded-3xl border border-border/50 bg-card p-6 shadow-sm sm:p-10">
            <h3 className="mb-8 text-xl font-semibold text-foreground">
              Send us a message
            </h3>
            <ContactForm />
          </div>

        </div>
      </div>
    </section>
  );
}