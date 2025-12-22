import { Template } from '../types';

export const cardTemplates: Template[] = [
  {
    id: 'product-cards',
    name: 'Product Cards',
    description: 'E-commerce product cards with images and actions',
    category: 'Cards',
    content: {
      type: 'rawHtml',
      htmlString: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 p-8">
  <div class="max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Featured Products</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="productGrid">
    </div>
  </div>
  <script>
    const products = [
      {
        id: 1,
        name: 'Wireless Headphones',
        price: 99.99,
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop',
        badge: 'Best Seller'
      },
      {
        id: 2,
        name: 'Smart Watch Pro',
        price: 299.99,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop',
        badge: 'New'
      },
      {
        id: 3,
        name: 'Laptop Stand',
        price: 49.99,
        rating: 4.3,
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=200&fit=crop',
        badge: null
      }
    ];

    const grid = document.getElementById('productGrid');
    products.forEach(product => {
      const card = document.createElement('div');
      card.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300';
      card.innerHTML = \`
        <div class="relative">
          <img src="\${product.image}" alt="\${product.name}" class="w-full h-48 object-cover">
          \${product.badge ? \`<span class="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">\${product.badge}</span>\` : ''}
          <button onclick="addToWishlist(\${product.id})" class="absolute top-2 left-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </button>
        </div>
        <div class="p-4">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">\${product.name}</h3>
          <div class="flex items-center mb-3">
            <div class="flex items-center">
              \${Array(5).fill(0).map((_, i) => \`
                <svg class="w-4 h-4 \${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              \`).join('')}
            </div>
            <span class="ml-2 text-sm text-gray-600">\${product.rating}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-2xl font-bold text-gray-900">$\${product.price}</span>
            <button onclick="addToCart(\${product.id})" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
              Add to Cart
            </button>
          </div>
        </div>
      \`;
      grid.appendChild(card);
    });

    function addToCart(id) {
      window.parent.postMessage({
        type: 'tool',
        payload: { toolName: 'addToCart', params: { productId: id } }
      }, '*');
    }

    function addToWishlist(id) {
      window.parent.postMessage({
        type: 'tool',
        payload: { toolName: 'addToWishlist', params: { productId: id } }
      }, '*');
    }
  </script>
</body>
</html>`,
    },
    previewCode: `<div class="product-card">
  <img src="..." alt="Product">
  <h3>Wireless Headphones</h3>
  <div class="rating">⭐⭐⭐⭐⭐ 4.5</div>
  <span class="price">$99.99</span>
  <button>Add to Cart</button>
</div>`,
  },
  {
    id: 'stats-cards',
    name: 'Statistics Cards',
    description: 'Dashboard statistics cards with icons and trends',
    category: 'Cards',
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
  <div class="max-w-7xl mx-auto">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Overview</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 font-medium">Total Revenue</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">$45,231</p>
          </div>
          <div class="bg-blue-100 rounded-full p-3">
            <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <span class="text-green-600 font-semibold">↑ 12.5%</span>
          <span class="text-gray-600 ml-2">vs last month</span>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 font-medium">Active Users</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">2,847</p>
          </div>
          <div class="bg-green-100 rounded-full p-3">
            <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <span class="text-green-600 font-semibold">↑ 8.2%</span>
          <span class="text-gray-600 ml-2">vs last month</span>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 font-medium">Total Orders</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">1,423</p>
          </div>
          <div class="bg-purple-100 rounded-full p-3">
            <svg class="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <span class="text-red-600 font-semibold">↓ 3.1%</span>
          <span class="text-gray-600 ml-2">vs last month</span>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 font-medium">Conversion Rate</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">3.24%</p>
          </div>
          <div class="bg-orange-100 rounded-full p-3">
            <svg class="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <span class="text-green-600 font-semibold">↑ 5.7%</span>
          <span class="text-gray-600 ml-2">vs last month</span>
        </div>
      </div>
    </div>
  </div>
  <script>
    document.querySelectorAll('.bg-white').forEach((card, index) => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => {
        const metrics = ['revenue', 'users', 'orders', 'conversion'];
        window.parent.postMessage({
          type: 'tool',
          payload: { toolName: 'viewDetails', params: { metric: metrics[index] } }
        }, '*');
      });
    });
  </script>
</body>
</html>`,
    },
    previewCode: `<div class="stats-card">
  <div class="icon">💰</div>
  <h3>Total Revenue</h3>
  <p class="value">$45,231</p>
  <span class="trend">↑ 12.5%</span>
</div>`,
  },
];
