// Centralized contact information and CTA configuration
export const CONTACT_CONFIG = {
  // Primary contact methods
  email: "hello@boringmortgages.ca",
  consultationUrl: "https://callme.mortgagewithford.ca",
  applicationUrl: "https://andreina-ford.mtg-app.com/signup?brokerName=andreina.ford&brokerId=7208e0a3-3590-47b7-a99d-4704d9c75268",
  websiteUrl: "https://mortgagewithford.ca",
  homeUrl: "https://boringmortgages.ca",
  
  // CTA Button Text
  cta: {
    primary: "Apply Now for Pre-Approval!",
    consultation: "Book Consultation →",
    getHelp: "Get Expert Help →",
    contactUs: "Contact Us",
    lockRate: "Lock Rate",
    preApproval: "Apply for Pre-Approval",
    getPreApproved: "Get Pre-Approved Now",
    email: "Email Us"
  },
  
  // Business Information
  business: {
    name: "Boring Mortgages Ontario",
    tagline: "Making complex mortgages boringly simple",
    agentName: "Andreina Ford",
    licenseTitle: "Licensed Mortgage Agent Level 2",
    licenseNumber: "BRX Mortgage #13463",
    credentials: [
      "Licensed in Ontario",
      "GTA Market Expert", 
      "BRX Mortgage #13463"
    ]
  }
};

// CTA styles for consistency
export const CTA_STYLES = {
  primary: "px-8 py-4 text-lg font-semibold inline-block rounded-lg text-white hover:opacity-90 transition-all bg-gradient-to-r from-slate-600 to-slate-800",
  secondary: "px-6 py-2 text-sm font-medium rounded-lg text-white hover:opacity-90 transition-opacity",
  consultation: "px-6 py-3 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 font-medium",
  orange: "bg-gradient-to-r from-orange-500 to-orange-600",
  slate: "bg-gradient-to-r from-slate-600 to-slate-800",
  transparent: "border-2 font-semibold hover:opacity-80"
};