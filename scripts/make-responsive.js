const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/departments/[slug]/department-detail-tabs.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace text sizes for responsiveness
content = content.replace(/text-3xl/g, 'text-2xl md:text-3xl');
content = content.replace(/text-2xl/g, 'text-xl md:text-2xl');
content = content.replace(/text-xl/g, 'text-lg md:text-xl');

// Except we might get text-lg md:text-xl md:text-2xl. Let's fix that if it happens.
content = content.replace(/text-lg md:text-xl md:text-2xl/g, 'text-xl md:text-2xl');
content = content.replace(/text-xl md:text-2xl md:text-3xl/g, 'text-2xl md:text-3xl');

// Replace standard padding sizes
content = content.replace(/p-8/g, 'p-5 md:p-8');
content = content.replace(/p-6/g, 'p-4 md:p-6');
content = content.replace(/p-5 md:p-5 md:p-8/g, 'p-5 md:p-8');
content = content.replace(/p-4 md:p-4 md:p-6/g, 'p-4 md:p-6');

// Tab sizes were already done manually. Let's make sure Quick Stats is responsive
// It's currently grid-cols-2. Let's make sure it doesn't break if padding changes.

fs.writeFileSync(filePath, content, 'utf8');
console.log('Responsiveness replacements applied');
