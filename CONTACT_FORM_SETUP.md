# Contact Form Setup Guide

## Overview
The contact form has been successfully implemented with the following features:
- Modal popup when "Get Expert Help" buttons are clicked
- Form fields: Name, Email, Service Type (dropdown), and Additional Details
- Form validation and submission handling
- Success confirmation message
- API endpoint for processing submissions

## Current Implementation
- ✅ Form UI and validation
- ✅ Modal popup functionality
- ✅ API endpoint (`/api/contact`)
- ✅ Form submission handling
- ✅ Success/error states

## Email Setup Required

### Option 1: Resend (Recommended)
1. Sign up at [resend.com](https://resend.com)
2. Get your API key
3. Install the package: `npm install resend`
4. Update `/app/api/contact/route.ts`:

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// In the POST function, add:
const confirmationEmail = await resend.emails.send({
  from: 'Boring Mortgages <noreply@yourdomain.com>',
  to: email,
  subject: 'Thank you for your mortgage inquiry',
  html: `
    <h2>Thank you for contacting us!</h2>
    <p>Hi ${name},</p>
    <p>We've received your inquiry about ${service} and will be in touch within 24 hours.</p>
    <p>Best regards,<br>Andreina Ford<br>Licensed Mortgage Agent Level 2</p>
  `
});

const notificationEmail = await resend.emails.send({
  from: 'Contact Form <noreply@yourdomain.com>',
  to: 'hello@mortgagewithford.ca',
  subject: 'New mortgage inquiry received',
  html: `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Service:</strong> ${service}</p>
    <p><strong>Message:</strong> ${message || 'No additional message'}</p>
  `
});
```

### Option 2: SendGrid
1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Get your API key
3. Install: `npm install @sendgrid/mail`
4. Similar implementation to Resend

### Option 3: Nodemailer with SMTP
1. Install: `npm install nodemailer`
2. Configure with your SMTP provider (Gmail, Outlook, etc.)

## Environment Variables
Add to your `.env.local`:
```
RESEND_API_KEY=your_resend_api_key_here
```

## Form Fields
The form includes these service options:
- Mortgage Renewal
- Mortgage Refinance
- Home Purchase
- First Time Buyer
- Investment Property
- Construction Loan
- Home Equity Line of Credit (HELOC)
- Debt Consolidation
- Rate Comparison
- Other

## Testing
1. Start the development server: `npm run dev`
2. Click any "Get Expert Help" button
3. Fill out the form and submit
4. Check the console for form data logging
5. Once email is set up, test the confirmation emails

## Next Steps
1. Choose and implement an email service
2. Set up environment variables
3. Test the complete flow
4. Consider adding form data to a database
5. Set up CRM integration if needed 