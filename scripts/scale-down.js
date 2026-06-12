const fs = require('fs');

let content = fs.readFileSync('app/departments/[slug]/department-detail-tabs.tsx', 'utf8');

// Global Layout
content = content.replace(/gap-8 lg:gap-12 w-full/g, 'gap-6 lg:gap-8 w-full');
content = content.replace(/md:w-64 shrink-0 flex flex-col gap-3/g, 'md:w-56 shrink-0 flex flex-col gap-2');
content = content.replace(/px-6 py-4 rounded-2xl/g, 'px-4 py-3 rounded-xl');
content = content.replace(/w-12 h-12/g, 'w-10 h-10'); // Tab icons and general
content = content.replace(/text-lg font-medium/g, 'text-base font-medium');
content = content.replace(/text-lg text-slate-600/g, 'text-base text-slate-600');

// Headings and Borders
content = content.replace(/text-3xl font-black/g, 'text-2xl font-bold');
content = content.replace(/text-4xl font-black/g, 'text-3xl font-bold'); // Stats numbers
content = content.replace(/text-2xl font-black/g, 'text-xl font-bold');
content = content.replace(/text-2xl font-bold/g, 'text-xl font-bold');
content = content.replace(/rounded-\[2\.5rem\]/g, 'rounded-3xl');
content = content.replace(/rounded-\[2rem\]/g, 'rounded-2xl');
content = content.replace(/p-8 md:p-12/g, 'p-6 md:p-8');
content = content.replace(/p-8 md:p-10/g, 'p-6 md:p-8');

// The tricky global p-8 and p-6
content = content.replace(/ p-8 /g, ' p-6 ');
content = content.replace(/ p-8"/g, ' p-6"');
content = content.replace(/"p-8 /g, '"p-6 ');
content = content.replace(/ p-6 /g, ' p-5 '); // for smaller tiles like doctors and stats
content = content.replace(/"p-6 /g, '"p-5 ');
content = content.replace(/ p-6"/g, ' p-5"');

// Overview Tab HOD
content = content.replace(/w-64 h-64/g, 'w-48 h-48');
content = content.replace(/w-32 h-32/g, 'w-24 h-24');

// Faculty Tab HOD
content = content.replace(/w-40 h-40 md:w-48 md:h-48/g, 'w-28 h-28 md:w-32 md:h-32');
content = content.replace(/w-16 h-16/g, 'w-12 h-12'); // HOD Placeholder user icon
content = content.replace(/text-3xl md:text-4xl/g, 'text-2xl md:text-3xl');

// Regular Doctors
content = content.replace(/w-20 h-20/g, 'w-14 h-14'); // Normal photo
content = content.replace(/w-8 h-8/g, 'w-8 h-8'); // don't shrink too small, 8 is okay

// Non-teaching
content = content.replace(/w-14 h-14/g, 'w-12 h-12');

// Duties
content = content.replace(/p-4 rounded-2xl/g, 'p-3 rounded-xl');

// Space Y
content = content.replace(/space-y-12/g, 'space-y-8');
content = content.replace(/space-y-8/g, 'space-y-6');
content = content.replace(/mb-12/g, 'mb-8');
content = content.replace(/mb-8/g, 'mb-6');
content = content.replace(/gap-8/g, 'gap-6');

fs.writeFileSync('app/departments/[slug]/department-detail-tabs.tsx', content, 'utf8');
console.log('Replacements complete');
