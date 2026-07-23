import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

function apiDevServerPlugin() {
  return {
    name: 'api-dev-server',
    config(config, { mode }) {
      const env = loadEnv(mode, process.cwd(), '');
      Object.assign(process.env, env);
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/')) {
          // Make sure env is loaded on every request
          const env = loadEnv(server.config.mode || 'development', process.cwd(), '');
          Object.assign(process.env, env);

          const apiName = req.url.split('?')[0].replace('/api/', '');
          try {
            // Parse body for POST requests
            let body = {};
            if (req.method === 'POST') {
              const buffers = [];
              for await (const chunk of req) {
                buffers.push(chunk);
              }
              const rawBody = Buffer.concat(buffers).toString('utf-8');
              if (rawBody) {
                try {
                  body = JSON.parse(rawBody);
                } catch (e) {
                  // Not valid JSON, leave body empty
                }
              }
            }

            req.body = body;

            // Express-style helper methods for Vercel serverless compatibility
            res.status = function (code) {
              res.statusCode = code;
              return res;
            };
            res.json = function (data) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
              return res;
            };

            if (apiName === 'uploadPdf') {
              const { default: handler } = await import('./api/uploadPdf.js');
              await handler(req, res);
              return;
            } else if (apiName === 'sendEmail') {
              const { default: handler } = await import('./api/sendEmail.js');
              await handler(req, res);
              return;
            } else if (apiName === 'bulkSendEmail') {
              const { default: handler } = await import('./api/bulkSendEmail.js');
              await handler(req, res);
              return;
            }
          } catch (err) {
            console.error(`[API Dev Error] ${req.url}:`, err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: err.message || 'Internal Server Error' }));
            return;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), apiDevServerPlugin()],
  optimizeDeps: {
    exclude: ['./api/uploadPdf.js', './api/sendEmail.js'],
  },
  build: {
    rollupOptions: {
      external: [/^\/api\//],
    },
  },
});
