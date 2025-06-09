# EmailJS Setup Guide for Tu Web Atractiva

## Overview
This guide will help you set up EmailJS to enable email functionality for your contact form. EmailJS allows sending emails directly from your static website without a backend server.

## Step 1: Create EmailJS Account
1. Go to [emailjs.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Add Email Service
1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail recommended)
4. Follow the authentication process
5. Note down your **Service ID** (e.g., "service_abc123")

## Step 3: Create Email Templates

### Template 1: Main Email (to info@tuwebatractiva.com)
1. Go to "Email Templates" in your dashboard
2. Click "Create New Template"
3. Use the template ID: `template_contacto`
4. Copy the HTML content from `emailjs-template.html`
5. In the template settings:
   - **To Email**: info@tuwebatractiva.com
   - **Subject**: Nueva solicitud de cotización web - {{nombre}}
   - **Template Name**: Contacto Principal

### Template 2: User Confirmation Email
1. Create another template with ID: `template_user_confirmation`
2. Copy the HTML content from `emailjs-user-confirmation-template.html`
3. In the template settings:
   - **To Email**: {{email}}
   - **Subject**: Confirmación de solicitud - Tu Web Atractiva
   - **Template Name**: Confirmación Usuario

## Step 4: Get Your Credentials
After setting up your service and templates, collect these values:

1. **Public Key**: Found in "Account" → "General" → "Public Key"
2. **Service ID**: From your email service (e.g., "service_abc123")
3. **Template ID 1**: `template_contacto`
4. **Template ID 2**: `template_user_confirmation`

## Step 5: Update Website Configuration
Replace the placeholder values in `js/main.js`:

```javascript
// Replace these lines:
const publicKey = 'YOUR_EMAILJS_PUBLIC_KEY';
const serviceID = 'YOUR_SERVICE_ID';
const templateID = 'YOUR_TEMPLATE_ID';
const userTemplateID = 'YOUR_USER_TEMPLATE_ID';

// With your actual values:
const publicKey = 'your_actual_public_key';
const serviceID = 'service_abc123';
const templateID = 'template_contacto';
const userTemplateID = 'template_user_confirmation';
```

## Template Variables Used
Make sure these variables are configured in your EmailJS templates:

### Main Template Variables:
- `{{nombre}}` - Customer name
- `{{telefono}}` - Phone/WhatsApp number
- `{{email}}` - Customer email
- `{{empresa}}` - Company name
- `{{sitio_actual}}` - Current website
- `{{tipo_servicio}}` - Service type
- `{{tipo_negocio}}` - Business type
- `{{presupuesto}}` - Budget range
- `{{urgencia}}` - Project urgency
- `{{mensaje}}` - Project description
- `{{fecha_envio}}` - Submission timestamp

### User Confirmation Template Variables:
- Same variables as above for personalization

## Testing
1. After configuration, test the form on your website
2. Check that emails arrive at info@tuwebatractiva.com
3. Verify confirmation emails reach users
4. Monitor EmailJS dashboard for delivery status

## Fallback System
If EmailJS fails, the form automatically falls back to WhatsApp messaging, ensuring no leads are lost.

## Monthly Limits
- Free plan: 200 emails/month
- Paid plans available for higher volume

## Support
- EmailJS Documentation: https://www.emailjs.com/docs/
- Contact their support for technical issues