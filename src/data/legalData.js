import { 
  Database, Shield, Lock, EyeOff, 
  Scale, UserCheck, Stethoscope, ShieldAlert 
} from "lucide-react";

export const privacyPolicies = [
  {
    title: "Information We Collect",
    content: "We collect information you provide directly to us, including your name, email address, and the specific details you enter regarding your pets (names, breeds, medical history, vaccinations, and appointment notes).",
    icon: Database, // Notice we do not use <Database /> here
  },
  {
    title: "How We Use Your Data",
    content: "Your data is used strictly to provide and improve the Pet Care Management service. This includes authenticating your login, saving your pet records, rendering your dashboard, and calculating upcoming medical reminders.",
    icon: Shield,
  },
  {
    title: "Data Security",
    content: "We implement industry-standard security measures to protect your personal information and pet data from unauthorized access, alteration, or destruction. Your passwords are cryptographically hashed before being stored.",
    icon: Lock,
  },
  {
    title: "Third-Party Disclosure",
    content: "We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted third-party services that assist us in operating our website or database infrastructure, provided those parties agree to keep this information confidential.",
    icon: EyeOff,
  },
];

export const termsSections = [
  {
    title: "1. Acceptance of Terms",
    content: "By creating an account and using the Pet Care Management platform, you agree to comply with and be bound by these Terms & Conditions. If you do not agree with any part of these terms, you may not use our service.",
    icon: Scale,
  },
  {
    title: "2. User Accounts & Responsibilities",
    content: "You are responsible for maintaining the confidentiality of your account credentials (email and password). You agree to provide accurate, current, and complete information regarding your pets and immediately notify us of any unauthorized use of your account.",
    icon: UserCheck,
  },
  {
    title: "3. Not a Substitute for Veterinary Advice",
    content: "This platform is designed strictly for organizational and record-keeping purposes. The information stored here does not constitute professional veterinary advice, diagnosis, or treatment. Always consult a certified veterinarian for your pet's health concerns.",
    icon: Stethoscope,
  },
  {
    title: "4. Limitation of Liability",
    content: "Pet Care Management shall not be held liable for any missed appointments, lapsed vaccinations, or health complications resulting from the use of, or inability to use, this platform. Reminders are provided as a courtesy and should not be your sole method of tracking medical deadlines.",
    icon: ShieldAlert,
  },
];