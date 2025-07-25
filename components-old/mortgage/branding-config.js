const BRANDING_CONFIG = {
  broker: {
    name: "Andreina Ford",
    title: "Mortgage Agent Level 2",
    company: "BRX Mortgage",
    brokerage: "BRX Mortgage FSRA #13463",
    license: "#M2400357",
    phone: "613-743-7866",
    email: "andreina@mortgagewithford.ca",
    website: "mortgagewithford.ca",
    businessWebsite: "maincharactermortgage.ca",
    bookingUrl: "callme.mortgagewithford.ca",
    location: "Ontario, Canada",
    tagline: "Making mortgage decisions make sense for Ontario families",
    bio: "Mortgage Agent Level 2 serving Ontario families. Specializing in first-time buyer programs, renewals, and complex financing solutions."
  },

  compliance: {
    fsraDisclaimer: "Licensed under the Mortgage Brokerages, Lenders and Administrators Act, 2006.",
    rateDisclaimer: "Rates shown are posted rates and subject to change. Actual rates may vary based on your credit profile, down payment, and other factors.",
    offerDisclaimer: "This is not an offer to lend. All rates and information are subject to change without notice. Terms and conditions apply.",
    privacyNote: "Personal information is collected in accordance with PIPEDA privacy regulations.",
    lastUpdated: new Date().toISOString().split('T')[0]
  },

  design: {
    primaryColor: "#2563eb", // Blue-600
    secondaryColor: "#1e40af", // Blue-700
    accentColor: "#16a34a", // Green-600
    logoInitials: "AF",
    brandColors: {
      blue: "#2563eb",
      green: "#16a34a",
      gray: "#374151",
      red: "#dc2626"
    }
  },

  services: [
    "First-Time Buyer Programs",
    "Mortgage Renewals & Refinancing", 
    "Investment Property Financing",
    "Self-Employed Mortgages",
    "HELOC & Equity Solutions",
    "Commercial Mortgages"
  ],

  certifications: [
    "FSRA Licensed Mortgage Agent Level 2",
    "BRX Mortgage FSRA #13463",
    "License #M2400357",
    "Member of Mortgage Professionals Canada",
    "Continuing Education Certified",
    "PIPEDA Privacy Compliant"
  ],

  cta: {
    primary: "Get Your Free Mortgage Consultation",
    secondary: "Compare Personalized Rates",
    phone: "Call 613-743-7866",
    email: "Email andreina@mortgagewithford.ca",
    booking: "Book Free Call - callme.mortgagewithford.ca"
  },

  social: {
    linkedin: "linkedin.com/in/andreinaford",
    facebook: "facebook.com/mortgagewithford",
    instagram: "@mortgagewithford"
  },

  legal: {
    copyrightYear: "2025",
    companyName: "Andreina Ford Mortgage Services",
    privacyPolicy: "/privacy-policy",
    termsOfService: "/terms-of-service",
    accessibility: "/accessibility"
  }
};

module.exports = BRANDING_CONFIG;