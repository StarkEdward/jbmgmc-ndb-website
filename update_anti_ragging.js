const fs = require('fs');
const dbPath = 'e:/New folder/b_a4NfVLTCLIh-1773847072793/data/db.json';
const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const members = [
  ["Dr. Sanjay Rathod", "Dean GMC Nandurbar", "Member"],
  ["Dr. Tushar Patil", "Professor & Head Surgery", "Member Secretary"],
  ["Dr. Nilesh Tumram", "Professor, Forensic Medicine & Toxicology", "Member"],
  ["Dr. Rajesh Subhedar", "Professor Anesthesia", "Member"],
  ["Dr. Sachin Patharkar", "Professor Biochemistry", "Member"],
  ["Dr. Sandeep Gundre", "Professor Physiology", "Member"],
  ["Dr. Santosh Pawar", "Asso. Professor, Pathology", "Member"],
  ["Dr. Satish Wadde", "Asso. Professor, PSM", "Member"],
  ["Dr. Pravin Thakre", "Asso Professor Deptt. of OBGY", "Member"],
  ["Medical Superintendent", "Civil Hospital", "Member"],
  ["Mrs. Minal Karnwal", "Ass. Collector/SDO Nandurbar", "Member"],
  ["Shri. Sandip Pratap Gavit", "Collector Office, Representative", "Member"],
  ["Shri. Hemant Mohite (PSI)", "Superintendent of Police Representative", "Member"],
  ["Smt. Nayana Vilash Devare", "Police Department Representative", "Member"],
  ["Dr. Kantilal Tatiya (NGO)", "Representative", "Member"],
  ["Mr. Atharv Pawar", "Student Representative (Boy)", "Member"],
  ["Miss. Prerna Chandak", "Student Representative (Girls)", "Member"],
];

const tbodyHTML = members.map((row, index) => {
  const [name, designation, role] = row;
  const isAlt = index % 2 === 0;
  return `
    <tr class="${isAlt ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/30 dark:bg-slate-800/20'} hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">
      <td class="py-4 px-6 text-sm font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
        ${name}
      </td>
      <td class="py-4 px-6 text-sm text-slate-600 dark:text-slate-400">
        ${designation}
      </td>
      <td class="py-4 px-6">
        <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${role === 'Member Secretary' ? 'bg-accent/10 text-accent border border-accent/20' : 'bg-primary/10 text-primary border border-primary/20'}">
          ${role}
        </span>
      </td>
    </tr>
  `;
}).join('');

const fullHTML = `
<div class="max-w-5xl mx-auto mb-16">
  
  <div class="text-center mb-10">
    <div class="inline-flex items-center justify-center space-x-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest mb-4">
      <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
      <span>Administration</span>
    </div>
    <h1 class="text-4xl md:text-5xl font-black text-foreground mb-4">Anti Ragging Committee</h1>
    <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
      Government Medical College Nandurbar has a zero-tolerance policy towards ragging. Our dedicated committee ensures a safe, secure, and welcoming environment for all students.
    </p>
  </div>

  <div class="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
    <div class="bg-gradient-to-r from-primary/5 via-accent/5 to-transparent border-b border-slate-100 dark:border-slate-800 p-6 md:p-8 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 text-primary">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-foreground">Committee Members</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Official board for the current academic year.</p>
        </div>
      </div>
    </div>
    
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse min-w-[700px]">
        <thead>
          <tr class="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
            <th class="py-4 px-6 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest whitespace-nowrap">Name</th>
            <th class="py-4 px-6 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Designation / Affiliation</th>
            <th class="py-4 px-6 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Role</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
          ${tbodyHTML}
        </tbody>
      </table>
    </div>
  </div>
  
  <div class="mt-8 bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex items-start gap-4">
    <svg class="w-8 h-8 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
    <div>
      <h3 class="text-lg font-bold text-red-600 dark:text-red-400">Ragging is a Criminal Offence</h3>
      <p class="text-slate-700 dark:text-slate-300 mt-2 text-sm leading-relaxed">
        As per the directions of the Hon'ble Supreme Court of India, UGC and NMC regulations, any student found guilty of ragging will be severely punished. Punishments may include suspension from the college, cancellation of admission, and lodging of an FIR with the local police.
      </p>
    </div>
  </div>

</div>
`;

let updated = false;
for (let i = 0; i < data.dynamicPages.length; i++) {
  if (data.dynamicPages[i].slug === 'administration/anti-ragging') {
    data.dynamicPages[i].content = fullHTML.trim();
    updated = true;
    break;
  }
}

if (updated) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  console.log('Successfully updated Anti Ragging Committee page!');
} else {
  console.log('Could not find slug administration/anti-ragging');
}
