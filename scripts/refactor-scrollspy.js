const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/departments/[slug]/department-detail-tabs.tsx');
let content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

const newLines = [];
let insideConditionalTab = false;
let openTabs = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Match the start of a tab conditional: e.g., {activeTab === 'overview' && (
  // or {activeTab === 'faculty' && department.doctors && (
  const tabStartMatch = line.match(/^(\s*)\{activeTab === '([^']+)'(?: && [^&]+)? && \(\s*$/);
  
  if (tabStartMatch) {
    const indent = tabStartMatch[1];
    const tabId = tabStartMatch[2];
    newLines.push(`${indent}<section id="${tabId}" className="scroll-mt-32">`);
    insideConditionalTab = true;
    continue;
  }

  // We need to find the matching `)}` that closes the `{activeTab === ... && (`
  // These are consistently placed right before the next `        {/* ====================`
  // or at the very end before the closing div of the main content area.
  // Because they are indented at exactly 8 spaces: `        )}`
  
  if (insideConditionalTab && line === '        )}') {
    newLines.push('        </section>');
    insideConditionalTab = false;
    continue;
  }

  newLines.push(line);
}

fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
console.log('ScrollSpy Sections Refactored Successfully');
