const fs = require('fs');
const dbPath = 'e:/New folder/b_a4NfVLTCLIh-1773847072793/data/db.json';
const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const adminMenu = data.navItems.find(n => n.label === 'Administration');
if (adminMenu && adminMenu.submenus) {
  const initialLength = adminMenu.submenus.length;
  adminMenu.submenus = adminMenu.submenus.filter(s => s.id !== 'anti-ragging');
  
  if (adminMenu.submenus.length < initialLength) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
    console.log('Successfully removed Anti-Ragging Committee from Administration tab menu!');
  } else {
    console.log('Anti-Ragging Committee not found in Administration tab menu.');
  }
} else {
  console.log('Administration menu not found.');
}
