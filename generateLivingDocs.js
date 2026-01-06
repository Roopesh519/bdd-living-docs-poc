const fs = require("fs");
const path = require("path");

const FEATURES_DIR = path.join(__dirname, "features");
const OUTPUT_DIR = path.join(__dirname, "living-docs");

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Parse a single feature file
function parseFeatureFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");

  let feature = {
    fileName: path.basename(filePath, ".feature"),
    filePath: filePath,
    cos: null,
    reqLink: null,
    name: null,
    description: null,
    background: null,
    scenarios: []
  };

  let currentScenario = null;
  let inBackground = false;
  let backgroundSteps = [];

  lines.forEach((line) => {
    const trimmed = line.trim();

    // Parse COS tag
    if (trimmed.startsWith("@COS-")) {
      if (!currentScenario) {
        feature.cos = trimmed.replace("@", "");
      }
    }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         

    // Parse REQ_LINK
    if (trimmed.startsWith("@REQ_LINK=")) {
      if (!currentScenario) {
        feature.reqLink = trimmed.replace("@REQ_LINK=", "");
      }
    }

    // Parse Feature name and description
    if (trimmed.startsWith("Feature:")) {
      feature.name = trimmed.replace("Feature:", "").trim();
    }

    // Capture feature description (line after Feature: that's not a keyword)
    if (
      feature.name &&
      !feature.description &&
      !trimmed.startsWith("@") &&
      !trimmed.startsWith("Feature:") &&
      !trimmed.startsWith("Background:") &&
      !trimmed.startsWith("Scenario:") &&
      !trimmed.startsWith("Given") &&
      !trimmed.startsWith("When") &&
      !trimmed.startsWith("Then") &&
      !trimmed.startsWith("And") &&
      trimmed.length > 0
    ) {
      feature.description = trimmed;
    }

    // Parse Background
    if (trimmed.startsWith("Background:")) {
      inBackground = true;
      backgroundSteps = [];
    }

    // Parse Scenario
    if (trimmed.startsWith("Scenario:")) {
      inBackground = false;
      if (currentScenario && currentScenario.title) {
        feature.scenarios.push(currentScenario);
      }
      currentScenario = {
        title: trimmed.replace("Scenario:", "").trim(),
        steps: []
      };
    }

    // Parse steps
    if (
      trimmed.startsWith("Given") ||
      trimmed.startsWith("When") ||
      trimmed.startsWith("Then") ||
      trimmed.startsWith("And")
    ) {
      if (inBackground) {
        backgroundSteps.push(trimmed);
      } else if (currentScenario) {
        currentScenario.steps.push(trimmed);
      }
    }
  });

  // Push last scenario
  if (currentScenario && currentScenario.title) {
    feature.scenarios.push(currentScenario);
  }

  feature.background = backgroundSteps;

  return feature;
}

// Get all feature files
function getAllFeatureFiles() {
  const files = fs.readdirSync(FEATURES_DIR);
  return files
    .filter((f) => f.endsWith(".feature"))
    .sort()
    .map((f) => path.join(FEATURES_DIR, f));
}

