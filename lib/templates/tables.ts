import { Template } from '../types';

export const tableTemplates: Template[] = [
  {
    id: 'data-table',
    name: 'Data Table',
    description: 'Interactive data table with sorting and row selection',
    category: 'Tables',
    content: {
      type: 'rawHtml',
      htmlString: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 p-8">
  <div class="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-200">
      <h2 class="text-xl font-bold text-gray-800">User Management</h2>
      <p class="text-sm text-gray-600 mt-1">Manage your team members and their roles</p>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <input type="checkbox" id="selectAll" class="rounded border-gray-300">
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
              Name ↕
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200" id="tableBody">
        </tbody>
      </table>
    </div>
    <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
      <div class="text-sm text-gray-700">
        Showing <span class="font-medium">1</span> to <span class="font-medium">5</span> of <span class="font-medium">50</span> results
      </div>
      <div class="flex gap-2">
        <button class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">Previous</button>
        <button class="px-3 py-1 text-sm border border-gray-300 rounded bg-blue-500 text-white">1</button>
        <button class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">2</button>
        <button class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">3</button>
        <button class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">Next</button>
      </div>
    </div>
  </div>
  <script>
    const users = [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', status: 'Active' },
      { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'Viewer', status: 'Inactive' },
      { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Editor', status: 'Active' },
      { id: 5, name: 'Charlie Davis', email: 'charlie@example.com', role: 'Viewer', status: 'Active' }
    ];

    const tbody = document.getElementById('tableBody');
    users.forEach(user => {
      const row = document.createElement('tr');
      row.className = 'hover:bg-gray-50';
      row.innerHTML = \`
        <td class="px-6 py-4 whitespace-nowrap">
          <input type="checkbox" class="rounded border-gray-300" data-id="\${user.id}">
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center">
            <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
              \${user.name.charAt(0)}
            </div>
            <div class="ml-4">
              <div class="text-sm font-medium text-gray-900">\${user.name}</div>
            </div>
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">\${user.email}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">\${user.role}</td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full \${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
            \${user.status}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <button class="text-blue-600 hover:text-blue-900 mr-3" onclick="editUser(\${user.id})">Edit</button>
          <button class="text-red-600 hover:text-red-900" onclick="deleteUser(\${user.id})">Delete</button>
        </td>
      \`;
      tbody.appendChild(row);
    });

    function editUser(id) {
      window.parent.postMessage({
        type: 'tool',
        payload: { toolName: 'editUser', params: { userId: id } }
      }, '*');
    }

    function deleteUser(id) {
      window.parent.postMessage({
        type: 'tool',
        payload: { toolName: 'deleteUser', params: { userId: id } }
      }, '*');
    }
  </script>
</body>
</html>`,
    },
    previewCode: `<table class="w-full">
  <thead>
    <tr><th>Name</th><th>Email</th><th>Role</th></tr>
  </thead>
  <tbody>
    <tr><td>John Doe</td><td>john@example.com</td><td>Admin</td></tr>
  </tbody>
</table>`,
  },
  {
    id: 'pricing-table',
    name: 'Pricing Table',
    description: 'Pricing comparison table with feature lists',
    category: 'Tables',
    content: {
      type: 'rawHtml',
      htmlString: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gradient-to-br from-purple-50 to-blue-50 p-8">
  <div class="max-w-7xl mx-auto">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
      <p class="text-lg text-gray-600">Select the perfect plan for your needs</p>
    </div>
    <div class="grid md:grid-cols-3 gap-8">
      <div class="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200 hover:border-blue-500 transition-all">
        <div class="text-center">
          <h3 class="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
          <div class="text-4xl font-bold text-gray-900 mb-1">$9<span class="text-lg text-gray-600">/mo</span></div>
          <p class="text-gray-600 mb-6">Perfect for individuals</p>
        </div>
        <ul class="space-y-4 mb-8">
          <li class="flex items-start">
            <svg class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span class="text-gray-700">Up to 10 projects</span>
          </li>
          <li class="flex items-start">
            <svg class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span class="text-gray-700">5GB storage</span>
          </li>
          <li class="flex items-start">
            <svg class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span class="text-gray-700">Basic support</span>
          </li>
        </ul>
        <button onclick="selectPlan('starter')" class="w-full py-3 px-6 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors">
          Get Started
        </button>
      </div>

      <div class="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-500 transform scale-105 relative">
        <div class="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-semibold">
          Popular
        </div>
        <div class="text-center">
          <h3 class="text-2xl font-bold text-gray-900 mb-2">Professional</h3>
          <div class="text-4xl font-bold text-gray-900 mb-1">$29<span class="text-lg text-gray-600">/mo</span></div>
          <p class="text-gray-600 mb-6">For growing teams</p>
        </div>
        <ul class="space-y-4 mb-8">
          <li class="flex items-start">
            <svg class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span class="text-gray-700">Unlimited projects</span>
          </li>
          <li class="flex items-start">
            <svg class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span class="text-gray-700">50GB storage</span>
          </li>
          <li class="flex items-start">
            <svg class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span class="text-gray-700">Priority support</span>
          </li>
          <li class="flex items-start">
            <svg class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span class="text-gray-700">Advanced analytics</span>
          </li>
        </ul>
        <button onclick="selectPlan('professional')" class="w-full py-3 px-6 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors">
          Get Started
        </button>
      </div>

      <div class="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200 hover:border-blue-500 transition-all">
        <div class="text-center">
          <h3 class="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
          <div class="text-4xl font-bold text-gray-900 mb-1">$99<span class="text-lg text-gray-600">/mo</span></div>
          <p class="text-gray-600 mb-6">For large organizations</p>
        </div>
        <ul class="space-y-4 mb-8">
          <li class="flex items-start">
            <svg class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span class="text-gray-700">Unlimited everything</span>
          </li>
          <li class="flex items-start">
            <svg class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span class="text-gray-700">500GB storage</span>
          </li>
          <li class="flex items-start">
            <svg class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span class="text-gray-700">24/7 dedicated support</span>
          </li>
          <li class="flex items-start">
            <svg class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span class="text-gray-700">Custom integrations</span>
          </li>
        </ul>
        <button onclick="selectPlan('enterprise')" class="w-full py-3 px-6 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors">
          Contact Sales
        </button>
      </div>
    </div>
  </div>
  <script>
    function selectPlan(plan) {
      window.parent.postMessage({
        type: 'tool',
        payload: { toolName: 'selectPlan', params: { plan } }
      }, '*');
    }
  </script>
</body>
</html>`,
    },
    previewCode: `<div class="pricing-card">
  <h3>Professional</h3>
  <div class="price">$29/mo</div>
  <ul>
    <li>✓ Unlimited projects</li>
    <li>✓ 50GB storage</li>
  </ul>
</div>`,
  },
];
