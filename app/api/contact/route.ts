import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, service, message } = body;

    // Validate required fields
    if (!name || !email || !service) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Save the form data to your database
    // 2. Send a confirmation email to the user
    // 3. Send a notification email to Andreina Ford
    // 4. Integrate with your CRM system

    // For now, we'll log the submission and simulate success
    console.log('Contact form submission:', {
      name,
      email,
      service,
      message,
      timestamp: new Date().toISOString()
    });

    // TODO: Implement actual email sending
    // You can use services like:
    // - Resend (resend.com)
    // - SendGrid
    // - Nodemailer with your SMTP provider
    // - Vercel's built-in email functionality

    // Example email sending logic (commented out):
    /*
    const confirmationEmail = {
      to: email,
      subject: 'Thank you for your mortgage inquiry - Boring Mortgages Ontario',
      html: `
        <h2>Thank you for contacting us!</h2>
        <p>Hi ${name},</p>
        <p>We've received your inquiry about ${service} and will be in touch within 24 hours.</p>
        <p>In the meantime, you can explore our mortgage calculators and resources.</p>
        <p>Best regards,<br>Boring Mortgages Ontario Team</p>
      `
    };

    const notificationEmail = {
      to: 'hello@boringmortgages.ca',
      subject: 'New mortgage inquiry received',
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Message:</strong> ${message || 'No additional message'}</p>
      `
    };
    */

    return NextResponse.json(
      { 
        success: true, 
        message: 'Form submitted successfully. You will receive a confirmation email shortly.' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 