const path = require('path');
const functions = require('firebase-functions');
const next = require('next');
const { createServer } = require('http');
const { parse } = require('url');
const { join } = require('path');

/*
Note: process.env.NODE_ENV is automatically set by GAE  when deployed
  but will need to be manually set locally via `NODE_ENV=production npm run start`
*/
const dev = process.env.NODE_ENV !== 'production';
const app = next({
  dev,
  conf: { distDir: `${path.relative(process.cwd(), __dirname)}/next` },
});

const handle = app.getRequestHandler();


exports.next = functions.https.onRequest((req, res) => {
  app.prepare().then(() => {
    const parsedUrl = parse(req.url, true);
    const { pathname } = parsedUrl;
    // handle GET request to /service-worker.js
    if (pathname === '/service-worker.js') {
      const filePath = join(__dirname, 'dist', pathname);
      app.serveStatic(req, res, filePath);
    } else {
      handle(req, res, parsedUrl);
    }
  });
});
