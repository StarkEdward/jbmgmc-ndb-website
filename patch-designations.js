const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

// Go through all departments to ensure consistency globally, or just Anaesthesiology
db.departments.forEach(dept => {
  if (dept.doctors) {
    dept.doctors.forEach(doc => {
      if (doc.designation) {
        if (doc.designation.includes('SR- 1') || doc.designation.includes('SR -1') || doc.designation === 'SR') {
          doc.designation = 'Senior Resident';
        }
        if (doc.designation.includes('JR- 1') || doc.designation.includes('JR- 3') || doc.designation.startsWith('JR')) {
          doc.designation = 'Junior Resident';
        }
      }
    });
  }
  
  if (dept.nonTeachingStaff) {
    dept.nonTeachingStaff.forEach(staff => {
      if (staff.post) {
        if (staff.post.includes('JR- 1') || staff.post.includes('JR- 3') || staff.post.startsWith('JR -') || staff.post === 'JR') {
          staff.post = 'Junior Resident';
        }
        if (staff.post.includes('Jr. Clerk') || staff.post.includes('Jr Clerk')) {
          staff.post = 'Junior Clerk';
        }
        if (staff.post.includes('SR- 1') || staff.post.includes('SR -1') || staff.post === 'SR') {
          staff.post = 'Senior Resident';
        }
      }
    });
  }
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log('Successfully updated designations to full form');
