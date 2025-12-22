import { Template } from '../types';

export const chartTemplates: Template[] = [
  {
    id: 'sales-chart',
    name: 'Sales Chart',
    description: 'Interactive sales data visualization with Chart.js',
    category: 'Charts',
    content: {
      type: 'rawHtml',
      htmlString: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body class="bg-gray-50 p-8">
  <div class="max-w-6xl mx-auto">
    <div class="bg-white rounded-lg shadow-lg p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Sales Analytics</h2>
          <p class="text-sm text-gray-600 mt-1">Monthly revenue trends for 2024</p>
        </div>
        <div class="flex gap-2">
          <button onclick="changeView('week')" class="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">Week</button>
          <button onclick="changeView('month')" class="px-4 py-2 text-sm border rounded-lg bg-blue-500 text-white">Month</button>
          <button onclick="changeView('year')" class="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">Year</button>
        </div>
      </div>
      <div class="relative h-96">
        <canvas id="salesChart"></canvas>
      </div>
    </div>
  </div>
  <script>
    const ctx = document.getElementById('salesChart').getContext('2d');
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Revenue',
          data: [12000, 19000, 15000, 25000, 22000, 30000, 28000, 35000, 32000, 38000, 42000, 45000],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '$' + value.toLocaleString();
              }
            }
          }
        },
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            const month = chart.data.labels[index];
            const value = chart.data.datasets[0].data[index];
            window.parent.postMessage({
              type: 'tool',
              payload: {
                toolName: 'viewMonthDetails',
                params: { month, value }
              }
            }, '*');
          }
        }
      }
    });

    function changeView(period) {
      window.parent.postMessage({
        type: 'tool',
        payload: { toolName: 'changePeriod', params: { period } }
      }, '*');
    }
  </script>
</body>
</html>`,
    },
    previewCode: `<canvas id="salesChart"></canvas>
<script>
  new Chart(ctx, {
    type: 'line',
    data: { labels: ['Jan', 'Feb', ...], datasets: [...] }
  });
</script>`,
  },
  {
    id: 'analytics-dashboard',
    name: 'Analytics Dashboard',
    description: 'Comprehensive dashboard with multiple chart types',
    category: 'Charts',
    content: {
      type: 'rawHtml',
      htmlString: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body class="bg-gray-50 p-8">
  <div class="max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Analytics Dashboard</h1>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Revenue by Category</h3>
        <div class="relative h-64">
          <canvas id="pieChart"></canvas>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Monthly Performance</h3>
        <div class="relative h-64">
          <canvas id="barChart"></canvas>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Growth Trend</h3>
      <div class="relative h-80">
        <canvas id="lineChart"></canvas>
      </div>
    </div>
  </div>
  <script>
    // Pie Chart
    const pieCtx = document.getElementById('pieChart').getContext('2d');
    new Chart(pieCtx, {
      type: 'doughnut',
      data: {
        labels: ['Electronics', 'Clothing', 'Food', 'Books', 'Other'],
        datasets: [{
          data: [35, 25, 20, 12, 8],
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(251, 191, 36, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(139, 92, 246, 0.8)'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right'
          }
        },
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            window.parent.postMessage({
              type: 'tool',
              payload: { toolName: 'viewCategory', params: { category: index } }
            }, '*');
          }
        }
      }
    });

    // Bar Chart
    const barCtx = document.getElementById('barChart').getContext('2d');
    new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [{
          label: 'Sales',
          data: [65, 78, 90, 81],
          backgroundColor: 'rgba(59, 130, 246, 0.8)'
        }, {
          label: 'Target',
          data: [70, 75, 85, 90],
          backgroundColor: 'rgba(16, 185, 129, 0.8)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    // Line Chart
    const lineCtx = document.getElementById('lineChart').getContext('2d');
    new Chart(lineCtx, {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
        datasets: [{
          label: 'Users',
          data: [1200, 1900, 1500, 2100, 2400, 2800],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true
        }, {
          label: 'Sessions',
          data: [2400, 3200, 2800, 3500, 4100, 4600],
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            position: 'top'
          }
        }
      }
    });
  </script>
</body>
</html>`,
    },
    previewCode: `<div class="dashboard">
  <canvas id="pieChart"></canvas>
  <canvas id="barChart"></canvas>
  <canvas id="lineChart"></canvas>
</div>`,
  },
];
