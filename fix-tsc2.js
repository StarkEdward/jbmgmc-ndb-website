const fs = require('fs');

function replaceFile(path, oldText, newText) {
  if (fs.existsSync(path)) {
    let content = fs.readFileSync(path, 'utf8');
    content = content.replace(oldText, newText);
    fs.writeFileSync(path, content);
  }
}

function replaceRegex(path, regex, newText) {
  if (fs.existsSync(path)) {
    let content = fs.readFileSync(path, 'utf8');
    content = content.replace(regex, newText);
    fs.writeFileSync(path, content);
  }
}

// 1. Add date to TenderItem
let dbTs = fs.readFileSync('lib/db.ts', 'utf8');
if (!dbTs.includes('date?: string') && dbTs.includes('export interface TenderItem {')) {
  dbTs = dbTs.replace(/export interface TenderItem\s*\{[^}]+\}/, 
    'export interface TenderItem {\n  id: number\n  title: string\n  url: string\n  date?: string\n  isNew?: boolean\n}');
  fs.writeFileSync('lib/db.ts', dbTs);
}

// 2. Fix gallery-client category
replaceRegex('app/portal-jbmgmc/gallery/gallery-client.tsx', /category: string/g, 'category: any');

// 3. Fix banner and popup implicit any
replaceRegex('components/home/announcement-banner.tsx', /\.map\(\(n, idx\)/g, '.map((n: any, idx: number)');
replaceRegex('components/home/announcement-banner.tsx', /\.map\(\(n\)/g, '.map((n: any)');
replaceRegex('components/home/announcement-popup.tsx', /\.map\(\(n, idx\)/g, '.map((n: any, idx: number)');
replaceRegex('components/home/announcement-popup.tsx', /\.map\(\(n\)/g, '.map((n: any)');
