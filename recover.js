const fs = require('fs');
const readline = require('readline');

const transcriptPath = 'C:/Users/Sagar/.gemini/antigravity/brain/dd18150f-4d54-496e-a10c-d160f9f6d639/.system_generated/logs/transcript_full.jsonl';

async function recover() {
  const fileStream = fs.createReadStream(transcriptPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let latestTabsCode = '';
  let latestPageCode = '';

  for await (const line of rl) {
    if (!line) continue;
    try {
      const entry = JSON.parse(line);
      
      // Look for write_to_file or replace_file_content args
      if (entry.tool_calls) {
        for (const call of entry.tool_calls) {
          if (call.name === 'write_to_file' || call.name === 'replace_file_content') {
            const args = call.args;
            if (args.TargetFile && args.TargetFile.includes('department-detail-tabs.tsx') && args.CodeContent) {
              latestTabsCode = args.CodeContent;
            }
            if (args.TargetFile && args.TargetFile.includes('page.tsx') && args.CodeContent) {
              if (args.CodeContent.includes('DepartmentDetailTabs')) {
                 latestPageCode = args.CodeContent;
              }
            }
          }
        }
      }
      
      // Look for view_file responses
      if (entry.type === 'TOOL_RESPONSE' && entry.content) {
        if (entry.content.includes('department-detail-tabs.tsx') && entry.content.includes('Total Lines:') && entry.content.includes('The following code has been modified to include a line number')) {
          // This is a view_file response, we could reconstruct, but write_to_file is easier
        }
      }
      
    } catch (e) {}
  }

  if (latestTabsCode) {
    fs.writeFileSync('./recovered_tabs.tsx', latestTabsCode);
    console.log('Recovered tabs to recovered_tabs.tsx (length: ' + latestTabsCode.length + ')');
  } else {
    console.log('Could not find latestTabsCode from write_to_file');
  }
  
  if (latestPageCode) {
    fs.writeFileSync('./recovered_page.tsx', latestPageCode);
    console.log('Recovered page to recovered_page.tsx (length: ' + latestPageCode.length + ')');
  } else {
    console.log('Could not find latestPageCode from write_to_file');
  }
}

recover();
