const fs = require('fs');

const files = [
  'app/about/page.tsx',
  'app/contact/page.tsx',
  'app/courses/page.tsx',
  'app/departments/page.tsx',
  'app/doctors/page.tsx',
  'app/events/page.tsx',
  'app/gallery/page.tsx',
  'app/hostel/page.tsx'
];

files.forEach(file => {
  const path = 'e:/New folder/b_a4NfVLTCLIh-1773847072793/' + file;
  if (fs.existsSync(path)) {
    let content = fs.readFileSync(path, 'utf8');
    
    // Tighten massive hero and section paddings to save vertical space
    let oldContent = content;
    content = content.replace(/py-16 md:py-24/g, 'py-8 md:py-12');
    content = content.replace(/py-20 md:py-32/g, 'py-10 md:py-16');
    content = content.replace(/py-12 md:py-20/g, 'py-8 md:py-12');
    
    if (content !== oldContent) {
      fs.writeFileSync(path, content, 'utf8');
      console.log('Tightened layout for ' + file);
    }
  }
});
