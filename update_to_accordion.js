const fs = require('fs');
const path = require('path');

async function main() {
  const dbPath = path.join(__dirname, 'data', 'db.json');
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  
  let pageIndex = data.dynamicPages.findIndex(p => p.slug === 'nursing/muhs-mandate');
  if (pageIndex === -1) {
    console.log('Error: Could not find nursing/muhs-mandate in db.json!');
    return;
  }

  let content = data.dynamicPages[pageIndex].content;

  // We are going to replace the div wrappers for the sections with <details> and <summary> wrappers.
  // Original Wrapper:
  // <div class="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 overflow-hidden shadow-xl shadow-slate-200/20 dark:shadow-none mb-10">
  //   <div class="bg-gradient-to-r from-slate-50 dark:from-slate-800/50 to-transparent border-b border-slate-100 dark:border-slate-800/60 p-6 md:p-8 flex items-center justify-between">
  
  // To avoid complex regex parsing on the entire generated HTML, let's just write a script that does the replacement.
  
  // Let's use cheerio to parse the existing content and restructure it!
  const cheerio = require('cheerio');
  const $ = cheerio.load(content, null, false); // false to avoid adding html/head/body

  // The sections are the top level divs that have the class starting with bg-white
  const mainDivs = $('div.bg-white.rounded-\\[2rem\\]');

  mainDivs.each((i, el) => {
    const sectionTitleDiv = $(el).children().first();
    const tableContainer = $(el).children().eq(1);

    // Get the title text
    const titleText = sectionTitleDiv.find('h2').text().trim();
    const subtitleText = sectionTitleDiv.find('p').text().trim();

    // Default the first one to open
    const isOpen = i === 0 ? 'open' : '';

    const newHTML = `
  <details class="group bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 shadow-xl shadow-slate-200/20 dark:shadow-none mb-10 transition-all duration-300 open:pb-2" ${isOpen}>
    <summary class="list-none cursor-pointer bg-gradient-to-r from-slate-50 dark:from-slate-800/50 to-transparent p-6 md:p-8 flex items-center justify-between rounded-[2rem] group-open:rounded-b-none group-open:border-b border-slate-100 dark:border-slate-800/60 select-none hover:bg-slate-50/80 transition-colors">
      <div>
        <h2 class="text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">${titleText}</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">${subtitleText}</p>
      </div>
      <div class="flex items-center gap-4">
        <div class="hidden sm:flex items-center gap-2 text-xs font-semibold px-3 py-1 bg-primary/10 text-primary dark:text-primary rounded-full">
          16 Files
        </div>
        <div class="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
          <svg class="w-6 h-6 transition-transform duration-300 group-open:-rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>
    </summary>
    
    <div class="overflow-x-auto animate-in slide-in-from-top-4 fade-in duration-300">
      ${$.html(tableContainer)}
    </div>
  </details>
    `;

    $(el).replaceWith(newHTML);
  });

  data.dynamicPages[pageIndex].content = $.html();
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  console.log('Database updated successfully with details/summary Accordion!');
}

main().catch(console.error);
