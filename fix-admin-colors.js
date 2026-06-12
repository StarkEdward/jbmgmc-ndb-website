const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const replacements = [
  { regex: /(?<!dark:)text-slate-100/g, replacement: 'text-slate-900 dark:text-slate-100' },
  { regex: /(?<!dark:)text-slate-200/g, replacement: 'text-slate-800 dark:text-slate-200' },
  { regex: /(?<!dark:)text-slate-300/g, replacement: 'text-slate-700 dark:text-slate-300' },
  { regex: /(?<!dark:)text-slate-350/g, replacement: 'text-slate-600 dark:text-slate-350' },
  { regex: /(?<!dark:)text-slate-400/g, replacement: 'text-slate-600 dark:text-slate-400' },
  { regex: /(?<!dark:)text-slate-450/g, replacement: 'text-slate-500 dark:text-slate-450' },
  
  { regex: /(?<!dark:)bg-slate-950(?!\/)/g, replacement: 'bg-white dark:bg-slate-950' },
  { regex: /(?<!dark:)bg-slate-950\/(\d+)/g, replacement: 'bg-white/$1 dark:bg-slate-950/$1' },
  
  { regex: /(?<!dark:)bg-slate-900(?!\/)/g, replacement: 'bg-slate-50 dark:bg-slate-900' },
  { regex: /(?<!dark:)bg-slate-900\/(\d+)/g, replacement: 'bg-slate-50/$1 dark:bg-slate-900/$1' },
  
  { regex: /(?<!dark:)bg-slate-850(?!\/)/g, replacement: 'bg-slate-100 dark:bg-slate-850' },
  { regex: /(?<!dark:)bg-slate-850\/(\d+)/g, replacement: 'bg-slate-100/$1 dark:bg-slate-850/$1' },

  { regex: /(?<!dark:)border-slate-800(?!\/)/g, replacement: 'border-slate-200 dark:border-slate-800' },
  { regex: /(?<!dark:)border-slate-800\/(\d+)/g, replacement: 'border-slate-200/$1 dark:border-slate-800/$1' },
  
  { regex: /(?<!dark:)border-slate-850(?!\/)/g, replacement: 'border-slate-200 dark:border-slate-850' },
  { regex: /(?<!dark:)border-slate-850\/(\d+)/g, replacement: 'border-slate-200/$1 dark:border-slate-850/$1' },
  
  { regex: /(?<!dark:)border-slate-700(?!\/)/g, replacement: 'border-slate-300 dark:border-slate-700' },
  { regex: /(?<!dark:)border-slate-700\/(\d+)/g, replacement: 'border-slate-300/$1 dark:border-slate-700/$1' },

  { regex: /(?<!dark:)ring-slate-800(?!\/)/g, replacement: 'ring-slate-200 dark:ring-slate-800' },
  
  { regex: /(?<!dark:)text-teal-400/g, replacement: 'text-teal-600 dark:text-teal-400' },
  { regex: /(?<!dark:)text-teal-450/g, replacement: 'text-teal-700 dark:text-teal-450' },
  
  // Note: we might have bg-teal-500 which shouldn't necessarily be dark, as teal-500 is often good in both modes for buttons.
  // But let's adjust slightly for text
];

walkDir(path.join(__dirname, 'app', 'admin'), (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    for (let rule of replacements) {
      content = content.replace(rule.regex, rule.replacement);
    }
    
    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log(`Updated ${filePath}`);
    }
  }
});
