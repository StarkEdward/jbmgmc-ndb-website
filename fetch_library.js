const fs = require('fs');

const dbPath = 'e:/New folder/b_a4NfVLTCLIh-1773847072793/data/db.json';
const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const pagesToScrape = [
  { slug: 'library-introduction', title: 'Library Introduction', url: 'https://gmcnandurbar.com/library-introduction/' },
  { slug: 'head-of-the-institute', title: 'Head of the Institute', url: 'https://gmcnandurbar.com/head-of-the-institute/' },
  { slug: 'library-staff-members', title: 'Library Staff Members', url: 'https://gmcnandurbar.com/library-staff-members/' },
  { slug: 'library-committee-members', title: 'Library Committee Members', url: 'https://gmcnandurbar.com/library-committee-members/' },
  { slug: 'library-books', title: 'Library Books', url: 'https://gmcnandurbar.com/library-books/' },
  { slug: 'journals', title: 'Journals', url: 'https://gmcnandurbar.com/journals/' },
  { slug: 'newspaper', title: 'Newspaper', url: 'https://gmcnandurbar.com/newspaper/' },
  { slug: 'e-library', title: 'E-Library', url: 'https://gmcnandurbar.com/e-library/' },
  { slug: 'library-timing', title: 'Library Timing', url: 'https://gmcnandurbar.com/library-timing/' },
  { slug: 'central-library-rules', title: 'Central Library Rules', url: 'https://gmcnandurbar.com/central-library-rules/' },
  { slug: 'question-papers', title: 'Question Papers', url: 'https://gmcnandurbar.com/question-papers/' },
  { slug: 'central-library-contact-us', title: 'Contact Us', url: 'https://gmcnandurbar.com/central-library-contact-us/' }
];

async function scrapeLibrary() {
  console.log('Starting scrape of library pages...');
  
  if (!data.dynamicPages) data.dynamicPages = [];
  
  for (const page of pagesToScrape) {
    try {
      console.log(`Fetching ${page.url}...`);
      const res = await fetch(page.url);
      const html = await res.text();
      
      // Extract content between <main> and </main>
      const match = html.match(/<main>([\s\S]*?)<\/main>/);
      let content = match ? match[1] : '';
      
      if (!content) {
          // fallback if main tag isn't there
          const fallbackMatch = html.match(/<div class="entry-content[^"]*">([\s\S]*?)<\/div>\s*<\/article>/);
          content = fallbackMatch ? fallbackMatch[1] : '<p>Content could not be extracted.</p>';
      }

      // Cleanup some wrapper divs if present so we just get the inner payload
      content = content.replace(/<div class="container-fluid department-wrapper">/g, '');
      content = content.replace(/<div class="container">/g, '');
      // Remove closing divs for those wrappers by just trusting the DOM renderer, 
      // or we can leave them. It's safe to leave the inner structure as is.
      // Actually let's just use the raw extracted HTML directly!
      
      // Fix relative image links to absolute if needed
      content = content.replace(/src="(\/wp-content\/.*?)"/g, 'src="https://gmcnandurbar.com$1"');

      // Add to dynamicPages
      const fullSlug = `library/${page.slug}`;
      const existingIdx = data.dynamicPages.findIndex(dp => dp.slug === fullSlug);
      
      const newPage = {
        slug: fullSlug,
        title: page.title,
        content: content.trim()
      };

      if (existingIdx >= 0) {
        data.dynamicPages[existingIdx] = newPage;
      } else {
        data.dynamicPages.push(newPage);
      }
      
      console.log(`Successfully extracted content for ${page.title}`);
    } catch (err) {
      console.error(`Error scraping ${page.title}:`, err.message);
    }
  }

  // Update navigation items
  let libraryMenu = data.navItems.find(n => n.id === '5'); // the id for library menu
  if (!libraryMenu) {
      libraryMenu = data.navItems.find(n => n.label === 'Central Library');
  }

  if (libraryMenu && libraryMenu.submenus) {
    // Update hrefs to point to the new dynamic routes instead of anchors
    libraryMenu.submenus.forEach(sub => {
      const match = pagesToScrape.find(p => sub.href.endsWith('#' + p.slug.split('-').pop()) || sub.href.includes(p.slug.split('-').pop()) || sub.label.includes(p.title) || sub.label === p.title);
      if (match) {
        sub.href = `/library/${match.slug}`;
      }
      // manually fix the known ones
      if (sub.label === 'Library Introduction') sub.href = '/library/library-introduction';
      if (sub.label === 'Head of the Institute') sub.href = '/library/head-of-the-institute';
      if (sub.label === 'Library Staff Members') sub.href = '/library/library-staff-members';
      if (sub.label === 'Library Committee Members') sub.href = '/library/library-committee-members';
      if (sub.label === 'Library Books') sub.href = '/library/library-books';
      if (sub.label === 'Journals') sub.href = '/library/journals';
      if (sub.label === 'Newspaper') sub.href = '/library/newspaper';
      if (sub.label === 'E-Library') sub.href = '/library/e-library';
      if (sub.label === 'Library Timing') sub.href = '/library/library-timing';
      if (sub.label === 'Central Library Rules') sub.href = '/library/central-library-rules';
      if (sub.label === 'Question Papers') sub.href = '/library/question-papers';
      if (sub.label === 'Contact Us') sub.href = '/library/central-library-contact-us';
    });
  }

  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  console.log('Finished saving all library pages and updating navigation!');
}

scrapeLibrary();
