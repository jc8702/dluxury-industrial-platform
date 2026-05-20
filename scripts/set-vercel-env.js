#!/usr/bin/env node
const https = require('https');

const VERCEL_TOKEN = process.env.VERCEL_TOKEN || process.env.VERCEL_API_TOKEN;
const PROJECT_ID = 'prj_lsmV2rkhAzoF4KXZVwDFY0VwTuoc';
const API_KEY = 'AIzaSyBUZZ3l5Zfpa-urA67wHSff02b9XEz7bbU';

if (!VERCEL_TOKEN) {
  console.error('Provide VERCEL_TOKEN environment variable');
  process.exit(1);
}

function apiRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const options = {
      hostname: 'api.vercel.com',
      path,
      method,
      headers: {
        'Authorization': `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    };
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); }
        catch (e) { resolve(body); }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('Adding GEMINI_API_KEY to Vercel project...');

  const result = await apiRequest('POST', `/v10/projects/${PROJECT_ID}/env`, {
    name: 'GEMINI_API_KEY',
    value: API_KEY,
    environment: 'production',
    gitBranch: '',
  });

  if (result.error) {
    if (result.error.code === 'ENV_ALREADY_EXISTS') {
      console.log('GEMINI_API_KEY already exists. Updating...');
      await apiRequest('PATCH', `/v10/projects/${PROJECT_ID}/env/${result.error.envId}`, {
        value: API_KEY,
      });
      console.log('Updated!');
    } else {
      console.error('Error:', result.error);
    }
  } else {
    console.log('Added GEMINI_API_KEY successfully!');
  }

  const result2 = await apiRequest('POST', `/v10/projects/${PROJECT_ID}/env`, {
    name: 'GOOGLE_GENERATIVE_AI_API_KEY',
    value: API_KEY,
    environment: 'production',
    gitBranch: '',
  });

  if (result2.error) {
    console.log('GOOGLE_GENERATIVE_AI_API_KEY already exists or error:', result2.error.code);
  } else {
    console.log('Added GOOGLE_GENERATIVE_AI_API_KEY successfully!');
  }
}

main().catch(console.error);