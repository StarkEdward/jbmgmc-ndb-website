const fs = require('fs');
const dbPath = 'e:/New folder/b_a4NfVLTCLIh-1773847072793/data/db.json';
const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

let pageIndex = data.dynamicPages.findIndex(p => p.slug === 'administration/anti-ragging');

if (pageIndex !== -1) {
  // Move it to committees/anti-ragging
  data.dynamicPages[pageIndex].slug = 'committees/anti-ragging';
  
  // Replace the breadcrumb text 'Administration' with 'Committees'
  data.dynamicPages[pageIndex].content = data.dynamicPages[pageIndex].content.replace('<span>Administration</span>', '<span>Committees</span>');
  
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  console.log('Successfully moved anti-ragging to committees/anti-ragging!');
} else {
  // Just in case it's not found, maybe create it from scratch
  console.log('Could not find administration/anti-ragging. Please verify.');
}
