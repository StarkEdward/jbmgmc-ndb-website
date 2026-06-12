const fs = require('fs');
const dbPath = 'e:/New folder/b_a4NfVLTCLIh-1773847072793/data/db.json';
const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const members = [
  ["Dr. Dipti Nimje", "Asst. Prof. Anatomy", "Chairman", "9096684542"],
  ["Dr. Amol Kinge", "Asst. Prof. Community Medicine & Administrative Officer", "Member", "9766547110"],
  ["Dr. Rupal Girase", "Asst. Prof. Community Medicine", "Member", "9421616381"],
  ["Mrs. Rajali Gaikwad", "-", "Member", "9673263729"],
  ["Advocate", "Legal Representative", "Member", "-"],
  ["NGO Representative", "Non-Governmental Organization", "Member", "-"],
];

const tbodyHTML = members.map((row, index) => {
  const [name, designation, role, phone] = row;
  const isAlt = index % 2 === 0;
  return `
    <tr class="${isAlt ? 'bg-transparent' : 'bg-slate-50/30 dark:bg-slate-800/10'} hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">
      <td class="py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
        ${name}
      </td>
      <td class="py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed min-w-[200px]">
        ${designation}
      </td>
      <td class="py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
        ${phone !== '-' ? `<a href="tel:${phone}" class="hover:text-primary transition-colors">${phone}</a>` : '-'}
      </td>
      <td class="py-3 sm:py-4 px-4 sm:px-6">
        <span class="inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap ${role === 'Chairman' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20' : 'bg-primary/10 text-primary border border-primary/20'}">
          ${role}
        </span>
      </td>
    </tr>
  `;
}).join('');

const fullHTML = `
<div class="max-w-5xl mx-auto mb-4 sm:mb-8 md:mb-12">
  
  <div class="text-center mb-6 sm:mb-10">
    <div class="inline-flex items-center justify-center space-x-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-3 sm:mb-4">
      <span class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-indigo-500 animate-pulse"></span>
      <span>Committees</span>
    </div>
    <h1 class="text-3xl sm:text-4xl md:text-5xl font-black text-foreground mb-3 sm:mb-4">Gender Harassment (Vishakha) Committee</h1>
    <p class="text-sm sm:text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
      In accordance with the Vishakha Guidelines, this committee is dedicated to providing a safe, secure, and harassment-free working and learning environment for all women at the institute.
    </p>
  </div>

  <div class="bg-slate-50/50 dark:bg-slate-800/20 rounded-2xl sm:rounded-[2rem] border border-slate-100 dark:border-slate-800/60 overflow-hidden shadow-sm">
    <div class="bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-transparent border-b border-slate-100 dark:border-slate-800/60 p-4 sm:p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-3 sm:gap-4">
        <div class="p-3 sm:p-4 bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 text-indigo-500 shrink-0">
          <svg class="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
        </div>
        <div>
          <h2 class="text-lg sm:text-xl md:text-2xl font-bold text-foreground">Committee Members</h2>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1">Official Vishakha Committee for the current academic year.</p>
        </div>
      </div>
    </div>
    
    <div class="overflow-x-auto w-full pb-1">
      <table class="w-full text-left border-collapse min-w-[600px] sm:min-w-[800px]">
        <thead>
          <tr class="bg-slate-100/50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-700/50">
            <th class="py-3 sm:py-4 px-4 sm:px-6 text-[10px] sm:text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest whitespace-nowrap">Name</th>
            <th class="py-3 sm:py-4 px-4 sm:px-6 text-[10px] sm:text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Designation</th>
            <th class="py-3 sm:py-4 px-4 sm:px-6 text-[10px] sm:text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Mobile Number</th>
            <th class="py-3 sm:py-4 px-4 sm:px-6 text-[10px] sm:text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Role</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800/40">
          ${tbodyHTML}
        </tbody>
      </table>
    </div>
  </div>
  
  <div class="mt-6 sm:mt-8 bg-indigo-500/10 border border-indigo-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
    <svg class="w-6 h-6 sm:w-8 sm:h-8 text-indigo-500 shrink-0 sm:mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
    <div>
      <h3 class="text-base sm:text-lg font-bold text-indigo-700 dark:text-indigo-400">About the Vishakha Guidelines</h3>
      <p class="text-slate-700 dark:text-slate-300 mt-1 sm:mt-2 text-xs sm:text-sm leading-relaxed">
        The Vishakha Guidelines were promulgated by the Indian Supreme Court in 1997 and later superseded by the Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013. The committee is empowered to address complaints, conduct inquiries, and take disciplinary actions to uphold the dignity and rights of women on campus.
      </p>
    </div>
  </div>

</div>
`;

let pageIndex = data.dynamicPages.findIndex(p => p.slug === 'committees/gender-harassment');

if (pageIndex !== -1) {
  data.dynamicPages[pageIndex].content = fullHTML.trim();
  console.log('Updated existing Gender Harassment page');
} else {
  data.dynamicPages.push({
    slug: 'committees/gender-harassment',
    title: 'Gender Harassment (Vishakha) Committee',
    content: fullHTML.trim()
  });
  console.log('Created new Gender Harassment page');
}

fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
