# Hostinger .htaccess Configuration for Cache Control

## Overview

This guide provides .htaccess configuration for managing browser caching on Hostinger's static HTML hosting. This helps ensure visitors see your latest changes while still benefiting from caching for performance.

## Complete .htaccess File

Create a file named `.htaccess` in your website's root directory with the following content:

```apache
# Enable mod_headers (if not already enabled)
<IfModule mod_headers.c>
    
    # =====================================================
    # HTML FILES - No caching (always fetch fresh version)
    # =====================================================
    <FilesMatch "\.(html|htm)$">
        FileETag None
        Header unset ETag
        Header set Cache-Control "no-cache, no-store, must-revalidate"
        Header set Pragma "no-cache"
        Header set Expires 0
    </FilesMatch>
    
    # =====================================================
    # CSS & JS FILES - Cache for 1 week
    # =====================================================
    <FilesMatch "\.(css|js)$">
        Header set Cache-Control "max-age=604800, public"
    </FilesMatch>
    
    # =====================================================
    # IMAGES - Cache for 1 month
    # =====================================================
    <FilesMatch "\.(jpg|jpeg|png|gif|webp|svg|ico)$">
        Header set Cache-Control "max-age=2592000, public"
    </FilesMatch>
    
    # =====================================================
    # FONTS - Cache for 1 year
    # =====================================================
    <FilesMatch "\.(woff|woff2|ttf|otf|eot)$">
        Header set Cache-Control "max-age=31536000, public"
    </FilesMatch>
    
    # =====================================================
    # OTHER STATIC ASSETS - Cache for 1 month
    # =====================================================
    <FilesMatch "\.(pdf|doc|docx|xls|xlsx|ppt|pptx|zip)$">
        Header set Cache-Control "max-age=2592000, public"
    </FilesMatch>

</IfModule>

# =====================================================
# GZIP COMPRESSION (for better performance)
# =====================================================
<IfModule mod_deflate.c>
    # Compress HTML, CSS, JavaScript, Text, XML
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE text/javascript
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xml+rss
    AddOutputFilterByType DEFLATE text/plain
</IfModule>

# =====================================================
# SECURITY HEADERS (bonus for better security)
# =====================================================
<IfModule mod_headers.c>
    # Protect against XSS attacks
    Header set X-XSS-Protection "1; mode=block"
    
    # Prevent MIME type sniffing
    Header set X-Content-Type-Options "nosniff"
    
    # Protect against clickjacking
    Header set X-Frame-Options "SAMEORIGIN"
    
    # Referrer Policy
    Header set Referrer-Policy "no-referrer-when-downgrade"
</IfModule>

# =====================================================
# REMOVE SERVER SIGNATURE (for security)
# =====================================================
ServerSignature Off

# =====================================================
# CUSTOM ERROR PAGES (optional)
# =====================================================
ErrorDocument 404 /404.html
```

## How to Use

1. **Create the file**: 
   - Create a new file named `.htaccess` (note the dot at the beginning)
   - Copy the entire configuration above
   - Save the file

2. **Upload to Hostinger**:
   - Upload the `.htaccess` file to your website's root directory
   - It should be in the same folder as your `index.html`

3. **Verify it's working**:
   - Clear your browser cache
   - Visit your website
   - Open Developer Tools (F12)
   - Go to Network tab
   - Refresh the page
   - Check the Response Headers for your files

## Important Notes

1. **Version Parameters Still Needed**: Even with this .htaccess file, keep using version parameters (`?v=2`) on your CSS and JS files. This ensures immediate updates when you change these files.

2. **HTML Files**: The configuration ensures HTML files are never cached, so changes to your HTML will be seen immediately.

3. **Testing**: After uploading the .htaccess file, test your site in an incognito/private window to ensure it's working correctly.

4. **Hostinger Compatibility**: Most Hostinger plans support .htaccess files. If it doesn't work, contact Hostinger support to confirm your plan supports .htaccess.

## Troubleshooting

If the .htaccess file doesn't seem to work:

1. **Check file name**: Ensure it's exactly `.htaccess` (with the dot, no extension)
2. **File location**: It must be in the root directory
3. **Plan limitations**: Some basic hosting plans might not support all .htaccess features
4. **Syntax errors**: Even a small typo can prevent the file from working

## Quick Update Workflow

When you make changes to your site:

1. Update your CSS/JS files
2. Change version numbers in HTML files (e.g., `?v=2` to `?v=3`)
3. Upload all changed files to Hostinger
4. The .htaccess file will handle the rest

## Alternative: Simplified Version

If the full version causes issues, try this minimal version:

```apache
# Minimal .htaccess for cache control
<IfModule mod_headers.c>
    # No cache for HTML
    <FilesMatch "\.(html|htm)$">
        Header set Cache-Control "no-cache"
    </FilesMatch>
    
    # Cache static assets for 1 week
    <FilesMatch "\.(css|js|jpg|jpeg|png|gif|svg)$">
        Header set Cache-Control "max-age=604800"
    </FilesMatch>
</IfModule>
```

This simplified version just handles the basic caching needs without extra features.