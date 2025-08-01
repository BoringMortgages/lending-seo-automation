# Analytics Dashboard Setup Guide
*Track your SEO progress and competitive performance*

## **Google Analytics 4 Configuration**

### Enhanced E-commerce Setup
```javascript
// Add to existing Analytics config in layout.tsx
gtag('config', 'GA_MEASUREMENT_ID', {
  custom_map: {
    'custom_parameter_1': 'mortgage_type',
    'custom_parameter_2': 'city_page',
    'custom_parameter_3': 'calculator_used'
  }
});

// Track mortgage calculator usage
gtag('event', 'mortgage_calculator_use', {
  mortgage_type: '5-year-fixed',
  city_page: 'toronto',
  calculator_type: 'payment_calculator'
});

// Track rate lock attempts
gtag('event', 'rate_lock_attempt', {
  rate_selected: '3.74%',
  term: '5-year',
  city: 'toronto'
});
```

### Key Events to Track
1. **Page Views**: Automatic
2. **Mortgage Calculator Usage**: Custom event
3. **Rate Lock Clicks**: Custom event  
4. **Contact Form Submissions**: Conversion
5. **Rate Alert Signups**: Lead generation
6. **External Link Clicks**: Pre-approval applications

### Custom Dimensions to Create
- **City Page**: Toronto, Hamilton, Ottawa, Mississauga
- **Mortgage Type**: Fixed, Variable, HELOC
- **Calculator Type**: Payment, Affordability, HELOC
- **User Type**: First-time visitor, Returning visitor
- **Traffic Source**: Organic, Direct, Referral

## **Google Search Console Monitoring**

### Weekly Review Checklist
- [ ] Check "Performance" for new ranking keywords
- [ ] Review "Coverage" for indexing issues
- [ ] Monitor "Core Web Vitals" scores
- [ ] Check "Security & Manual Actions"
- [ ] Review "Links" for new backlinks

### Key Reports to Monitor
1. **Search Results Performance**
   - Filter by "Date: Last 28 days vs Previous period"
   - Sort by "Impressions" to find opportunity keywords
   - Check CTR for pages ranking positions 4-10

2. **Page Performance Analysis**
   - Toronto page: Target 1000+ impressions/month
   - Hamilton page: Target 500+ impressions/month
   - Calculator pages: Monitor for featured snippets

3. **Query Analysis**
   - New keywords discovered organically
   - Question-based queries (FAQ opportunities)
   - Brand vs non-brand search performance

## **Competitive Analysis Dashboard**

### Ahrefs Weekly Monitoring
```
Project Setup:
- Domain: boringmortgages.ca
- Location: Canada
- Keywords: Import from KEYWORD_TRACKING_LIST.md

Competitor Domains to Track:
- ratehub.ca
- ratesdotca.com
- mortgagebrokerstore.com
- truenorthmortgage.ca
- mortgagealliance.com
```

### Key Ahrefs Reports
1. **Rank Tracker**: Weekly keyword position changes
2. **Competing Domains**: Who else ranks for your keywords
3. **Keywords Gap**: Keywords competitors rank for that you don't
4. **Content Gap**: Pages competitors have that you're missing
5. **Backlink Gap**: Link opportunities from competitor analysis

### Competitor Content Monitoring
- **New Pages**: Weekly scan for new mortgage content
- **Rate Updates**: Monitor how often they update rates
- **Calculator Changes**: Track new calculator features
- **Content Depth**: Compare word counts and topics covered

## **Monthly Performance Dashboard**

### Traffic Metrics (Google Analytics)
```
Period: Month-over-month comparison

Organic Traffic:
- Total organic sessions
- New vs returning users
- Average session duration
- Bounce rate by page type

Top Performing Pages:
1. Homepage traffic and conversions
2. Toronto page performance
3. Calculator usage and completion rates
4. Contact form conversion rates

Conversion Tracking:
- Rate lock form submissions
- Contact form completions
- Rate alert signups
- Pre-approval link clicks
```

### Ranking Performance (Search Console + Ahrefs)
```
Primary Keywords Ranking Progress:
- "toronto mortgage rates": Position [X] (±Y from last month)
- "mortgage calculator ontario": Position [X] (±Y)
- "best mortgage rates hamilton": Position [X] (±Y)

New Keyword Opportunities:
- Keywords entering top 20 for first time
- Question-based queries appearing
- Local search terms gaining traction

Competitor Movement:
- Keywords where competitors passed you
- Keywords where you passed competitors
- New competitors entering your keyword space
```

## **Automated Reporting Setup**

### Weekly Automated Reports
1. **Search Console**: Set up email alerts for critical issues
2. **Google Analytics**: Weekly traffic summary
3. **Ahrefs**: Ranking changes for primary keywords

### Monthly Comprehensive Reports
Create a template that includes:
- Traffic growth percentage
- Top 10 performing organic keywords
- Conversion rate by traffic source
- Competitor ranking changes
- New content opportunities identified
- Technical SEO issues to address

## **Performance Benchmarks & Goals**

### 30-Day Goals
- **Traffic**: 500+ organic visitors (from current baseline)
- **Rankings**: 5 keywords in top 20
- **Conversions**: 25+ rate lock attempts
- **Technical**: 100% pages indexed, no critical issues

### 90-Day Goals
- **Traffic**: 2,000+ organic visitors
- **Rankings**: 15 keywords in top 10
- **Conversions**: 100+ qualified leads
- **Coverage**: 500+ pages indexed (programmatic content)

### 6-Month Goals
- **Traffic**: 10,000+ organic visitors (as per PRD)
- **Rankings**: 50+ top 10 keywords
- **Conversions**: 500+ qualified mortgage leads
- **Authority**: Domain Rating 30+ (Ahrefs)

## **Alert Setup Instructions**

### Critical Alerts
1. **Traffic Drop >20%**: Weekly comparison
2. **Ranking Drop >5 positions**: For primary keywords
3. **Site Down/Technical Issues**: Immediate alerts
4. **New Backlinks**: Monitor for negative SEO
5. **Competitor New Content**: When they publish mortgage content

### Setup in Tools:
- **Google Analytics**: Anomaly detection alerts
- **Search Console**: Email notifications for manual actions
- **Ahrefs**: Ranking alerts for top keywords
- **Uptime Robot**: Site availability monitoring

## **ROI Tracking Formula**

```
Monthly SEO ROI Calculation:
- New organic leads generated: [X]
- Average lead value: $2,000 (mortgage commission)
- Total lead value: [X] × $2,000 = $[Y]
- SEO tool costs: ~$200/month
- ROI: ([Y] - $200) ÷ $200 × 100 = [Z]%

Success Benchmark: 500% ROI minimum
(10 leads/month = $20,000 value vs $200 cost = 9,900% ROI)
```

This comprehensive tracking setup will give you complete visibility into your SEO performance, competitive position, and ROI from your mortgage content strategy.