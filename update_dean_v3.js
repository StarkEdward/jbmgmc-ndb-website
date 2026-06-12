const fs = require('fs');
const dbPath = 'e:/New folder/b_a4NfVLTCLIh-1773847072793/data/db.json';
const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const deanHTML = `
<div class="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-[2rem] shadow-lg border border-slate-100 dark:border-slate-800 p-8 sm:p-12 text-center my-8">
  
  <!-- Image Frame with Animation -->
  <div class="relative w-56 h-56 mx-auto mb-10 group cursor-pointer">
    <!-- Animated background layers -->
    <div class="absolute inset-0 bg-gradient-to-tr from-primary to-accent rounded-full transform rotate-6 group-hover:rotate-12 transition-transform duration-700 opacity-20"></div>
    <div class="absolute inset-0 bg-gradient-to-tr from-accent to-primary rounded-full transform -rotate-6 group-hover:-rotate-12 transition-transform duration-700 opacity-20"></div>
    
    <!-- Image container -->
    <div class="relative w-full h-full rounded-full overflow-hidden border-8 border-white dark:border-slate-900 shadow-xl transform group-hover:scale-105 transition-transform duration-500 z-10">
      <img 
        src="https://gmcnandurbar.com/wp-content/uploads/2025/06/DeanSRathod-1.jpg" 
        alt="Dr. Sanjay Mansing Rathod" 
        class="w-full h-full object-cover object-top"
      />
    </div>
  </div>

  <!-- Name & Designation -->
  <div class="inline-flex items-center space-x-2 bg-primary/10 text-primary px-5 py-2 rounded-full font-bold text-xs uppercase tracking-[0.2em] mb-6">
    <span class="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
    <span>Head of the Institute</span>
  </div>
  
  <h2 class="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-3">
    Dr. Sanjay Mansing Rathod
  </h2>
  <p class="text-lg text-slate-500 dark:text-slate-400 font-medium mb-12">
    Dean, Government Medical College, Nandurbar
  </p>

  <!-- Contact Stack -->
  <div class="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 mb-12 border-y border-slate-100 dark:border-slate-800 py-8">
    
    <div class="flex flex-col items-center group">
      <div class="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
      </div>
      <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Email</p>
      <p class="text-slate-800 dark:text-slate-200 font-bold m-0">dean@gmcnandurbar.com</p>
    </div>
    
    <div class="hidden sm:block w-px h-20 bg-slate-200 dark:bg-slate-800"></div>

    <div class="flex flex-col items-center group">
      <div class="w-14 h-14 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-3 group-hover:bg-accent group-hover:text-white group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
      </div>
      <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Office Contact</p>
      <p class="text-slate-800 dark:text-slate-200 font-bold m-0">02564-210444</p>
    </div>

  </div>

  <!-- Quote -->
  <div class="relative bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[1.5rem] border border-slate-100 dark:border-slate-800">
    <div class="absolute -top-5 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-900 px-4">
      <svg class="w-10 h-10 text-primary/40" fill="currentColor" viewBox="0 0 32 32"><path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"></path></svg>
    </div>
    <p class="text-lg text-slate-600 dark:text-slate-300 font-medium italic m-0 pt-4 relative z-10 leading-relaxed">
      "Our mission is to foster an environment of medical excellence, where every student is empowered with the latest knowledge, ethical values, and clinical skills required to serve the community."
    </p>
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
  console.log('Successfully updated Head of the Institute page with Vertical V3 design!');
} else {
  console.log('Could not find slug library/head-of-the-institute');
}
