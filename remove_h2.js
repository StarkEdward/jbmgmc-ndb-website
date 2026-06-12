const fs = require('fs');
const dbPath = 'e:/New folder/b_a4NfVLTCLIh-1773847072793/data/db.json';
const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

let updated = 0;
data.dynamicPages.forEach(p => {
  let content = p.content.trim();
  if (content.startsWith('<h2>')) {
    // Remove the leading <h2>...</h2> tag completely since the layout already provides the page title in the Hero banner.
    p.content = content.replace(/^<h2>.*?<\/h2>/i, '').trim();
    updated++;
    console.log(`Removed redundant H2 from: ${p.slug}`);
  }
});

if (updated > 0) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Successfully cleaned up redundant <h2> headers from ${updated} pages!`);
} else {
  console.log('No redundant headers found.');
}
