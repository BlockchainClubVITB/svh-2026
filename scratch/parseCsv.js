const fs = require('fs');
const path = require('path');

const csvPath = 'C:\\personal dg\\github_repo\\svh-2026\\src\\data\\svh-result.csv';
const jsOutputPath = 'C:\\personal dg\\github_repo\\svh-2026\\src\\data\\staticResults.js';

const content = fs.readFileSync(csvPath, 'utf-8');
const lines = content.split(/\r?\n/).filter(line => line.trim());

// Skip header
const dataLines = lines.slice(1);

const results = [];

// A simple CSV parser that respects quotes
function parseCsvLine(text) {
  let p = '', r = [];
  let q = false;
  for (let i = 0; i < text.length; i++) {
    let c = text[i];
    if (c === '"') {
      q = !q;
    } else if (c === ',' && !q) {
      r.push(p.trim());
      p = '';
    } else {
      p += c;
    }
  }
  r.push(p.trim());
  return r;
}

dataLines.forEach(line => {
  const parts = parseCsvLine(line);
  if (parts.length >= 7) {
    results.push({
      problemCode: parts[0],
      problemStatement: parts[1],
      theme: parts[2],
      teamId: parts[3],
      teamName: parts[4] || '-',
      leaderName: parts[5] || '-',
      status: parts[6]
    });
  }
});

const jsContent = `export const STATIC_RESULTS = ${JSON.stringify(results, null, 2)};\n`;
fs.writeFileSync(jsOutputPath, jsContent, 'utf-8');
console.log('Successfully written staticResults.js with', results.length, 'records.');
