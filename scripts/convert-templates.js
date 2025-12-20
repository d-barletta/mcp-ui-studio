// Script to generate remaining templates in proper MCP-UI format
// Run with: node scripts/convert-templates.js

const fs = require('fs');

// Wizard template
const wizardTemplate = `  {
    id: 'wizard',
    name: 'Multi-Step Wizard',
    description: 'Multi-step form wizard with progress indicator',
    category: 'Wizards',
    content: {
      type: 'rawHtml',
      htmlString: \`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui; padding: 2rem; background: #f8f9fa; }
    .wizard { max-width: 600px; margin: 0 auto; background: white; padding: 2rem; border-radius: 12px; }
    h1 { margin-bottom: 2rem; }
    .progress { display: flex; gap: 0.5rem; margin-bottom: 2rem; }
    .progress-step { flex: 1; height: 4px; background: #e2e8f0; border-radius: 2px; }
    .progress-step.active { background: #3b82f6; }
    .wizard-step { display: none; }
    .wizard-step.active { display: block; }
    input, select { width: 100%; padding: 0.5rem; margin: 0.5rem 0 1rem; border: 1px solid #cbd5e1; border-radius: 6px; }
    button { padding: 0.75rem 1.5rem; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; margin-right: 0.5rem; }
    button.secondary { background: #94a3b8; }
  </style>
</head>
<body>
  <div class="wizard">
    <h1>Setup Wizard</h1>
    <div class="progress">
      <div class="progress-step active"></div>
      <div class="progress-step"></div>
      <div class="progress-step"></div>
    </div>
    <div class="wizard-step active">
      <h2>Step 1: Personal Info</h2>
      <input type="text" id="name" placeholder="Name">
      <input type="email" id="email" placeholder="Email">
    </div>
    <div class="wizard-step">
      <h2>Step 2: Preferences</h2>
      <select id="theme"><option>Light</option><option>Dark</option></select>
    </div>
    <div class="wizard-step">
      <h2>Step 3: Review</h2>
      <div id="review"></div>
    </div>
    <div>
      <button class="secondary" onclick="prev()" id="prevBtn" style="display:none">Previous</button>
      <button onclick="next()" id="nextBtn">Next</button>
    </div>
  </div>
  <script>
    let step = 0;
    function updateUI() {
      document.querySelectorAll('.wizard-step').forEach((el, i) => el.classList.toggle('active', i === step));
      document.querySelectorAll('.progress-step').forEach((el, i) => el.classList.toggle('active', i <= step));
      document.getElementById('prevBtn').style.display = step > 0 ? 'inline' : 'none';
      document.getElementById('nextBtn').textContent = step === 2 ? 'Complete' : 'Next';
      if (step === 2) {
        document.getElementById('review').innerHTML = \`Name: \${document.getElementById('name').value}<br>Email: \${document.getElementById('email').value}<br>Theme: \${document.getElementById('theme').value}\`;
      }
    }
    function next() {
      if (step < 2) { step++; updateUI(); }
      else { window.parent.postMessage({ type: 'tool', payload: { toolName: 'completeWizard', params: { name: document.getElementById('name').value, email: document.getElementById('email').value, theme: document.getElementById('theme').value } } }, '*'); }
    }
    function prev() { if (step > 0) { step--; updateUI(); } }
  </script>
</body>
</html>\`
    },
    previewCode: \`<div>Multi-step wizard with progress</div>\`
  }`;

console.log("Generated wizard template");
console.log("Add remaining templates (data-table, settings, card-gallery, analytics, notification-center) using similar pattern");
