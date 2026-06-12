const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/departments/[slug]/department-detail-tabs.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const targetStr = `
            {/* About the Department Text */}`;

const newContent = `
            {/* Courses Block */}
            {department.courses && department.courses.length > 0 && (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 md:p-6 pb-0 pt-0">
                {department.courses.map((course, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-indigo-500/10 to-purple-500/5 dark:from-indigo-500/20 dark:to-purple-500/10 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-5 flex items-center gap-4">
                    <div className="p-3 bg-indigo-500 text-white rounded-xl shadow-md">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-slate-800 dark:text-slate-100 font-bold">{course.courseName}</h4>
                      <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">Intake: {course.intake}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* About the Department Text */}`;

if (!content.includes("Courses Block")) {
  content = content.replace(targetStr, newContent);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log("Courses UI updated successfully.");
} else {
  console.log("Courses UI already exists.");
}
