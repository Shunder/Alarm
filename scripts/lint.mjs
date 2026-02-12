import fs from 'node:fs';
import path from 'node:path';

const targets = ['src', 'tests', 'scripts'];
let hasError = false;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    if (entry.isFile() && /\.(js|mjs)$/.test(entry.name)) {
      const content = fs.readFileSync(full, 'utf8');
      if (content.includes('\t')) {
        console.error(`Tab indentation found: ${full}`);
        hasError = true;
      }
    }
  }
}

targets.forEach((t) => fs.existsSync(t) && walk(t));
if (hasError) process.exit(1);
console.log('Lint pass (basic).');
