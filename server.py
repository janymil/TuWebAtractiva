import http.server
import socketserver
import os

PORT = 5000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enhanced cache control headers for live preview
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        # CORS headers for better development experience
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_GET(self):
        # Handle root path
        if self.path == '/':
            self.path = '/index.html'
        
        # Log requests for debugging
        print(f"Serving: {self.path}")
        
        return super().do_GET()

    def log_message(self, format, *args):
        # Enhanced logging to show which files are being served
        return super().log_message(format, *args)

def run_server():
    handler = MyHTTPRequestHandler
    
    with socketserver.TCPServer(("0.0.0.0", PORT), handler) as httpd:
        print(f"Servidor ejecutándose en http://0.0.0.0:{PORT}")
        print("Presiona Ctrl+C para detener el servidor")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServidor detenido")
            httpd.shutdown()

if __name__ == "__main__":
    # Change to the directory where the script is located
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    run_server()
