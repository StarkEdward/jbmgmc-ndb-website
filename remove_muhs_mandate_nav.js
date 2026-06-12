const fs = require('fs');
const dbPath = 'e:/New folder/b_a4NfVLTCLIh-1773847072793/data/db.json';
const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const originalLength = data.navItems.length;

// Filter out the top-level MUHS Mandate
data.navItems = data.navItems.filter(item => item.id !== 'muhs-mandate' && item.label !== 'MUHS Mandate');

if (data.navItems.length < originalLength) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  console.log('Removed MUHS Mandate top-level menu item.');
} else {
  console.log('Top-level MUHS Mandate menu item not found.');
}
