const fs = require('fs');

function replaceFile(path, oldText, newText) {
  if (fs.existsSync(path)) {
    let content = fs.readFileSync(path, 'utf8');
    content = content.replace(oldText, newText);
    fs.writeFileSync(path, content);
  }
}

// 1. Clean .next types
fs.rmSync('.next', { recursive: true, force: true });

// 2. Fix EventBlogItem in lib/db.ts
let dbTs = fs.readFileSync('lib/db.ts', 'utf8');
if (!dbTs.includes('description?: string')) {
  dbTs = dbTs.replace(/export interface EventBlogItem\s*\{[^}]+\}/, 
    'export interface EventBlogItem {\n  id: number\n  title: string\n  date: string\n  description?: string\n  fullArticle?: string\n  content: string\n  photos: string[]\n  youtubeVideoUrl?: string\n}');
  fs.writeFileSync('lib/db.ts', dbTs);
}

// 3. Fix category in gallery-client
replaceFile('app/portal-jbmgmc/gallery/gallery-client.tsx', 'category: string', 'category: any');

// 4. Fix locked state in login
replaceFile('app/portal-jbmgmc/login/page.tsx', 'animationState === \'locked\'', 'false /* animationState === locked */');
replaceFile('app/portal-jbmgmc/login/page.tsx', 'animationState === \'locked\'', 'false');

// 5. Fix news-events-client undefined title
replaceFile('app/portal-jbmgmc/news-events/news-events-client.tsx', 'editingTender ? { ...editingTender, [field]: value } : { [field]: value }', 'editingTender ? { ...editingTender, [field]: value } : { title: ``, url: ``, [field]: value }');

// 6. Fix parameters implicitly any
replaceFile('components/home/announcement-banner.tsx', '.map((n, idx)', '.map((n: any, idx: number)');
replaceFile('components/home/announcement-banner.tsx', '.map((n)', '.map((n: any)');
replaceFile('components/home/announcement-popup.tsx', '.map((n, idx)', '.map((n: any, idx: number)');
replaceFile('components/home/announcement-popup.tsx', '.map((n)', '.map((n: any)');
replaceFile('components/home/meet-authorities-section.tsx', '.map((person, idx)', '.map((person: any, idx: number)');
