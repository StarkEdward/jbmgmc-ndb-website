const fs = require('fs');
const dbPath = 'e:/New folder/b_a4NfVLTCLIh-1773847072793/data/db.json';
const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const deanHTML = `
<div class="relative max-w-6xl mx-auto mt-10 mb-20">
  <!-- Decorative background elements -->
  <div class="absolute -inset-4 bg-gradient-to-tr from-primary/10 via-accent/5 to-transparent rounded-[3rem] transform -skew-y-2 -z-10"></div>
  
  <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-primary/10 border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col lg:flex-row relative">
    
    <!-- Image Column -->
    <div class="lg:w-[45%] relative min-h-[450px] lg:min-h-[650px] bg-slate-100 dark:bg-slate-800">
      <img 
        src="https://gmcnandurbar.com/wp-content/uploads/2025/06/DeanSRathod-1.jpg" 
        alt="Dr. Sanjay Mansing Rathod" 
        class="absolute inset-0 w-full h-full object-cover object-top"
      />
      <!-- Gradient overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-slate-900/20"></div>
      
      <!-- Floating Badge on Image -->
      <div class="absolute bottom-8 left-8 lg:bottom-12 lg:left-12 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-8 py-5 rounded-3xl shadow-xl border border-white/20">
        <p class="text-sm font-black text-primary uppercase tracking-[0.2em] mb-1">Dean</p>
        <p class="text-xl font-bold text-slate-800 dark:text-white m-0">GMC Nandurbar</p>
      </div>
    </div>
    
    <!-- Content Column -->
    <div class="lg:w-[55%] p-10 lg:p-16 flex flex-col justify-center relative">
      <!-- Watermark text -->
      <div class="absolute top-10 right-10 text-[8rem] font-black text-slate-50 dark:text-slate-800/30 -z-10 select-none leading-none">DEAN</div>

      <div class="inline-flex items-center space-x-3 bg-primary/10 text-primary px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-[0.2em] mb-8 w-max">
        <span class="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
        <span>Head of the Institute</span>
      </div>
      
      <h2 class="text-4xl lg:text-5xl font-black mb-5 text-slate-900 dark:text-white leading-tight">
        Dr. Sanjay Mansing Rathod
      </h2>
      <p class="text-xl lg:text-2xl text-slate-500 dark:text-slate-400 font-medium mb-12 pb-10 border-b border-slate-100 dark:border-slate-800/60 leading-relaxed">
        Leading with excellence in medical education and healthcare services.
      </p>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <!-- Contact Card 1 -->
        <div class="flex items-center p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
          <div class="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm text-primary group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
          </div>
          <div class="ml-5">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Email Address</p>
            <p class="text-slate-800 dark:text-slate-200 font-bold text-sm m-0">dean@gmcnandurbar.com</p>
          </div>
        </div>

        <!-- Contact Card 2 -->
        <div class="flex items-center p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
          <div class="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm text-accent group-hover:bg-accent group-hover:text-white transition-colors shrink-0">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
          </div>
          <div class="ml-5">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Office Contact</p>
            <p class="text-slate-800 dark:text-slate-200 font-bold text-base m-0">02564-210444</p>
          </div>
        </div>
      </div>
      
      <!-- Quote Block -->
      <div class="relative bg-gradient-to-br from-primary/10 to-transparent p-8 lg:p-10 rounded-3xl border-l-4 border-primary">
        <svg class="absolute top-6 left-6 w-12 h-12 text-primary/20" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true"><path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"></path></svg>
        <p class="text-lg lg:text-xl text-slate-800 dark:text-slate-200 font-semibold italic relative z-10 leading-relaxed m-0 pl-14">
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
  console.log('Successfully updated Head of the Institute page with V2 design!');
} else {
  console.log('Could not find slug library/head-of-the-institute');
}
