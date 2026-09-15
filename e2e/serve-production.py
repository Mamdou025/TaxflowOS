"""Local-only SPA preview for the built artifact; no deployment is performed."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import HTTPError

ROOT = Path(__file__).resolve().parents[1] / 'artifacts/ai-workflow-builder/dist/public'


class SPAHandler(SimpleHTTPRequestHandler):
    def proxy_api(self):
        data = self.rfile.read(int(self.headers.get('Content-Length', '0'))) if self.command in ('POST', 'PUT', 'PATCH') else None
        request = Request('http://127.0.0.1:5050' + self.path, data=data, method=self.command,
                          headers={key: value for key, value in self.headers.items() if key.lower() in ['content-type', 'cookie', 'authorization', 'x-workflow-workspace']})
        try:
            response = urlopen(request, timeout=45)
        except HTTPError as error:
            response = error
        with response:
            body = response.read()
            try:
                self.send_response(response.status)
                self.send_header('Content-Type', response.headers.get('Content-Type', 'application/json'))
                self.send_header('Content-Length', str(len(body)))
                self.end_headers()
                self.wfile.write(body)
            except (BrokenPipeError, ConnectionResetError, ConnectionAbortedError):
                # Navigation can cancel a browser request after the API responds.
                pass

    def do_GET(self):
        if self.path.startswith('/api/'):
            return self.proxy_api()
        if not Path(self.translate_path(self.path.split('?')[0])).is_file() and not self.path.startswith('/assets/'):
            self.path = '/index.html'
        super().do_GET()

    def do_POST(self):
        if self.path.startswith('/api/'):
            return self.proxy_api()
        self.send_error(405)

    do_PUT = do_POST
    do_DELETE = do_POST

    def log_message(self, *_):
        pass


if __name__ == '__main__':
    print(f'Production preview: http://127.0.0.1:4173 ({ROOT})', flush=True)
    ThreadingHTTPServer(('127.0.0.1', 4173), partial(SPAHandler, directory=str(ROOT))).serve_forever()
