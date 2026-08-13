import { ShieldCheck, CalendarHeart, Clock, Activity, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "About Us | Pet Care Management",
  description:
    "Learn about Pet Care Management — a simple, organized way to manage your pets' health records, vaccinations, and appointments in one place.",
};

export default function AboutPage() {
  const features = [
    {
      title: "Smart Reminders",
      description: "Track vaccination schedules and get reminders before they're due.",
      icon: <Clock className="h-6 w-6 text-primary" />,
    },
    {
      title: "Complete History",
      description: "Keep a full, easily accessible medical history for every pet in your home.",
      icon: <Activity className="h-6 w-6 text-primary" />,
    },
    {
      title: "Appointment Tracking",
      description: "Manage upcoming check-ups and review past veterinary appointments.",
      icon: <CalendarHeart className="h-6 w-6 text-primary" />,
    },
    {
      title: "Central Dashboard",
      description: "View everything from one central, organized, and beautiful interface.",
      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
    },
  ];

  return (
    <section aria-labelledby="about-heading" className="min-h-screen bg-background pb-20 pt-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 shadow-sm">
            <Heart className="h-8 w-8 text-primary" />
          </div>
          <h1
            id="about-heading"
            className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl"
          >
            About Pet Care Management
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            We help pet owners keep every important detail about their animals — health records, vaccinations, and appointments — organized in one simple, beautiful place.
          </p>
        </div>

        {/* Mission Banner */}
        <div className="mt-16">
          <Card className="border-none bg-primary/5 shadow-none">
            <CardContent className="flex flex-col items-center p-8 text-center sm:p-12">
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Our Mission</h2>
              <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
                We believe pet care shouldn&apos;t rely on scattered paper records or memory. Our platform gives owners a clear, always up-to-date view of their pet&apos;s medical history so nothing important ever gets missed.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="mt-20">
          <h2 className="mb-10 text-center text-2xl font-bold text-foreground sm:text-3xl">
            What You Can Do
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {features.map((feature) => (
              <Card key={feature.title} className="border border-border/50 transition-all hover:shadow-md">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Built With Care Footer */}
        <div className="mt-24 text-center">
          <h2 className="text-2xl font-bold text-foreground">Built With Care</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            This project was built as a focused, polished demonstration of modern frontend engineering practices — combining a clean interface with practical, real-world pet care workflows.
          </p>
        </div>
        
      </div>
    </section>
  );
}