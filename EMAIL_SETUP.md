# Email Notification Setup Guide

This guide will help you set up email notifications for the LeadHer Shop checkout system.

## Email Service Provider: Resend

We're using [Resend](https://resend.com) as our email service provider. It's modern, reliable, and has excellent Next.js integration.

### Why Resend?

- **Developer-friendly**: Simple API and great documentation
- **Reliable delivery**: High deliverability rates
- **Next.js integration**: Built specifically for modern web apps
- **Free tier**: 3,000 emails/month free
- **Easy setup**: No complex configuration needed

## Setup Instructions

### 1. Create Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

### 2. Get API Key

1. Log into your Resend dashboard
2. Go to "API Keys" section
3. Click "Create API Key"
4. Give it a name like "LeadHer Shop"
5. Copy the API key (starts with `re_`)

### 3. Verify Domain (Optional but Recommended)

1. In Resend dashboard, go to "Domains"
2. Add your domain (e.g., `leadhershop.com`)
3. Follow the DNS verification steps
4. This allows you to send emails from `noreply@leadhershop.com`

### 4. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your actual values:
   ```env
   # Resend API Configuration
   RESEND_API_KEY=re_your_actual_api_key_here

   # Owner Email (where order notifications will be sent)
   OWNER_EMAIL=your-email@example.com

   # From Email (must be verified in Resend)
   FROM_EMAIL=noreply@yourdomain.com
   ```

### 5. Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Add items to cart and go through checkout
3. Check your email for the order notification
4. Check the customer's email for the confirmation

## Email Templates

The system includes two email templates:

### 1. Owner Notification Email
- Sent to the store owner when an order is placed
- Includes customer details, order items, and totals
- Professional design with order summary

### 2. Customer Confirmation Email
- Sent to the customer after order placement
- Confirms order details and next steps
- Branded with LeadHer Shop styling

## Customization

### Email Templates
Edit the HTML templates in `/src/lib/email.ts`:
- `generateOrderEmailHTML()` - Owner notification
- `generateOrderConfirmationHTML()` - Customer confirmation

### Email Content
Modify the email content in the same file:
- Subject lines
- Email body text
- Styling and branding

### Order Processing
Customize the order flow in `/src/app/api/orders/route.ts`:
- Add order validation
- Integrate with inventory systems
- Add payment processing

## Troubleshooting

### Common Issues

1. **"Failed to send email" error**
   - Check your API key is correct
   - Ensure the API key has proper permissions
   - Verify your domain is set up correctly

2. **Emails going to spam**
   - Set up SPF, DKIM, and DMARC records
   - Use a verified domain
   - Avoid spam trigger words

3. **"Invalid email address" error**
   - Check the email format
   - Ensure the domain is verified in Resend

### Debug Mode

Add this to your `.env.local` to see detailed logs:
```env
NODE_ENV=development
```

## Production Deployment

### Environment Variables
Make sure to set these in your production environment:
- `RESEND_API_KEY`
- `OWNER_EMAIL`
- `FROM_EMAIL`

### Domain Verification
For production, verify your domain in Resend to:
- Send emails from your domain
- Improve deliverability
- Look more professional

## Support

- Resend Documentation: https://resend.com/docs
- Resend Support: support@resend.com
- LeadHer Shop Issues: Create an issue in the repository

## Security Notes

- Never commit your API keys to version control
- Use environment variables for all sensitive data
- Regularly rotate your API keys
- Monitor your email usage and costs