// Generate CSS styles
function getStyles() {
  return `
    :root {
      --primary: #2563eb;
      --primary-dark: #1d4ed8;
      --secondary: #64748b;
      --success: #10b981;
      --background: #f8fafc;
      --card-bg: #ffffff;
      --border: #e2e8f0;
      --text: #1e293b;
      --text-light: #64748b;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      background: var(--background);
      color: var(--text);
      line-height: 1.6;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    header {
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
      color: white;
      padding: 40px 20px;
      margin-bottom: 40px;
    }

    header h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 8px;
    }

    header p {
      opacity: 0.9;
      font-size: 1.1rem;
    }

    .breadcrumb {
      background: var(--card-bg);
      padding: 12px 20px;
      border-bottom: 1px solid var(--border);
      font-size: 0.9rem;
    }

    .breadcrumb a {
      color: var(--primary);
      text-decoration: none;
    }

    .breadcrumb a:hover {
      text-decoration: underline;
    }

    .breadcrumb span {
      color: var(--secondary);
      margin: 0 8px;
    }

    .feature-list {
      display: grid;
      gap: 20px;
    }

    .feature-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
      transition: all 0.2s ease;
      text-decoration: none;
      color: inherit;
      display: block;
    }

    .feature-card:hover {
      border-color: var(--primary);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
      transform: translateY(-2px);
    }

    .feature-card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }

    .feature-card h2 {
      font-size: 1.25rem;
      color: var(--text);
      margin-bottom: 4px;
    }

    .feature-card .description {
      color: var(--text-light);
      font-size: 0.95rem;
      margin-bottom: 16px;
    }

    .feature-card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 16px;
      border-top: 1px solid var(--border);
    }

    .tag {
      background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%);
      color: var(--primary);
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .scenario-count {
      color: var(--secondary);
      font-size: 0.9rem;
    }

    .req-link {
      color: var(--primary);
      text-decoration: none;
      font-size: 0.9rem;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .req-link:hover {
      text-decoration: underline;
    }

    /* Feature Detail Page */
    .feature-header {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 32px;
      margin-bottom: 24px;
    }

    .feature-header h1 {
      font-size: 2rem;
      margin-bottom: 8px;
    }

    .feature-header .description {
      color: var(--text-light);
      font-size: 1.1rem;
      margin-bottom: 20px;
    }

    .feature-meta {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .background-section {
      background: #fefce8;
      border: 1px solid #fef08a;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
    }

    .background-section h3 {
      color: #a16207;
      margin-bottom: 12px;
      font-size: 1rem;
    }

    .background-section .step {
      color: #854d0e;
      padding: 4px 0;
    }

    .scenarios-section h2 {
      font-size: 1.5rem;
      margin-bottom: 20px;
      color: var(--text);
    }

    .scenario-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 16px;
    }

    .scenario-card h3 {
      font-size: 1.1rem;
      color: var(--text);
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--border);
    }

    .step {
      padding: 8px 0;
      padding-left: 24px;
      position: relative;
      font-family: 'Consolas', 'Monaco', monospace;
      font-size: 0.9rem;
    }

    .step::before {
      content: '';
      position: absolute;
      left: 8px;
      top: 50%;
      transform: translateY(-50%);
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    .step.given::before { background: #22c55e; }
    .step.when::before { background: #3b82f6; }
    .step.then::before { background: #a855f7; }
    .step.and::before { background: #64748b; }

    .step-keyword {
      font-weight: 700;
    }

    .step.given .step-keyword { color: #16a34a; }
    .step.when .step-keyword { color: #2563eb; }
    .step.then .step-keyword { color: #9333ea; }
    .step.and .step-keyword { color: #475569; }

    .stats {
      display: flex;
      gap: 32px;
      margin-top: 40px;
      padding: 24px;
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
    }

    .stat {
      text-align: center;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--primary);
    }

    .stat-label {
      color: var(--secondary);
      font-size: 0.9rem;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: var(--primary);
      text-decoration: none;
      font-weight: 500;
      margin-bottom: 24px;
    }

    .back-link:hover {
      text-decoration: underline;
    }

    /* Smooth scrolling for anchor navigation */
    html {
      scroll-behavior: smooth;
    }

    /* Highlight target feature card when navigated via hash */
    .feature-card:target {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
      animation: highlight-pulse 2s ease-out;
    }

    @keyframes highlight-pulse {
      0% { box-shadow: 0 0 0 6px rgba(37, 99, 235, 0.4); }
      100% { box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2); }
    }

    /* Offset for fixed headers if needed */
    .feature-card {
      scroll-margin-top: 20px;
    }
  `;
}

// Format step with keyword highlighting
function formatStep(step) {
  const keywords = ["Given", "When", "Then", "And"];
  let stepClass = "step";
  let formattedStep = step;

  for (const keyword of keywords) {
    if (step.startsWith(keyword)) {
      stepClass += ` ${keyword.toLowerCase()}`;
      formattedStep = `<span class="step-keyword">${keyword}</span>${step.substring(keyword.length)}`;
      break;
    }
  }

  return `<div class="${stepClass}">${formattedStep}</div>`;
}

