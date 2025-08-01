// CMHC Official Mortgage Calculation Rules (2025)
export const CMHC_RULES = {
  // Official CMHC Mortgage Insurance Premium Rates (2025)
  premiumRates: {
    65.00: 0.0060,   // Up to 65% LTV
    75.00: 0.0170,   // 65.01% to 75% LTV
    80.00: 0.0240,   // 75.01% to 80% LTV
    85.00: 0.0280,   // 80.01% to 85% LTV
    90.00: 0.0310,   // 85.01% to 90% LTV
    95.00: 0.0400,   // 90.01% to 95% LTV (traditional down payment)
    95.01: 0.0450    // 90.01% to 95% LTV (non-traditional down payment)
  },
  
  // CMHC Down Payment Requirements (Official 2025 Rules)
  downPaymentRules: {
    minDownPayment5Percent: 500000,     // 5% minimum on first $500k
    minDownPayment10Percent: 1000000,   // 10% on $500k-$1M portion
    minDownPayment20Percent: 1500000,   // 20% minimum on homes over $1M
    maxInsurablePrice: 1500000          // CMHC insurance available up to $1.5M
  },
  
  // 2025 Amortization Surcharges
  amortizationSurcharges: {
    standard: 0.0000,                   // Up to 25 years: 0.00%
    extended: 0.0025,                   // 26-30 years: +0.25%
    firstTimeBuyerNewBuild: 0.0020,     // Additional +0.20% for FTB new builds (30yr)
  },

  // 2025 High-Ratio Surcharges ($1M-$1.5M)
  highRatioSurcharges: {
    millionToOneFiveM: 0.0025,          // +0.25% for homes $1M-$1.5M (high-ratio only)
  },

  // Additional CMHC Rules (2025 Update)
  additionalRules: {
    minCreditScore: 680,
    maxAmortization: 30,                // Max 30 years
    standardAmortization: 25,           // Standard amortization period
    firstTimeBuyerMaxAmortization: 30,  // 30 years for first-time buyers on new builds
    nonTraditionalSourcePremium: 0.0450, // 4.50% for borrowed down payments
    provincialTaxProvinces: ['ON', 'QC', 'SK', 'MB'], // Provinces with PST on CMHC premiums
    ontarioTaxRate: 0.08,               // 8% PST in Ontario
    quebecTaxRate: 0.09975,             // 9.975% PST in Quebec
    saskatchewanTaxRate: 0.06,          // 6% PST in Saskatchewan
    manitobaTaxRate: 0.07               // 7% PST in Manitoba
  }
};

// Calculate minimum down payment based on official CMHC rules (2025)
export const calculateMinDownPayment = (price: number): number => {
  const rules = CMHC_RULES.downPaymentRules;
  
  if (price <= rules.minDownPayment5Percent) {
    return price * 0.05; // 5% on homes up to $500k
  } else if (price <= rules.maxInsurablePrice) {
    return (rules.minDownPayment5Percent * 0.05) + ((price - rules.minDownPayment5Percent) * 0.10);
    // 5% on first $500k, 10% on remainder up to $1.5M
  } else {
    return price * 0.20; // 20% on homes over $1.5M
  }
};

// Calculate CMHC premium based on official 2025 premium rates and surcharges
export const calculateCMHCPremium = (
  loanAmount: number, 
  price: number, 
  isTraditionalDownPayment: boolean = true, 
  isNewBuild: boolean = false,
  amortizationYears: number = 25,
  isFirstTimeBuyer: boolean = false
): number => {
  const ltv = (loanAmount / price) * 100;
  const rules = CMHC_RULES;
  
  // No insurance available for homes over $1.5M or LTV <= 80%
  if (ltv <= 80 || price > rules.downPaymentRules.maxInsurablePrice) {
    return 0;
  }
  
  // Determine base premium rate based on official 2025 CMHC LTV table
  let premiumRate = 0;
  if (ltv <= 65) {
    premiumRate = rules.premiumRates[65.00];       // 0.60%
  } else if (ltv <= 75) {
    premiumRate = rules.premiumRates[75.00];       // 1.70%
  } else if (ltv <= 80) {
    premiumRate = rules.premiumRates[80.00];       // 2.40%
  } else if (ltv <= 85) {
    premiumRate = rules.premiumRates[85.00];       // 2.80%
  } else if (ltv <= 90) {
    premiumRate = rules.premiumRates[90.00];       // 3.10%
  } else if (ltv <= 95) {
    // Use higher rate for non-traditional/borrowed down payment
    premiumRate = isTraditionalDownPayment ? rules.premiumRates[95.00] : rules.premiumRates[95.01]; // 4.00% or 4.50%
  }
  
  let totalPremiumRate = premiumRate;
  
  // Add 2025 amortization surcharges
  if (amortizationYears > 25) {
    totalPremiumRate += rules.amortizationSurcharges.extended; // +0.25%
    
    // Additional surcharge for first-time buyers with new builds (30-year amortization)
    if (isFirstTimeBuyer && isNewBuild && amortizationYears === 30) {
      totalPremiumRate += rules.amortizationSurcharges.firstTimeBuyerNewBuild; // +0.20%
    }
  }
  
  // Add 2025 high-ratio surcharge for homes $1M-$1.5M (high-ratio mortgages only)
  if (price >= 1000000 && price <= 1500000 && ltv > 80) {
    totalPremiumRate += rules.highRatioSurcharges.millionToOneFiveM; // +0.25%
  }
  
  return loanAmount * totalPremiumRate;
};

// Calculate monthly payment
export const calculatePayment = (principal: number, rate: number, years: number): number => {
  const monthlyRate = rate / 100 / 12;
  const numPayments = years * 12;
  
  if (monthlyRate === 0) return principal / numPayments;
  
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
         (Math.pow(1 + monthlyRate, numPayments) - 1);
};

// Rate interface
export interface MortgageRate {
  term: string;
  rate: string;
  type: string;
  bestFor?: string;
  lender: string;
  payment?: string;
  popular?: boolean;
}

// Helper function to determine best for description
export const getBestFor = (term: string, type: string): string => {
  if (term === "5-years-fixed" || term === "5 Year") return "Most popular";
  if (term === "3-years-fixed" || term === "3 Year") return "Medium-term security";
  if (term === "1-year-fixed" || term === "1 Year") return "Rate speculation";
  if (type === "Variable") return "Rate optimists";
  if (term === "2-years-fixed" || term === "2 Year") return "Short commitment";
  if (term === "10-years-fixed" || term === "10 Year") return "Long-term security";
  return "Flexible option";
};

// Format currency helper
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format percentage helper
export const formatPercent = (percent: number): string => {
  return `${percent.toFixed(1)}%`;
};