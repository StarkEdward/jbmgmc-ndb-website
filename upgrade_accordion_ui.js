const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

async function main() {
  const dbPath = path.join(__dirname, 'data', 'db.json');
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  
  let pageIndex = data.dynamicPages.findIndex(p => p.slug === 'nursing/muhs-mandate');
  if (pageIndex === -1) {
    console.log('Error: Could not find nursing/muhs-mandate in db.json!');
    return;
  }

  let content = data.dynamicPages[pageIndex].content;
  const $ = cheerio.load(content, null, false);

  // We are going to replace the tables inside the <details> tags with a beautiful 2-column grid.
  $('details').each((i, detailsEl) => {
    // Extract the items from the table
    const items = [];
    $(detailsEl).find('table tbody tr').each((j, row) => {
      const title = $(row).find('td').eq(0).text().trim();
      const href = $(row).find('td').eq(1).find('a').attr('href');
      if (title && href) {
        items.push({ title, href });
      }
    });

    if (items.length === 0) return;

    // Generate new grid HTML
    let gridHTML = '<div class="grid grid-cols-1 lg:grid-cols-2 gap-3 p-4 md:p-6 bg-slate-50/30 dark:bg-slate-900/30 rounded-b-[2rem] border-t border-slate-100 dark:border-slate-800/60">';
    
    items.forEach(item => {
      // Simplify the title if it's super long, but usually it's "Annexure 1"
      gridHTML += `
        <div class="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 bg-white dark:bg-slate-800 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30 dark:hover:border-primary/50 transition-all duration-300 group">
          <div class="flex items-center gap-3 overflow-hidden pr-2">
            <div class="p-2.5 bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
            </div>
            <span class="font-semibold text-sm md:text-base text-slate-700 dark:text-slate-200 truncate group-hover:text-primary transition-colors">${item.title}</span>
          </div>
          <a href="${item.href}" target="_blank" rel="noopener noreferrer" class="shrink-0 flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white font-bold rounded-xl transition-all duration-300 text-xs uppercase tracking-wider shadow-sm">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            PDF
          </a>
        </div>
      `;
    });

    gridHTML += '</div>';

    // Replace the div containing the table with the new grid
    $(detailsEl).find('div.overflow-x-auto').replaceWith(gridHTML);
    
    // Also upgrade the <summary> style to make it even more premium
    const summary = $(detailsEl).find('summary');
    summary.removeClass('bg-gradient-to-r from-slate-50 dark:from-slate-800/50 to-transparent');
    summary.addClass('bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50');
  });

  data.dynamicPages[pageIndex].content = $.html();
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  console.log('Database updated successfully with Premium Grid UI!');
}

main().catch(console.error);
