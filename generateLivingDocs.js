const fs = require("fs");
const path = require("path");

const FEATURE_FILE = path.join(__dirname, "features/login.feature");
const OUTPUT_DIR = path.join(__dirname, "living-docs");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "index.html");

const content = fs.readFileSync(FEATURE_FILE, "utf8");
const lines = content.split("\n");

let scenarios = [];
let current = null;

lines.forEach(line => {
  line = line.trim();

  if (line.startsWith("@COS-")) {
    current = { cos: line.replace("@", ""), steps: [] };
  }

  if (line.startsWith("@REQ_LINK=")) {
    current.reqLink = line.replace("@REQ_LINK=", "");
  }

  if (line.startsWith("Scenario:")) {
    current.title = line.replace("Scenario:", "").trim();
  }

  if (
    line.startsWith("Given") ||
    line.startsWith("When") ||
    line.startsWith("Then")
  ) {
    current.steps.push(line);
  }

  if (line === "" && current && current.title) {
    scenarios.push(current);
    current = null;
  }
});

if (current) scenarios.push(current);

// HTML Generation
let html = `
<!DOCTYPE html>
<html>
<head>
  <title>Living Docs - POC</title>
  <style>
    body { font-family: Arial; padding: 20px; }
    .scenario {
      border: 1px solid #ccc;
      padding: 16px;
      margin-bottom: 20px;
    }
    .tag {
      background: #eef;
      padding: 4px 8px;
      border-radius: 4px;
      display: inline-block;
      margin-bottom: 8px;
    }
  </style>
</head>
<body>

<h1>Living Documentation (POC)</h1>
`;

scenarios.forEach(s => {
  html += `
<div class="scenario" id="${s.cos}">
  <div class="tag">${s.cos}</div>
  <h3>${s.title}</h3>
  ${s.steps.map(step => `<p>${step}</p>`).join("")}
  <a href="${s.reqLink}" target="_blank">🔗 View Requirement in Google Sheet</a>
</div>
`;
});

html += `
</body>
</html>
`;

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}

fs.writeFileSync(OUTPUT_FILE, html);

console.log("✅ Living Docs generated at living-docs/index.html");
