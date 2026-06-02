const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('C:/Users/Acer/.gemini/antigravity-ide/brain/ee59b6f1-8877-45ea-bfe3-2f8378eeba31/.system_generated/logs/transcript.jsonl');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    const data = JSON.parse(line);
    if (data.tool_calls) {
      for (const call of data.tool_calls) {
        if (call.arguments && call.arguments.TargetFile && call.arguments.TargetFile.includes('PDFPreviewModal.tsx') && call.arguments.ReplacementContent) {
          const content = call.arguments.ReplacementContent;
          if (content.includes("case 'CasaConcreto':")) {
            fs.writeFileSync('recovered_case.txt', content);
            console.log('Found and recovered!');
            process.exit(0);
          }
        }
      }
    }
  }
}

processLineByLine();
