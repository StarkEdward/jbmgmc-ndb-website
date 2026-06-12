const fs = require('fs');
const https = require('https');
const cheerio = require('cheerio');
const path = require('path');

const targets = [
  { slug: 'about/citizen-charter', url: 'https://gmcnandurbar.com/citizen-charter/', title: 'Citizen Charter' },
  { slug: 'administration/rti', url: 'https://gmcnandurbar.com/rti/', title: 'Right to Information (RTI)' },
  { slug: 'administration/rts', url: 'https://gmcnandurbar.com/maharashtra-right-to-public-services-act-2015/', title: 'Right to Public Services (RTS)' },
  { slug: 'administration/internal-complaint', url: 'https://gmcnandurbar.com/internal-complaint-committee/', title: 'Internal Complaint Committee' },
  { slug: 'administration/college-council', url: 'https://gmcnandurbar.com/college-council/', title: 'College Council' },
  { slug: 'administration/local-managing', url: 'https://gmcnandurbar.com/local-managing-committee/', title: 'Local Managing Committee' },
  { slug: 'student/information', url: 'https://gmcnandurbar.com/student-information/', title: 'Student Information' },
  { slug: 'student/affiliation', url: 'https://gmcnandurbar.com/wp-content/uploads/2025/07/AffiliatingUniversity.jpg', title: 'Affiliation Certificate', isImage: true },
  { slug: 'student/academic-calendar', url: 'https://gmcnandurbar.com/academic-calendar/', title: 'Academic Calendar' },
  { slug: 'hospital/clinical-material', url: 'https://gmcnandurbar.com/clinical-material/', title: 'Clinical Material' },
  { slug: 'tender', url: 'https://gmcnandurbar.com/tender/', title: 'Tenders & Notices' }
];

const fetchUrl = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return resolve({ success: false, status: res.statusCode });
      }
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ success: true, data }));
    }).on('error', (e) => resolve({ success: false, error: e.message }));
  });
};

const generatePendingHTML = (title) => `
<div class="max-w-4xl mx-auto py-12 px-4">
  <div class="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 overflow-hidden shadow-xl shadow-slate-200/20 dark:shadow-none text-center p-12">
    <div class="w-20 h-20 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
      <svg class="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
    </div>
    <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3">${title}</h2>
    <p class="text-slate-500 dark:text-slate-400 max-w-md mx-auto">This information is currently being updated by the administration. Please check back later for the latest ${title.toLowerCase()} details.</p>
    <button class="mt-8 px-6 py-2.5 bg-primary/10 text-primary hover:bg-primary hover:text-white font-semibold rounded-xl transition-colors">Return to Home</button>
  </div>
</div>
`;

const generateImageHTML = (title, url) => `
<div class="max-w-5xl mx-auto mb-12">
  <div class="bg-gradient-to-br from-primary/5 to-transparent border-l-4 border-primary p-6 mb-8 rounded-r-2xl shadow-sm">
    <h3 class="text-xl font-bold text-slate-800 dark:text-slate-200">${title}</h3>
    <p class="text-slate-600 dark:text-slate-400 mt-2">Official document provided by the institution.</p>
  </div>
  <div class="bg-white dark:bg-slate-900 p-4 rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 shadow-xl overflow-hidden">
    <img src="${url}" alt="${title}" class="w-full h-auto rounded-xl border border-slate-100 dark:border-slate-800" />
    <div class="p-6 text-center">
      <a href="${url}" target="_blank" download class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-md hover:shadow-lg">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
        Download Full Image
      </a>
    </div>
  </div>
</div>
`;

const buildContentHTML = (title, contentHTML) => `
<div class="max-w-5xl mx-auto mb-12">
  <div class="bg-gradient-to-br from-primary/5 to-transparent border-l-4 border-primary p-6 mb-8 rounded-r-2xl shadow-sm">
    <h3 class="text-2xl font-bold text-slate-800 dark:text-slate-200">${title}</h3>
    <p class="text-slate-600 dark:text-slate-400 mt-2">Official administrative information.</p>
  </div>
  <div class="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 shadow-xl prose prose-slate dark:prose-invert max-w-none prose-headings:text-primary prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-2xl">
    ${contentHTML}
  </div>
</div>
`;

async function main() {
  const dbPath = path.join(__dirname, 'data', 'db.json');
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

  for (const target of targets) {
    console.log(`Processing: ${target.slug}`);
    
    // Check if the page exists in db.json first
    const pageIndex = data.dynamicPages.findIndex(p => p.slug === target.slug);
    if (pageIndex === -1) {
      console.log(`Skipping ${target.slug} (not found in local db.json)`);
      continue;
    }

    let finalHTML = '';

    if (target.isImage) {
      finalHTML = generateImageHTML(target.title, target.url);
    } else {
      console.log(`Fetching ${target.url}...`);
      const response = await fetchUrl(target.url);
      
      if (response.success && response.data) {
        const $ = cheerio.load(response.data);
        const entryContent = $('.entry-content').html() || $('main').html() || '';
        
        if (entryContent && entryContent.trim().length > 100) {
          // Clean up the html
          let cleanHtml = entryContent
            .replace(/style="[^"]*"/g, '') // remove inline styles
            .replace(/class="[^"]*"/g, ''); // remove classes
            
          finalHTML = buildContentHTML(target.title, cleanHtml);
          console.log(`Successfully scraped content for ${target.title}`);
        } else {
          console.log(`Page found but content too short/empty for ${target.title}`);
          finalHTML = generatePendingHTML(target.title);
        }
      } else {
        console.log(`Failed to fetch ${target.url} (Status: ${response.status})`);
        finalHTML = generatePendingHTML(target.title);
      }
    }

    // UPDATE DB
    data.dynamicPages[pageIndex].content = finalHTML.trim();
  }

  // Save changes
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  console.log('Migration complete. Only the 11 targeted pages were modified.');
}

main().catch(console.error);
