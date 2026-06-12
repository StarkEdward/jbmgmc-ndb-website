const fs = require('fs');
const dbPath = 'e:/New folder/b_a4NfVLTCLIh-1773847072793/data/db.json';
const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const deanHTML = `
<style>
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes spin-slow-reverse {
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
}
@keyframes gradient-x {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
.animate-float { animation: float 6s ease-in-out infinite; }
.animate-spin-slow { animation: spin-slow 12s linear infinite; }
.animate-spin-slow-reverse { animation: spin-slow-reverse 10s linear infinite; }
.animate-gradient-x { animation: gradient-x 10s ease infinite; background-size: 200% 200%; }
</style>

<div class="relative max-w-4xl mx-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-white/60 dark:border-slate-700/50 p-8 sm:p-14 text-center my-12 transition-all duration-700 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] hover:-translate-y-2 group/main">
  
  <!-- Image Frame with Continuous Lively Animation -->
  <div class="relative w-72 h-72 mx-auto mb-14 cursor-pointer group/avatar">
    <!-- Spinning Glowing Ring (Continuous) -->
    <div class="absolute -inset-6 bg-gradient-to-r from-primary via-accent to-primary rounded-full animate-spin-slow opacity-60 blur-2xl group-hover/avatar:opacity-100 group-hover/avatar:blur-3xl transition-all duration-700 pointer-events-none"></div>
    <div class="absolute -inset-3 bg-gradient-to-r from-accent via-primary to-accent rounded-full animate-spin-slow-reverse opacity-80 blur-md pointer-events-none"></div>
    
    <!-- Image container floating -->
    <div class="absolute inset-0 rounded-full overflow-hidden border-8 border-white dark:border-slate-800 shadow-2xl transform transition-transform duration-700 group-hover/avatar:scale-[1.15] z-10 animate-float bg-white">
      <img 
        src="https://gmcnandurbar.com/wp-content/uploads/2025/06/DeanSRathod-1.jpg" 
        alt="Dr. Sanjay Mansing Rathod" 
        class="w-full h-full object-cover object-top"
      />
    </div>
    
    <!-- Floating particles -->
    <div class="absolute -top-2 -right-4 w-8 h-8 bg-accent rounded-full animate-bounce z-20 shadow-lg shadow-accent/50 border-2 border-white dark:border-slate-800"></div>
    <div class="absolute bottom-2 -left-2 w-5 h-5 bg-primary rounded-full animate-pulse z-20 shadow-lg shadow-primary/50 border-2 border-white dark:border-slate-800"></div>
  </div>

  <!-- Name & Designation -->
  <div class="inline-flex items-center space-x-3 bg-gradient-to-r from-primary/10 to-accent/10 text-primary px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-[0.25em] mb-8 shadow-sm">
    <span class="relative flex h-3 w-3">
      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
      <span class="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
    </span>
    <span>Head of the Institute</span>
  </div>
  
  <!-- Gradient Name Text -->
  <h2 class="text-4xl sm:text-5xl font-black mb-5 text-transparent bg-clip-text bg-gradient-to-r from-primary via-slate-800 to-accent dark:from-primary dark:via-white dark:to-accent animate-gradient-x">
    Dr. Sanjay Mansing Rathod
  </h2>
  
  <p class="text-xl text-slate-500 dark:text-slate-400 font-semibold mb-14 tracking-wide">
    Dean, Government Medical College, Nandurbar
  </p>

  <!-- Contact Stack with Glassmorphism -->
  <div class="flex flex-col sm:flex-row justify-center gap-6 sm:gap-10 mb-14 relative z-10">
    
    <div class="relative flex-1 p-8 rounded-3xl bg-slate-50/70 dark:bg-slate-800/50 border border-white dark:border-slate-700 backdrop-blur-md shadow-sm hover:shadow-2xl hover:bg-white dark:hover:bg-slate-800 transition-all duration-500 group overflow-hidden">
      <!-- Hover gradient blob -->
      <div class="absolute -inset-10 bg-gradient-to-r from-primary/20 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
      
      <div class="relative z-10 flex flex-col items-center">
        <div class="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-primary/10 to-primary/5 text-primary flex items-center justify-center mb-5 group-hover:scale-125 group-hover:-translate-y-3 group-hover:rotate-12 transition-transform duration-500 shadow-inner">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
        </div>
        <p class="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Email Address</p>
        <p class="text-slate-800 dark:text-slate-100 font-black text-xl m-0">dean@gmcnandurbar.com</p>
      </div>
    </div>
    
    <div class="relative flex-1 p-8 rounded-3xl bg-slate-50/70 dark:bg-slate-800/50 border border-white dark:border-slate-700 backdrop-blur-md shadow-sm hover:shadow-2xl hover:bg-white dark:hover:bg-slate-800 transition-all duration-500 group overflow-hidden">
      <!-- Hover gradient blob -->
      <div class="absolute -inset-10 bg-gradient-to-r from-accent/20 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
      
      <div class="relative z-10 flex flex-col items-center">
        <div class="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-accent/10 to-accent/5 text-accent flex items-center justify-center mb-5 group-hover:scale-125 group-hover:-translate-y-3 group-hover:-rotate-12 transition-transform duration-500 shadow-inner">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
        </div>
        <p class="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Office Contact</p>
        <p class="text-slate-800 dark:text-slate-100 font-black text-2xl m-0">02564-210444</p>
      </div>
    </div>
  </div>

  <!-- Quote -->
  <div class="relative p-12 rounded-[2.5rem] bg-gradient-to-br from-primary/5 via-transparent to-accent/5 border border-primary/10 overflow-hidden group hover:border-primary/30 transition-colors duration-500 hover:shadow-inner">
    <!-- Animated Quote Background Blooms -->
    <div class="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 group-hover:scale-[2] group-hover:bg-primary/20 transition-all duration-1000 ease-in-out pointer-events-none"></div>
    <div class="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2 group-hover:scale-[2] group-hover:bg-accent/20 transition-all duration-1000 ease-in-out pointer-events-none"></div>
    
    <div class="absolute top-8 left-10">
      <svg class="w-20 h-20 text-primary/10 transform -rotate-12 group-hover:rotate-0 group-hover:scale-110 group-hover:text-primary/20 transition-all duration-500" fill="currentColor" viewBox="0 0 32 32"><path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"></path></svg>
    </div>
    
    <p class="text-2xl lg:text-3xl text-slate-700 dark:text-slate-200 font-extrabold italic m-0 pt-10 pb-4 relative z-10 leading-relaxed text-center tracking-wide group-hover:text-primary transition-colors duration-500">
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
  console.log('Successfully updated Head of the Institute page with Super Lively V4 design!');
} else {
  console.log('Could not find slug library/head-of-the-institute');
}
