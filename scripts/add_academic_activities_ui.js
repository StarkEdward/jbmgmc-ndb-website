const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/departments/[slug]/department-detail-tabs.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const targetStr = `
            {/* Key Skills */}`;

const newContent = `
            {/* Academic Activities Block */}
            {department.academicActivities && department.academicActivities.length > 0 && (
              <div className="bg-gradient-to-b from-blue-50 to-white dark:from-slate-800/50 dark:to-slate-900 rounded-3xl p-5 border border-blue-100 dark:border-slate-800 shadow-lg mt-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-blue-500 text-white rounded-2xl shadow-lg shadow-blue-500/30">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white">Academic Activities</h2>
                </div>
                <div className="space-y-4">
                  {department.academicActivities.map((activity, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-3 rounded-xl hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all border border-transparent hover:border-blue-100 dark:hover:border-slate-700">
                      <div className="shrink-0 mt-1">
                        <CheckCircle className="w-6 h-6 text-blue-500" />
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 font-medium">{activity}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Skills */}`;

if (!content.includes("Academic Activities Block")) {
  content = content.replace(targetStr, newContent);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log("Academic Activities UI updated successfully.");
} else {
  console.log("Academic Activities UI already exists.");
}
