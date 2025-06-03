#!/usr/bin/env python3
import http.server
import socketserver
import os
import urllib.parse

PORT = 5000

class CleanURLHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_GET(self):
        # Parse the URL
        parsed_path = urllib.parse.urlparse(self.path)
        clean_path = parsed_path.path
        
        # Handle root path
        if clean_path == '/':
            clean_path = '/index.html'
        
        # Handle clean URLs - add .html if no extension
        elif not clean_path.endswith('.html') and not '.' in os.path.basename(clean_path):
            # Remove leading slash and add .html
            page_name = clean_path.strip('/')
            if page_name:
                clean_path = f'/{page_name}.html'
        
        # Set the modified path
        self.path = clean_path
        
        # Check if the file exists
        file_path = clean_path.lstrip('/')
        
        if os.path.exists(file_path) and os.path.isfile(file_path):
            # File exists, serve it normally
            return super().do_GET()
        else:
            # File not found, serve 404
            self.send_response(404)
            self.send_header('Content-type', 'text/html; charset=utf-8')
            self.end_headers()
            
            # Try to serve custom 404 page
            if os.path.exists('404.html'):
                with open('404.html', 'rb') as f:
                    self.wfile.write(f.read())
            else:
                # Fallback 404 message
                self.wfile.write(b'''
                <!DOCTYPE html>
                <html>
                <head><title>404 - Page Not Found</title></head>
                <body>
                    <h1>404 - Page Not Found</h1>
                    <p>The requested page could not be found.</p>
                    <a href="/">Return to Home</a>
                </body>
                </html>
                ''')

    def log_message(self, format, *args):
        # Suppress default logging to reduce console noise
        pass

def run_server():
    # Change to the directory containing this script
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Allow socket reuse
    socketserver.TCPServer.allow_reuse_address = True
    
    with socketserver.TCPServer(("0.0.0.0", PORT), CleanURLHandler) as httpd:
        print(f"Static server running at http://0.0.0.0:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped")

if __name__ == "__main__":
    run_server()