import express from 'express';
import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';

// Essential for proper module resolution with ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function app(): express.Application {
    const server = express();
    const distFolder = resolve(process.cwd(), 'dist/frontend/browser');
    const indexHtml = join(process.cwd(), 'dist/frontend/browser/index.html');

    const commonEngine = new CommonEngine();

    // Health check endpoint
    server.get('/health', (req, res) => {
        res.status(200).send('OK');
    });

    // Serve static files
    server.use(express.static(distFolder, {
        maxAge: '1y'
    }));

    // All other routes
    server.get('*', async (req, res, next) => {
        try {
            // Check if request is for static file
            if (req.url.includes('.')) {
                next();
                return;
            }

            const { protocol, originalUrl, baseUrl, headers } = req;

            const html = await commonEngine.render({
                bootstrap,
                documentFilePath: indexHtml,
                url: `${protocol}://${headers.host}${originalUrl}`,
                publicPath: distFolder,
                providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
            });

            res.send(html);
        } catch (error) {
            console.error('Error rendering page:', error);
            next(error);
        }
    });

    // Error handler
    server.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.error('Server error:', err);
        res.status(500).send('Server Error');
    });

    return server;
}

function run(): void {
    const port = process.env['PORT'] ? Number(process.env['PORT']) : 4000;

    try {
        const server = app();
        
        server.listen(port, '0.0.0.0', () => {
            console.log(`Node server listening at http://0.0.0.0:${port}`);
        });

        // Handle server errors
        server.on('error', (e: any) => {
            if (e.code === 'EADDRINUSE') {
                console.error(`Port ${port} is already in use`);
            } else {
                console.error('Server error:', e);
            }
            process.exit(1);
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Start the server
run();