const fs = require('fs');
const https = require('https');
const cheerio = require('cheerio');
const path = require('path');

const downloadFile = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
};

async function main() {
  const html = fs.readFileSync('C:/Users/Sagar/.gemini/antigravity/brain/dd18150f-4d54-496e-a10c-d160f9f6d639/.system_generated/steps/2022/content.md', 'utf8');
  const $ = cheerio.load(html);

  const downloadDir = path.join(__dirname, 'public', 'downloads', 'nursing');
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
  }

  const items = [];
  // Extract from the first table
  let tableFound = false;
  $('table').first().find('tr').each((i, row) => {
    if (i === 0) return; // Skip header
    const title = $(row).find('td').eq(0).text().trim();
    const linkEl = $(row).find('td').eq(1).find('a');
    let href = linkEl.attr('href');
    if (title && href) {
        items.push({ title, href });
    }
  });

  console.log(`Found ${items.length} items to download.`);

  let tableRowsHTML = '';
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const filename = path.basename(item.href);
    // some annexures might have the same filename if not careful, but they are ANNEXURE-1.pdf etc.
    const localPath = path.join(downloadDir, filename);
    const localUrl = `/downloads/nursing/${filename}`;
    
    console.log(`Downloading ${filename}...`);
    try {
        await downloadFile(item.href, localPath);
        console.log(`Saved ${filename}`);
    } catch (e) {
        console.error(`Failed to download ${filename}:`, e);
    }
    
    const isAlt = i % 2 === 0;
    tableRowsHTML += `
      <tr class="${isAlt ? 'bg-transparent' : 'bg-slate-50/30 dark:bg-slate-800/10'} hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors border-b border-slate-100 dark:border-slate-800/40 last:border-0">
        <td class="py-4 px-6">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-lg shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
            </div>
            <span class="font-semibold text-slate-800 dark:text-slate-200">${item.title}</span>
          </div>
        </td>
        <td class="py-4 px-6 text-right">
          <a href="${localUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white font-medium rounded-xl transition-all duration-300 text-sm shadow-sm hover:shadow-md">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Download PDF
          </a>
        </td>
      </tr>
    `;
  }

  const finalHTML = `
<div class="max-w-4xl mx-auto mb-8 md:mb-12">
  <div class="bg-gradient-to-br from-rose-500/5 to-orange-500/5 border-l-4 border-rose-500 p-5 mb-8 rounded-r-2xl shadow-sm">
    <div class="flex items-start gap-4">
      <div class="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-rose-500 shrink-0 mt-1">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
      </div>
      <div>
        <h3 class="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">Government College of Nursing, Nandurbar</h3>
        <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          The following mandatory disclosures and annexures are provided in compliance with the Maharashtra University of Health Sciences (MUHS) mandate for the academic year.
        </p>
      </div>
    </div>
  </div>

  <div class="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 overflow-hidden shadow-xl shadow-slate-200/20 dark:shadow-none">
    <div class="bg-gradient-to-r from-slate-50 dark:from-slate-800/50 to-transparent border-b border-slate-100 dark:border-slate-800/60 p-6 md:p-8 flex items-center justify-between">
      <div>
        <h2 class="text-xl md:text-2xl font-bold text-foreground">MUHS Mandate Annexures</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Download official PDF documents</p>
      </div>
      <div class="hidden sm:flex items-center gap-2 text-xs font-semibold px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        Updated Successfully
      </div>
    </div>
    
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse min-w-[500px]">
        <thead>
          <tr class="bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-700/50">
            <th class="py-4 px-6 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest w-2/3">Document Title</th>
            <th class="py-4 px-6 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          ${tableRowsHTML}
        </tbody>
      </table>
    </div>
  </div>
</div>
  `;

  const dbPath = path.join(__dirname, 'data', 'db.json');
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  
  // Find either nursing/muhs-mandate or muhs-mandate
  let pageIndex = data.dynamicPages.findIndex(p => p.slug === 'nursing/muhs-mandate');
  if (pageIndex === -1) {
    pageIndex = data.dynamicPages.findIndex(p => p.slug === 'muhs-mandate');
    if (pageIndex !== -1) {
      // Fix the slug so it matches the header routing
      data.dynamicPages[pageIndex].slug = 'nursing/muhs-mandate';
    }
  }

  if (pageIndex !== -1) {
    data.dynamicPages[pageIndex].content = finalHTML.trim();
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
    console.log('Database updated successfully with new MUHS mandate content!');
  } else {
    // If it doesn't exist, create it
    data.dynamicPages.push({
      slug: 'nursing/muhs-mandate',
      title: 'MUHS Mandate - Nursing',
      content: finalHTML.trim()
    });
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
    console.log('Created and populated nursing/muhs-mandate page!');
  }
}

main().catch(console.error);
