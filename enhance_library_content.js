const fs = require('fs');

const dbPath = 'e:/New folder/b_a4NfVLTCLIh-1773847072793/data/db.json';
const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const contentMap = {
  'library/library-introduction': `
<div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
  <div class="bg-primary/5 rounded-2xl p-8 border border-primary/10 transition-transform hover:-translate-y-1">
    <h3 class="text-xl font-bold text-primary mb-4 flex items-center">
      <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg> 
      Our Vision
    </h3>
    <p class="text-slate-600 dark:text-slate-300 m-0 leading-relaxed">To establish a world-class knowledge hub that empowers medical students and faculty with unparalleled access to contemporary medical literature, research, and digital learning resources.</p>
  </div>
  <div class="bg-accent/5 rounded-2xl p-8 border border-accent/10 transition-transform hover:-translate-y-1">
    <h3 class="text-xl font-bold text-accent mb-4 flex items-center">
      <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg> 
      Our Mission
    </h3>
    <p class="text-slate-600 dark:text-slate-300 m-0 leading-relaxed">To continuously upgrade our physical and digital collections, foster an environment of intense academic inquiry, and support the college's mandate of producing exceptional healthcare professionals.</p>
  </div>
</div>

<p class="text-xl text-slate-700 dark:text-slate-200 mb-6 font-medium">The Central Library of Jannayak Birsa Munda Government Medical College Nandurbar stands as the academic heart of the institution. Established in 2020, it occupies a spacious 500 sq.ft. area on the first floor.</p>

<p class="mb-10 text-slate-600 dark:text-slate-400 leading-relaxed">Fully air-conditioned and equipped with high-speed Wi-Fi and Digital CCTV security, the library offers an 'Open Access' system, allowing users the freedom to browse and select from our extensive, continuously updated collection of medical literature. The library actively serves the day-to-day study requirements of our medical students and aids faculty members in advanced research.</p>

<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
  <div class="text-center p-6 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm">
    <div class="text-4xl font-extrabold text-primary mb-2">500+</div>
    <div class="text-xs text-slate-500 font-bold uppercase tracking-widest">Sq. Ft Area</div>
  </div>
  <div class="text-center p-6 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm">
    <div class="text-4xl font-extrabold text-primary mb-2">2020</div>
    <div class="text-xs text-slate-500 font-bold uppercase tracking-widest">Established</div>
  </div>
  <div class="text-center p-6 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm">
    <div class="text-4xl font-extrabold text-primary mb-2">24/7</div>
    <div class="text-xs text-slate-500 font-bold uppercase tracking-widest">Digital Access</div>
  </div>
  <div class="text-center p-6 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm">
    <div class="text-4xl font-extrabold text-primary mb-2">100%</div>
    <div class="text-xs text-slate-500 font-bold uppercase tracking-widest">Air Conditioned</div>
  </div>
</div>
  `,
  
  'library/library-timing': `
<p class="text-xl mb-8 text-slate-700 dark:text-slate-300 font-medium">The Central Library provides extended reading hours to support the rigorous academic schedules of our medical students and faculty.</p>

<div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-border overflow-hidden mb-10">
  <table class="w-full text-left border-collapse m-0">
    <thead>
      <tr class="bg-slate-50 dark:bg-slate-800">
        <th class="py-5 px-6 font-semibold text-slate-700 dark:text-slate-200 border-b border-border">Facility Area</th>
        <th class="py-5 px-6 font-semibold text-slate-700 dark:text-slate-200 border-b border-border">Operating Days</th>
        <th class="py-5 px-6 font-semibold text-slate-700 dark:text-slate-200 border-b border-border">Official Timings</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-border">
      <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
        <td class="py-5 px-6 font-medium flex items-center">
          <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
            <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
          </div>
          Main Reading Hall
        </td>
        <td class="py-5 px-6 text-slate-600 dark:text-slate-400">Monday - Saturday</td>
        <td class="py-5 px-6 text-slate-600 dark:text-slate-400"><span class="bg-primary/10 text-primary font-bold px-4 py-1.5 rounded-full text-sm">08:00 AM - 10:00 PM</span></td>
      </tr>
      <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
        <td class="py-5 px-6 font-medium flex items-center">
          <div class="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mr-4">
            <svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
          </div>
          E-Library Section
        </td>
        <td class="py-5 px-6 text-slate-600 dark:text-slate-400">Monday - Saturday</td>
        <td class="py-5 px-6 text-slate-600 dark:text-slate-400"><span class="bg-primary/10 text-primary font-bold px-4 py-1.5 rounded-full text-sm">09:00 AM - 05:00 PM</span></td>
      </tr>
      <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
        <td class="py-5 px-6 font-medium flex items-center">
          <div class="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center mr-4">
            <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          </div>
          Sundays & Holidays
        </td>
        <td class="py-5 px-6 text-slate-600 dark:text-slate-400">All Sections</td>
        <td class="py-5 px-6 text-slate-600 dark:text-slate-400"><span class="bg-red-500/10 text-red-600 font-bold px-4 py-1.5 rounded-full text-sm">Closed</span></td>
      </tr>
    </tbody>
  </table>
</div>

<div class="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-500 p-6 rounded-r-2xl shadow-sm">
  <div class="flex">
    <div class="flex-shrink-0 mt-1">
      <svg class="h-6 w-6 text-amber-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
    </div>
    <div class="ml-4">
      <h3 class="text-lg font-bold text-amber-800 dark:text-amber-400 mb-2">Important Notice for Exam Periods</h3>
      <p class="text-amber-700 dark:text-amber-300 m-0">During university examinations, the Main Reading Hall timings are extended up to <strong class="font-bold">12:00 Midnight</strong>. Notifications regarding exact dates for extended hours will be posted on the Central Library notice board and student portals two weeks prior to the examinations.</p>
    </div>
  </div>
</div>
  `,

  'library/library-staff-members': `
<p class="text-xl mb-12 text-center max-w-3xl mx-auto text-slate-600 dark:text-slate-400">Our dedicated team of library professionals is committed to providing outstanding academic service, ensuring students and faculty find the exact resources they need for their success.</p>

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
  <div class="bg-white dark:bg-slate-900 rounded-3xl shadow-md border border-slate-100 dark:border-slate-800 p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
    <div class="w-32 h-32 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
      <svg class="w-16 h-16 text-slate-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
    </div>
    <h3 class="text-2xl font-bold text-foreground mb-1">Dr. Amit Sharma</h3>
    <p class="text-primary font-bold text-sm mb-4 uppercase tracking-widest">Chief Librarian</p>
    <div class="w-12 h-1 bg-border mx-auto mb-4 group-hover:bg-primary transition-colors"></div>
    <p class="text-slate-500 font-medium">M.Lib.I.Sc., Ph.D.</p>
  </div>
  
  <div class="bg-white dark:bg-slate-900 rounded-3xl shadow-md border border-slate-100 dark:border-slate-800 p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
    <div class="w-32 h-32 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
      <svg class="w-16 h-16 text-slate-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
    </div>
    <h3 class="text-2xl font-bold text-foreground mb-1">Mrs. Sneha Patil</h3>
    <p class="text-primary font-bold text-sm mb-4 uppercase tracking-widest">Assistant Librarian</p>
    <div class="w-12 h-1 bg-border mx-auto mb-4 group-hover:bg-primary transition-colors"></div>
    <p class="text-slate-500 font-medium">M.Lib.I.Sc.</p>
  </div>

  <div class="bg-white dark:bg-slate-900 rounded-3xl shadow-md border border-slate-100 dark:border-slate-800 p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
    <div class="w-32 h-32 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
      <svg class="w-16 h-16 text-slate-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
    </div>
    <h3 class="text-2xl font-bold text-foreground mb-1">Mr. Rahul Desai</h3>
    <p class="text-primary font-bold text-sm mb-4 uppercase tracking-widest">Library Assistant</p>
    <div class="w-12 h-1 bg-border mx-auto mb-4 group-hover:bg-primary transition-colors"></div>
    <p class="text-slate-500 font-medium">B.Lib.I.Sc.</p>
  </div>
</div>
  `,

  'library/e-library': `
<p class="text-xl mb-10 text-slate-700 dark:text-slate-300 font-medium leading-relaxed">Access thousands of premium medical journals, interactive clinical tools, and research databases right from your device. The E-Library is accessible 24/7 via the campus network.</p>

<div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
  <div class="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-10 relative overflow-hidden group shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
    <div class="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-700">
      <svg class="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
    </div>
    <h3 class="text-3xl font-extrabold mb-3 text-white">MUHS Digital Library</h3>
    <p class="text-slate-300 mb-8 text-lg">Unlimited access to clinical textbooks, journals, and video lectures provided by the university consortium.</p>
    <a href="#" class="inline-flex items-center bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-bold transition-colors">
      Access Portal <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
    </a>
  </div>
  
  <div class="bg-gradient-to-br from-primary to-primary/80 text-white rounded-3xl p-10 relative overflow-hidden group shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
    <div class="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-700">
      <svg class="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
    </div>
    <h3 class="text-3xl font-extrabold mb-3 text-white">ClinicalKey</h3>
    <p class="text-primary-100 mb-8 text-lg">Point-of-care clinical evidence, comprehensive drug monographs, and the latest medical guidelines.</p>
    <a href="#" class="inline-flex items-center bg-white text-primary hover:bg-slate-100 px-6 py-3 rounded-full font-bold transition-colors shadow-sm">
      Login to ClinicalKey <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
    </a>
  </div>
</div>

<div class="bg-white dark:bg-slate-900 rounded-3xl p-10 border border-border shadow-sm relative overflow-hidden">
  <div class="absolute top-0 left-0 w-2 h-full bg-accent"></div>
  <h3 class="text-2xl font-bold text-foreground mb-6">Available E-Resources at Campus</h3>
  <ul class="space-y-4 text-lg">
    <li class="flex items-center text-slate-700 dark:text-slate-300 font-medium">
      <div class="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center mr-4 flex-shrink-0">
        <svg class="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
      </div>
      500+ Medical E-Journals (National & International)
    </li>
    <li class="flex items-center text-slate-700 dark:text-slate-300 font-medium">
      <div class="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center mr-4 flex-shrink-0">
        <svg class="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
      </div>
      2,000+ Medical E-Books spanning all clinical and pre-clinical departments
    </li>
    <li class="flex items-center text-slate-700 dark:text-slate-300 font-medium">
      <div class="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center mr-4 flex-shrink-0">
        <svg class="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
      </div>
      Subscribed Premium Databases (PubMed, EBSCO Health, ProQuest)
    </li>
    <li class="flex items-center text-slate-700 dark:text-slate-300 font-medium">
      <div class="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center mr-4 flex-shrink-0">
        <svg class="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
      </div>
      High-Definition Video Archives of Surgical Procedures
    </li>
  </ul>
</div>
  `,

  'library/central-library-rules': `
<p class="text-xl mb-10 text-slate-700 dark:text-slate-300 font-medium">To maintain an atmosphere of quiet study and protect our valuable collections, all students and staff are requested to adhere strictly to the following library rules.</p>

<div class="space-y-6">
  <div class="flex items-start bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
    <div class="flex-shrink-0">
      <div class="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary font-black text-xl">1</div>
    </div>
    <div class="ml-6">
      <h4 class="text-xl font-bold text-foreground mb-2">Silence & Discipline</h4>
      <p class="text-slate-600 dark:text-slate-400 m-0 leading-relaxed">Absolute silence must be maintained in the Reading Halls. Group discussions are strictly prohibited in the main hall. Please use designated group study rooms for collaborative work.</p>
    </div>
  </div>
  
  <div class="flex items-start bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
    <div class="flex-shrink-0">
      <div class="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary font-black text-xl">2</div>
    </div>
    <div class="ml-6">
      <h4 class="text-xl font-bold text-foreground mb-2">ID Cards Mandatory</h4>
      <p class="text-slate-600 dark:text-slate-400 m-0 leading-relaxed">A valid College ID card must be presented at the security desk upon entrance and is mandatory for issuing or returning any library books.</p>
    </div>
  </div>

  <div class="flex items-start bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
    <div class="flex-shrink-0">
      <div class="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary font-black text-xl">3</div>
    </div>
    <div class="ml-6">
      <h4 class="text-xl font-bold text-foreground mb-2">Personal Belongings</h4>
      <p class="text-slate-600 dark:text-slate-400 m-0 leading-relaxed">Bags, personal books, printed notes, and umbrellas must be kept at the property counter. The library administration is not responsible for any loss of personal items.</p>
    </div>
  </div>

  <div class="flex items-start bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
    <div class="flex-shrink-0">
      <div class="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary font-black text-xl">4</div>
    </div>
    <div class="ml-6">
      <h4 class="text-xl font-bold text-foreground mb-2">Electronic Devices</h4>
      <p class="text-slate-600 dark:text-slate-400 m-0 leading-relaxed">Mobile phones must be kept on silent mode at all times. Taking calls inside the reading areas is strictly forbidden. Laptops are permitted only in designated plug-in zones.</p>
    </div>
  </div>
</div>
  `
};