// Generate index page
function generateIndexPage(features) {
  const totalScenarios = features.reduce((sum, f) => sum + f.scenarios.length, 0);

  let html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Living Documentation - ZoodPay</title>
  <style>${getStyles()}</style>
</head>
<body>

<header>
  <div class="container">
    <h1>📋 Living Documentation</h1>
    <p>ZoodPay Admin Portal - BDD Feature Specifications</p>
  </div>
</header>

<div class="container">
  <div class="stats">
    <div class="stat">
      <div class="stat-value">${features.length}</div>
      <div class="stat-label">Features</div>
    </div>
    <div class="stat">
      <div class="stat-value">${totalScenarios}</div>
      <div class="stat-label">Scenarios</div>
    </div>
  </div>

  <h2 style="margin: 32px 0 20px; font-size: 1.5rem;">Feature Files</h2>

  <div class="feature-list">
`;

  features.forEach((feature) => {
    const detailPageName = `${feature.fileName}.html`;
    const anchorId = feature.cos ? feature.cos.toLowerCase() : feature.fileName;
    html += `
    <a href="${detailPageName}" class="feature-card" id="${anchorId}">
      <div class="feature-card-header">
        <div>
          <h2>${feature.name || feature.fileName}</h2>
          <p class="description">${feature.description || ""}</p>
        </div>
        <span class="tag">${feature.cos || "N/A"}</span>
      </div>
      <div class="feature-card-footer">
        <span class="scenario-count">📝 ${feature.scenarios.length} Scenarios</span>
        ${feature.reqLink ? `<span class="req-link" onclick="event.preventDefault(); event.stopPropagation(); window.open('${feature.reqLink}', '_blank');">🔗 View Requirement</span>` : ""}
      </div>
    </a>
`;
  });

  html += `
  </div>
</div>

</body>
</html>
`;

  return html;
}

// Generate feature detail page
function generateFeatureDetailPage(feature) {
  let html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${feature.name || feature.fileName} - Living Documentation</title>
  <style>${getStyles()}</style>
</head>
<body>

<nav class="breadcrumb">
  <a href="index.html">Living Documentation</a>
  <span>›</span>
  ${feature.name || feature.fileName}
</nav>

<div class="container">
  <a href="index.html" class="back-link">← Back to Features</a>

  <div class="feature-header">
    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
      <div>
        <h1>${feature.name || feature.fileName}</h1>
        <p class="description">${feature.description || ""}</p>
      </div>
      <span class="tag">${feature.cos || "N/A"}</span>
    </div>
    <div class="feature-meta">
      ${feature.reqLink ? `<a href="${feature.reqLink}" target="_blank" class="req-link">🔗 View Requirement in Google Sheet</a>` : ""}
      <span class="scenario-count">📝 ${feature.scenarios.length} Scenarios</span>
    </div>
  </div>
`;

  // Background section
  if (feature.background && feature.background.length > 0) {
    html += `
  <div class="background-section">
    <h3>📌 Background (runs before each scenario)</h3>
    ${feature.background.map((step) => formatStep(step)).join("")}
  </div>
`;
  }

  // Scenarios
  html += `
  <div class="scenarios-section">
    <h2>Scenarios</h2>
`;

  feature.scenarios.forEach((scenario, index) => {
    html += `
    <div class="scenario-card">
      <h3>${index + 1}. ${scenario.title}</h3>
      ${scenario.steps.map((step) => formatStep(step)).join("")}
    </div>
`;
  });

  html += `
  </div>
</div>

</body>
</html>
`;

  return html;
}

// Main execution
function main() {
  console.log("🔄 Generating Living Documentation...\n");

  const featureFiles = getAllFeatureFiles();
  console.log(`📁 Found ${featureFiles.length} feature files\n`);

  const features = featureFiles.map((filePath) => {
    const feature = parseFeatureFile(filePath);
    console.log(`  ✓ Parsed: ${feature.fileName} (${feature.scenarios.length} scenarios)`);
    return feature;
  });

  // Generate index page
  const indexHtml = generateIndexPage(features);
  fs.writeFileSync(path.join(OUTPUT_DIR, "index.html"), indexHtml);
  console.log(`\n📄 Generated: index.html`);

  // Generate individual feature pages
  features.forEach((feature) => {
    const detailHtml = generateFeatureDetailPage(feature);
    const outputPath = path.join(OUTPUT_DIR, `${feature.fileName}.html`);
    fs.writeFileSync(outputPath, detailHtml);
    console.log(`📄 Generated: ${feature.fileName}.html`);
  });

  console.log(`\n✅ Living Docs generated at living-docs/`);
  console.log(`   Open living-docs/index.html in a browser to view.`);
}

main();
