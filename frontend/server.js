import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 4000;

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist/frontend/browser')));

// Send all requests to index.html
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/frontend/browser/index.html'));
});

// Start the server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});