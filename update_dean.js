const fs = require('fs');
const dbPath = 'e:/New folder/b_a4NfVLTCLIh-1773847072793/data/db.json';
const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const deanHTML = `
<div class="max-w-4xl mx-auto">
  <div class="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col md:flex-row">
    <div class="md:w-2/5 relative h-80 md:h-auto bg-slate-100 dark:bg-slate-800">
      <img 
        src="https://gmcnandurbar.com/wp-content/uploads/2025/06/DeanSRathod-1.jpg" 
        alt="Dr. Sanjay Mansing Rathod" 
        class="absolute inset-0 w-full h-full object-cover object-top"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden"></div>
    </div>
    
    <div class="md:w-3/5 p-8 md:p-10 flex flex-col justify-center">
      <div class="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-sm uppercase tracking-widest mb-4 w-max">
        Head of the Institute
      </div>
      
      <h2 class="text-3xl font-extrabold text-foreground mb-2">Dr. Sanjay Mansing Rathod</h2>
      <p class="text-xl text-slate-500 dark:text-slate-400 font-medium mb-8">Dean, Government Medical College, Nandurbar</p>
      
      <div class="space-y-4 mb-8">
        <div class="flex items-start">
          <svg class="w-6 h-6 text-primary mr-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
          <div>
            <p class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Email</p>
            <p class="text-slate-700 dark:text-slate-200 font-medium">dean@gmcnandurbar.com</p>
          </div>
        </div>
        <div class="flex items-start">
          <svg class="w-6 h-6 text-primary mr-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
          <div>
            <p class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Office Contact</p>
            <p class="text-slate-700 dark:text-slate-200 font-medium">02564-210444</p>
          </div>
        </div>
      </div>
      
      <div class="border-t border-slate-100 dark:border-slate-800 pt-6 mt-auto">
        <p class="text-slate-600 dark:text-slate-400 italic leading-relaxed">
          "Our mission is to foster an environment of medical excellence, where every student is empowered with the latest knowledge, ethical values, and clinical skills required to serve the community."
        </p>
      </div>
    </div>
  </div>
</div>
`;

let updated = false;
for (let i = 0; i < data.dynamicPages.length; i++) {
  if (data.dynamicPages[i].slug === 'library/head-of-the-institute') {
    data.dynamicPages[i].content = deanHTML.trim();
    updated = true;
    break;
  }
}

if (updated) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  console.log('Successfully updated Head of the Institute page!');
} else {
  console.log('Could not find slug library/head-of-the-institute');
}
