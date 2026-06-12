const fs = require('fs');
const path = require('path');

const members = [
  { name: 'Dr. Soniya Parchake', designation: 'Asso. Professor Anatomy', role: 'Chairman' },
  { name: 'Dr. Trupti Ramteke', designation: 'Asso. Professor, Biochemistry', role: 'Member' },
  { name: 'Dr. Rajratna Ramteke', designation: 'Asso Professor, Dept. of Physiology', role: 'Member' },
  { name: 'Dr. Harishchandra Gavit', designation: 'Asstt Professor, Medicine', role: 'Member' },
  { name: 'Dr. Bhavana Valavi', designation: 'Asstt Professor, Dentistry', role: 'Member Secretary' },
  { name: 'Dr. Savita Nallamadge', designation: 'Asstt Professor, Anesthesia', role: 'Member' },
  { name: 'Smt. Ujjawala Vasave', designation: 'Laboratory Technician', role: 'Member' },
  { name: 'Smt. Rajli Gaikwad', designation: 'Clerk', role: 'Member' },
  { name: 'Adv. Gavit', designation: 'Advocate District Court Nandurbar', role: 'Member' },
  { name: 'Mrs. Savita Vasave / Nirmala More', designation: 'Metron GMCH Nandurbar', role: 'Member' }
];

const generateTableHTML = () => {
  let rows = '';
  members.forEach((member, index) => {
    // Alternate row backgrounds for better readability
    const bgClass = index % 2 === 0 ? 'bg-white dark:bg-slate-900/50' : 'bg-slate-50/50 dark:bg-slate-800/20';
    
    // Highlight Chairman or Member Secretary
    let roleBadge = '';
    if (member.role === 'Chairman') {
      roleBadge = '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300 border border-rose-200 dark:border-rose-800">Chairman</span>';
    } else if (member.role === 'Member Secretary') {
      roleBadge = '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800">Member Secretary</span>';
    } else {
      roleBadge = '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">Member</span>';
    }

    rows += `
      <tr class="${bgClass} hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0">
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
              ${member.name.replace('Dr. ', '').replace('Smt. ', '').replace('Adv. ', '').replace('Mrs. ', '').charAt(0)}
            </div>
            ${member.name}
          </div>
        </td>
        <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
          ${member.designation}
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          ${roleBadge}
        </td>
      </tr>
    `;
  });

  return `
<div class="max-w-6xl mx-auto py-8">
  <div class="text-center mb-10">
    <p class="text-sm uppercase tracking-wider text-primary font-bold mb-2">Internal Committees</p>
    <h1 class="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Womens Grievance Redressal Committee</h1>
    <p class="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
      Dedicated to providing a safe, supportive, and harassment-free environment for all female students, faculty, and staff members at JBMGMC Nandurbar.
    </p>
  </div>

  <div class="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 shadow-xl shadow-slate-200/20 dark:shadow-none overflow-hidden mb-12">
    <div class="bg-gradient-to-r from-slate-50 dark:from-slate-800/50 to-transparent p-6 md:p-8 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
      <div>
        <h2 class="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Committee Members</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Current active members and their designations</p>
      </div>
      <div class="hidden sm:flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">
        10 Members
      </div>
    </div>
    
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700/50">
            <th class="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</th>
            <th class="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Designation</th>
            <th class="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
          ${rows}
        </tbody>
      </table>
    </div>
  </div>
</div>
  `.trim();
};

async function main() {
  const dbPath = path.join(__dirname, 'data', 'db.json');
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

  const slug = 'committees/womens-grievance';
  let pageIndex = data.dynamicPages.findIndex(p => p.slug === slug);
  
  if (pageIndex === -1) {
    console.log('Page not found in db.json. Creating new entry.');
    data.dynamicPages.push({ slug: slug, content: '' });
    pageIndex = data.dynamicPages.length - 1;
  }

  data.dynamicPages[pageIndex].content = generateTableHTML();

  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  console.log('Successfully updated Womens Grievance page with image data.');
}

main().catch(console.error);
