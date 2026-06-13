const fs = require('fs');
const files = [
  'app/[...slug]/page.tsx',
  'app/about/page.tsx',
  'app/courses/page.tsx',
  'app/departments/[slug]/page.tsx',
  'app/departments/page.tsx',
  'app/events/page.tsx',
  'app/hostel/page.tsx'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    const newContent = content.replace(/export const dynamic = ['"]force-dynamic['"];?\n?/g, '');
    if (content !== newContent) {
      fs.writeFileSync(f, newContent);
      console.log('Fixed ' + f);
    } else {
      console.log('No change needed for ' + f);
    }
  } else {
    console.log('File not found ' + f);
  }
});
