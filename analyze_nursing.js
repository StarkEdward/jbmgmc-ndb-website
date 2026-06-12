const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('C:/Users/Sagar/.gemini/antigravity/brain/dd18150f-4d54-496e-a10c-d160f9f6d639/.system_generated/steps/2022/content.md', 'utf8');
const $ = cheerio.load(html);

// Find the main content area. Usually it's in a main or article or .entry-content
const links = [];
$('a').each((i, el) => {
  const href = $(el).attr('href');
  if (href && href.endsWith('.pdf')) {
    links.push({ text: $(el).text().trim(), href });
  }
});

console.log('Found PDF links:');
console.log(links);

// Also let's see if there are specific tables
$('table').each((i, el) => {
    console.log('--- Table', i, '---');
    $(el).find('tr').each((j, row) => {
        const rowText = $(row).text().replace(/\s+/g, ' ').trim();
        console.log(rowText);
    });
});
