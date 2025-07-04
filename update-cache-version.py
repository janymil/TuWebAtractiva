#!/usr/bin/env python3
"""
Cache Version Updater for Static HTML Site
This script updates version query parameters in all HTML files to bust browser cache
"""

import os
import re
import time
from datetime import datetime

def get_version_string():
    """Generate a version string based on current timestamp"""
    return str(int(time.time()))

def update_html_file(filepath, version):
    """Update version parameters in a single HTML file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Update CSS file references
    content = re.sub(
        r'(href="[^"]*\.css)(\?v=\d+)?(")',
        rf'\1?v={version}\3',
        content
    )
    
    # Update JS file references
    content = re.sub(
        r'(src="[^"]*\.js)(\?v=\d+)?(")',
        rf'\1?v={version}\3',
        content
    )
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Updated: {filepath}")

def main():
    """Main function to update all HTML files"""
    version = get_version_string()
    html_files = []
    
    # Find all HTML files in the current directory
    for root, dirs, files in os.walk('.'):
        # Skip node_modules and other directories
        if 'node_modules' in root or '.git' in root:
            continue
        
        for file in files:
            if file.endswith('.html'):
                html_files.append(os.path.join(root, file))
    
    print(f"Cache Buster Version Update")
    print(f"New version: {version}")
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Found {len(html_files)} HTML files to update\n")
    
    # Update each HTML file
    for filepath in html_files:
        update_html_file(filepath, version)
    
    print(f"\n✓ Updated {len(html_files)} files with version {version}")
    print("\nTip: Run this script after making changes to CSS or JS files")
    print("     to ensure browsers fetch the latest versions.")

if __name__ == "__main__":
    main()