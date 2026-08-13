import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/shared/ThemeProvider";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Pet Care Management",
  description: "Manage your pets, appointments, and medical records.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={jakarta.variable} suppressHydrationWarning>
      <body 
        className="min-h-screen bg-background text-foreground flex flex-col font-sans antialiased"
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}