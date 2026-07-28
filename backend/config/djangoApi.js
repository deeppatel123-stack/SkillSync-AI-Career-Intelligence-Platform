const http = require('http');

const DJANGO_AI_URL = process.env.DJANGO_AI_URL || 'http://127.0.0.1:8000';

function djangoRequest(method, path, bodyData) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, DJANGO_AI_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method,
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000,
    };

    let bodyString = null;
    if (bodyData) {
      bodyString = JSON.stringify(bodyData);
      options.headers['Content-Length'] = Buffer.byteLength(bodyString);
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { resolve({ raw: data }); }
      });
    });

    req.on('error', (error) => reject(new Error(`Django AI service unavailable: ${error.message}`)));
    req.on('timeout', () => { req.destroy(); reject(new Error('Django AI service request timed out')); });

    if (bodyString) req.write(bodyString);
    req.end();
  });
}

const djangoApi = {
  get: (path) => djangoRequest('GET', path),
  post: (path, data) => djangoRequest('POST', path, data),
};

module.exports = djangoApi;
