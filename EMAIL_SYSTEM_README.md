# Tu Web Atractiva - Email Collection & Secure Download System

## 📧 Email Collection & Marketing

### Current Setup
- **Lead Magnet Form**: Collects name, email, and business type
- **SMTP**: Hostinger SMTP (smtp.hostinger.com:465)
- **Backend**: PHP with PHPMailer
- **Security**: Token-based secure downloads

### Recommended Email Marketing Services (Free Tiers)

1. **Mailchimp** ⭐ (Recommended)
   - Free: Up to 2,000 contacts, 10,000 emails/month
   - Features: Automation, templates, analytics
   - Integration: Add API key to `.env` file

2. **ConvertKit**
   - Free: Up to 1,000 subscribers
   - Great for creators and small businesses

3. **Sendinblue (Brevo)**
   - Free: 300 emails/day, unlimited contacts
   - SMS integration available

## 🔗 HTML Files for PDF Conversion

Convert these HTML pages to PDF:
- `http://tuwebatractiva.com/downloads/checklist-antes-lanzar-web.html`
- `http://tuwebatractiva.com/downloads/guia-10-elementos-esenciales-web.html`

## 🚀 Installation

1. Run the installation script:
```bash
chmod +x install.sh
./install.sh
```

2. Update SMTP credentials in `.env` file (already configured with your Hostinger settings)

3. Convert HTML to PDF:
   - Option 1: Use browser Print → Save as PDF
   - Option 2: Use wkhtmltopdf (automatic if installed)
   - Option 3: Online converters

## 🔒 Security Features

- **Protected Downloads**: Files only accessible with valid tokens
- **Token Expiry**: Downloads expire after 24 hours
- **No Direct Links**: PDF files blocked from direct access
- **Email Logging**: All submissions logged securely
- **Environment Variables**: Sensitive data in `.env` file

## 📊 Analytics & Tracking

The system logs:
- Email submissions (`data/emails.json`)
- Download activity (`data/downloads.json`)
- User IP addresses and timestamps

## 🛠️ Files Structure

```
/api/
  ├── email-handler.php    # Handles form submissions
  └── download.php         # Secure download handler

/config/
  └── email_config.php     # Email configuration

/data/                     # Logs and user data
  ├── emails.json         # Email submissions
  └── downloads.json      # Download activity

/downloads/               # Resource files
  ├── *.html             # Source files
  └── *.pdf              # Generated PDFs

.env                      # Environment variables
```

## 🔧 Configuration

### SMTP Settings (Hostinger)
```env
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USERNAME=info@tuwebatractiva.com
SMTP_PASSWORD=Madalbal1*
```

### Email Marketing Integration
Add to `.env` when ready:
```env
MAILCHIMP_API_KEY=your_api_key_here
MAILCHIMP_LIST_ID=your_list_id_here
```

## 📧 Email Templates

The system sends a welcome email with:
- Personalized greeting
- Secure download links
- Call-to-action for services
- WhatsApp contact link

## 🛡️ Security Best Practices

1. **Never expose `.env` file** (protected by .htaccess)
2. **Regular backups** of `data/` folder
3. **Monitor logs** for suspicious activity
4. **Update dependencies** regularly
5. **Use HTTPS** in production

## 📱 Testing

1. Test form submission on website
2. Check email delivery
3. Verify download links work
4. Confirm token expiry (24 hours)

## 🎯 Conversion Optimization

- **Clear Value Proposition**: Free resources
- **Minimal Friction**: Only name and email required
- **Immediate Gratification**: Instant download links
- **Follow-up**: WhatsApp integration for sales

## 📈 Future Enhancements

1. **A/B Testing**: Different lead magnets
2. **Email Sequences**: Automated follow-ups
3. **Analytics Integration**: Google Analytics events
4. **CRM Integration**: Sync with customer management
5. **Social Proof**: Testimonials on download page

## 🆘 Troubleshooting

### Email Not Sending
1. Check SMTP credentials in `.env`
2. Verify Hostinger SMTP settings
3. Check PHP error logs
4. Test with simple mail() function

### Downloads Not Working
1. Check file permissions (755 for folders, 644 for files)
2. Verify PDF files exist in downloads folder
3. Check token generation and validation
4. Review .htaccess configuration

### Form Not Submitting
1. Check JavaScript console for errors
2. Verify API endpoint accessibility
3. Check CORS settings
4. Test with simple form submission

## 📞 Support

- **Email**: info@tuwebatractiva.com
- **WhatsApp**: +51 938 693 848
- **Website**: https://tuwebatractiva.com