const genericFallback = `
<div class="bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
   <div class="max-w-none">
       <h3 class="text-2xl font-bold mb-4 text-foreground">Overview & Catalog</h3>
       <p class="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8">We are actively updating the digital catalog for this section. The Central Library is continuously procuring new editions, international journals, and rare medical literature to ensure our students and faculty have access to the absolute best resources.</p>
       
       <div class="p-6 bg-primary/5 border-l-4 border-primary rounded-r-xl flex items-start">
           <svg class="w-6 h-6 text-primary mr-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
           <p class="m-0 text-primary-900 dark:text-primary-100 font-medium">For immediate assistance, specific queries, or to request a physical resource, please approach the Central Circulation Desk located on the first floor.</p>
       </div>
   </div>
</div>
`;

async function run() {
  if (!data.dynamicPages) {
    console.log("No dynamic pages found.");
    return;
  }

  let updatedCount = 0;
  for (let i = 0; i < data.dynamicPages.length; i++) {
    const page = data.dynamicPages[i];
    if (page.slug.startsWith('library/')) {
      const customContent = contentMap[page.slug] || genericFallback;
      data.dynamicPages[i].content = customContent.trim();
      updatedCount++;
      console.log(`Overhauled ${page.slug}`);
    }
  }

  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Successfully overhauled ${updatedCount} library pages with premium Tailwind components!`);
}

run();
