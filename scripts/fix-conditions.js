const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/departments/[slug]/department-detail-tabs.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const conditions = {
  faculty: 'department.doctors && department.doctors.length > 0',
  duties: 'department.duties && department.duties.length > 0',
  facilities: 'department.facilities && department.facilities.length > 0',
  research: 'department.researchPublications && department.researchPublications.length > 0',
  equipments: 'department.equipmentDetails && department.equipmentDetails.length > 0',
  library: 'department.libraryBooks && department.libraryBooks.length > 0'
};

const lines = content.split('\n');
const newLines = [];
let activeCondition = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  const sectionMatch = line.match(/^(\s*)<section id="([^"]+)"/);
  if (sectionMatch) {
    const indent = sectionMatch[1];
    const id = sectionMatch[2];
    
    if (conditions[id]) {
      activeCondition = true;
      newLines.push(`${indent}{${conditions[id]} && (`);
    }
    newLines.push(line);
    continue;
  }

  if (activeCondition && line.match(/^(\s*)<\/section>/)) {
    newLines.push(line);
    const indent = line.match(/^(\s*)/)[1];
    newLines.push(`${indent})}`);
    activeCondition = false;
    continue;
  }

  newLines.push(line);
}

fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
console.log('Fixed conditional section wrappers');
