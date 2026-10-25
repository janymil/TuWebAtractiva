import http.server
import socketserver
import os
import urllib.parse
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 24892

class ThreadingHTTPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True
    daemon_threads = True

class CleanURLHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        super().end_headers()

    def do_GET(self):
        try:
            parsed = urllib.parse.urlparse(self.path)
            path = urllib.parse.unquote(parsed.path)
            query = f"?{parsed.query}" if parsed.query else ""

            if path == '/':
                self.path = f'/index.html{query}'
                return super().do_GET()

            local_rel_path = path.lstrip('/')
            if not os.path.exists(local_rel_path):
                if os.path.exists(f"{local_rel_path}.html"):
                    self.path = f"/{local_rel_path}.html{query}"
                elif os.path.exists('404.html'):
                    self.send_response(404)
                    self.send_header('Content-Type', 'text/html; charset=utf-8')
                    self.end_headers()
                    with open('404.html', 'rb') as f:
                        self.wfile.write(f.read())
                    return

            return super().do_GET()
        except (ConnectionAbortedError, ConnectionResetError, BrokenPipeError):
            pass

def run_server():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    with ThreadingHTTPServer(("0.0.0.0", PORT), CleanURLHandler) as httpd:
        print(f"Server running at http://localhost:{PORT}", flush=True)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass

if __name__ == '__main__':
    run_server()
