const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/departments/[slug]/department-detail-tabs.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add Tabs Push
const tabsPushLocation = "if (department.libraryBooks && department.libraryBooks.length > 0) {\\n    tabs.push({ id: 'library', label: 'Library', icon: Library, color: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/20' })\\n  }";
const tabsPushNew = "if (department.libraryBooks && department.libraryBooks.length > 0) {\\n    tabs.push({ id: 'library', label: 'Library', icon: Library, color: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/20' })\\n  }\\n  if (department.services && department.services.length > 0) {\\n    tabs.push({ id: 'services', label: 'Services', icon: Activity, color: 'from-emerald-500 to-green-600', shadow: 'shadow-emerald-500/20' })\\n  }\\n  if (department.labInvestigations && department.labInvestigations.length > 0) {\\n    tabs.push({ id: 'investigations', label: 'Investigations', icon: FileText, color: 'from-indigo-500 to-blue-600', shadow: 'shadow-indigo-500/20' })\\n  }";

if (!content.includes("tabs.push({ id: 'services'")) {
  content = content.replace(tabsPushLocation, tabsPushNew);
}

// 2. Add JSX Sections
const jsxLocation = "</main>";

const jsxNew = `
        {/* Services Block */}
        {department.services && department.services.length > 0 && (
          <section id="services" className="scroll-mt-32">
            <div className="space-y-6 animate-in slide-in-from-bottom-8 fade-in duration-700">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-emerald-500/10 rounded-2xl">
                  <Activity className="h-8 w-8 text-emerald-500" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100">Services Provided</h2>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">Diagnostic and therapeutic services offered</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 md:p-6">
                {department.services.map((service, idx) => (
                  <div key={idx} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/60 dark:border-slate-800/60 shadow-lg hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300">
                    <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{service.name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{service.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Lab Investigations Block */}
        {department.labInvestigations && department.labInvestigations.length > 0 && (
          <section id="investigations" className="scroll-mt-32">
            <div className="space-y-6 animate-in slide-in-from-bottom-8 fade-in duration-700">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-indigo-500/10 rounded-2xl">
                  <FileText className="h-8 w-8 text-indigo-500" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100">Lab Investigations</h2>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">Investigations done in the last 3 years</p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 overflow-hidden shadow-lg md:p-6 p-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                        <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Year</th>
                        <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pathology IPD/OPD</th>
                        <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Histopathology</th>
                        <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cytology</th>
                        <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {department.labInvestigations.map((inv, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="py-4 px-6 text-sm font-semibold text-slate-800 dark:text-slate-200">{inv.year}</td>
                          <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-400">{inv.ipdOpd}</td>
                          <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-400">{inv.histopathology}</td>
                          <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-400">{inv.cytology}</td>
                          <td className="py-4 px-6 text-sm font-bold text-indigo-600 dark:text-indigo-400">{inv.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>`;

if (!content.includes('<section id="services"')) {
  // Replace the closing main div layout correctly. 
  // It's `      </div>\n    </main>` at the end of the file.
  content = content.replace("      </div>\\n    </main>", jsxNew);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("UI updated successfully.");
