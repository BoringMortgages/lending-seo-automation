# Google Search Console Setup Instructions

## Step 1: Create Property
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click "Add Property" 
3. Select "URL prefix" and enter: `https://boringmortgages.ca`

## Step 2: Verify Ownership
1. Choose "HTML tag" verification method
2. Copy the content value from the meta tag (looks like: `google-site-verification=ABC123DEF456`)
3. Replace "your-google-verification-code" in `app/layout.tsx` with your actual code
4. Deploy the changes
5. Click "Verify" in Search Console

## Step 3: Submit Sitemaps
After verification, submit these sitemaps:
- `https://boringmortgages.ca/sitemap.xml`
- `https://boringmortgages.ca/robots.txt`

## Step 4: Set Up Monitoring
1. Go to "Performance" tab
2. Enable email alerts for critical issues
3. Set up weekly performance reports

## Next Steps
- Wait 48-72 hours for initial data collection
- Review "Coverage" report for indexing issues
- Check "Core Web Vitals" for performance issues
- Monitor "Performance" for keyword rankings

## Important Notes
- Data appears 24-48 hours after verification
- Historical data is limited to 16 months
- Use filters to analyze specific pages/queries