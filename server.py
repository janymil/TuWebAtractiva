import http.server
import socketserver
import os

PORT = 5000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def do_GET(self):
        # Handle root path
        if self.path == '/':
            self.path = '/index.html'
        return super().do_GET()

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
