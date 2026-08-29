import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import dotenv from 'dotenv';
import url from 'url';

dotenv.config();

function localApiPlugin() {
  return {
    name: 'local-api-handler',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        const parsedUrl = url.parse(req.url, true);

        // Handler for /api/send-email
        if (parsedUrl.pathname === '/api/send-email' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              req.body = JSON.parse(body || '{}');
              const { default: handler } = await import('./api/send-email.ts');
              const customRes = {
                status: (code: number) => {
                  res.statusCode = code;
                  return customRes;
                },
                json: (data: any) => {
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(data));
                  return customRes;
                },
                setHeader: (name: string, value: string) => {
                  res.setHeader(name, value);
                  return customRes;
                },
                end: () => res.end(),
              };
              await handler(req, customRes);
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        // Handler for /api/photos
        if (parsedUrl.pathname === '/api/photos') {
          let body = '';
          req.query = parsedUrl.query;
          req.on('data', (chunk: any) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              if (body) {
                req.body = JSON.parse(body);
              }
              const { default: handler } = await import('./api/photos.ts');
              const customRes = {
                status: (code: number) => {
                  res.statusCode = code;
                  return customRes;
                },
                json: (data: any) => {
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(data));
                  return customRes;
                },
                setHeader: (name: string, value: string) => {
                  res.setHeader(name, value);
                  return customRes;
                },
                end: () => res.end(),
              };
              await handler(req, customRes);
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), localApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
