#!/usr/bin/env python3
import http.server
import socketserver
import os

PORT = 5000

class SimpleHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_GET(self):
        original_path = self.path
        
        # Handle root path
        if self.path == '/':
            self.path = '/index.html'
        
        # Handle clean URLs without .html extension
        elif not self.path.endswith('.html') and not '.' in self.path.split('/')[-1]:
            # Try to find corresponding .html file
            clean_path = self.path.strip('/')
            if clean_path and os.path.exists(f'{clean_path}.html'):
                self.path = f'/{clean_path}.html'
        
        # Check if file exists before serving
        file_path = self.path.lstrip('/')
        if os.path.exists(file_path):
            return super().do_GET()
        else:
            # File not found, serve custom 404 page
            self.send_response(404)
            self.send_header('Content-type', 'text/html; charset=utf-8')
            self.end_headers()
            
            if os.path.exists('404.html'):
                with open('404.html', 'rb') as f:
                    self.wfile.write(f.read())
            else:
                self.wfile.write(b'<h1>404 - Page Not Found</h1>')

    def log_message(self, format, *args):
        pass

def run_server():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    socketserver.TCPServer.allow_reuse_address = True
    
    with socketserver.TCPServer(("0.0.0.0", PORT), SimpleHandler) as httpd:
        print(f"Static server running at http://0.0.0.0:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped")

if __name__ == "__main__":
    run_server()