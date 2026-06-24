const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/news_events.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

function convertDate(dateStr) {
  if (!dateStr) return dateStr;
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      // Assuming DD/MM/YYYY
      const day = parts[0].padStart(2, '0');
      const month = parts[1].padStart(2, '0');
      const year = parts[2];
      return `${year}-${month}-${day}`;
    }
  }
  return dateStr;
}

if (db.newsEvents) {
  db.newsEvents.forEach(item => {
    if (item.date) {
      item.date = convertDate(item.date);
    }
  });
}

if (db.eventBlogs) {
  db.eventBlogs.forEach(item => {
    if (item.date) {
      item.date = convertDate(item.date);
    }
  });
}

if (db.tenders) {
  db.tenders.forEach(item => {
    if (item.date) {
      item.publishDate = convertDate(item.date);
      delete item.date; // Rename field
    }
  });
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log('Migration complete!');
