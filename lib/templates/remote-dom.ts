import { Template } from '../types';

export const remoteDomTemplates: Template[] = [
  {
    id: 'remote-dom-card',
    name: 'Remote DOM Card',
    description: 'Interactive card component using Remote DOM with Tailwind-style classes',
    category: 'Remote DOM',
    content: {
      type: 'remoteDom',
      script: `// Create a card component with Remote DOM
const card = document.createElement('ui-card');
card.setAttribute('class', 'bg-white rounded-lg shadow-lg p-6 max-w-md');

const title = document.createElement('ui-heading');
title.setAttribute('level', '2');
title.setAttribute('class', 'text-xl font-bold text-gray-900 mb-2');
title.textContent = 'Product Title';

const description = document.createElement('ui-text');
description.setAttribute('class', 'text-gray-600 mb-4');
description.textContent = 'This is a beautiful product card built with Remote DOM. Click the button to interact!';

const price = document.createElement('ui-text');
price.setAttribute('class', 'text-2xl font-bold text-blue-600 mb-4');
price.textContent = '$99.99';

const button = document.createElement('ui-button');
button.setAttribute('label', 'Add to Cart');
button.setAttribute('variant', 'primary');
button.setAttribute('class', 'w-full');
button.addEventListener('press', () => {
  window.parent.postMessage({ 
    type: 'tool', 
    payload: { 
      toolName: 'addToCart', 
      params: { productId: 123, price: 99.99 } 
    } 
  }, '*');
});

card.appendChild(title);
card.appendChild(description);
card.appendChild(price);
card.appendChild(button);
root.appendChild(card);`,
      framework: 'react',
    },
    previewCode: `const card = document.createElement('ui-card');
const button = document.createElement('ui-button');
button.setAttribute('label', 'Add to Cart');
button.addEventListener('press', () => {
  window.parent.postMessage({ 
    type: 'tool', 
    payload: { toolName: 'addToCart', params: {...} } 
  }, '*');
});
card.appendChild(button);
root.appendChild(card);`,
  },
  {
    id: 'remote-dom-form',
    name: 'Remote DOM Form',
    description: 'Form with input fields built using Remote DOM',
    category: 'Remote DOM',
    content: {
      type: 'remoteDom',
      script: `// Create a form with Remote DOM components
const container = document.createElement('ui-stack');
container.setAttribute('spacing', '4');
container.setAttribute('class', 'p-6 max-w-md bg-white rounded-lg shadow');

const heading = document.createElement('ui-heading');
heading.setAttribute('level', '2');
heading.setAttribute('class', 'text-2xl font-bold text-gray-900 mb-4');
heading.textContent = 'Contact Form';

const nameInput = document.createElement('ui-input');
nameInput.setAttribute('id', 'name');
nameInput.setAttribute('placeholder', 'Your name');
nameInput.setAttribute('label', 'Name');

const emailInput = document.createElement('ui-input');
emailInput.setAttribute('id', 'email');
emailInput.setAttribute('type', 'email');
emailInput.setAttribute('placeholder', 'you@example.com');
emailInput.setAttribute('label', 'Email');

const messageInput = document.createElement('ui-textarea');
messageInput.setAttribute('id', 'message');
messageInput.setAttribute('placeholder', 'Your message');
messageInput.setAttribute('label', 'Message');
messageInput.setAttribute('rows', '4');

const submitButton = document.createElement('ui-button');
submitButton.setAttribute('label', 'Submit');
submitButton.setAttribute('variant', 'primary');
submitButton.addEventListener('press', () => {
  window.parent.postMessage({
    type: 'tool',
    payload: {
      toolName: 'submitContactForm',
      params: {
        name: nameInput.value || 'Not provided',
        email: emailInput.value || 'Not provided',
        message: messageInput.value || 'Not provided'
      }
    }
  }, '*');
});

container.appendChild(heading);
container.appendChild(nameInput);
container.appendChild(emailInput);
container.appendChild(messageInput);
container.appendChild(submitButton);
root.appendChild(container);`,
      framework: 'react',
    },
    previewCode: `const nameInput = document.createElement('ui-input');
nameInput.setAttribute('placeholder', 'Your name');

const submitButton = document.createElement('ui-button');
submitButton.addEventListener('press', () => {
  window.parent.postMessage({
    type: 'tool',
    payload: { toolName: 'submitForm', params: {...} }
  }, '*');
});`,
  },
  {
    id: 'remote-dom-list',
    name: 'Remote DOM List',
    description: 'Dynamic list with clickable items using Remote DOM',
    category: 'Remote DOM',
    content: {
      type: 'remoteDom',
      script: `// Create a list component with Remote DOM
const container = document.createElement('ui-stack');
container.setAttribute('spacing', '2');
container.setAttribute('class', 'p-6 bg-white rounded-lg shadow-lg max-w-2xl');

const title = document.createElement('ui-heading');
title.setAttribute('level', '2');
title.setAttribute('class', 'text-xl font-bold text-gray-900 mb-4');
title.textContent = 'My List Items';

const items = [
  { id: 1, title: 'First Item', description: 'Description for first item' },
  { id: 2, title: 'Second Item', description: 'Description for second item' },
  { id: 3, title: 'Third Item', description: 'Description for third item' },
  { id: 4, title: 'Fourth Item', description: 'Description for fourth item' }
];

container.appendChild(title);

items.forEach(item => {
  const listItem = document.createElement('ui-list-item');
  listItem.setAttribute('class', 'p-4 hover:bg-gray-50 cursor-pointer rounded-lg border border-gray-200');
  
  const itemTitle = document.createElement('ui-text');
  itemTitle.setAttribute('class', 'font-semibold text-gray-900');
  itemTitle.textContent = item.title;
  
  const itemDesc = document.createElement('ui-text');
  itemDesc.setAttribute('class', 'text-sm text-gray-600');
  itemDesc.textContent = item.description;
  
  listItem.appendChild(itemTitle);
  listItem.appendChild(itemDesc);
  
  listItem.addEventListener('click', () => {
    window.parent.postMessage({
      type: 'tool',
      payload: {
        toolName: 'itemClicked',
        params: { id: item.id, title: item.title }
      }
    }, '*');
  });
  
  container.appendChild(listItem);
});

root.appendChild(container);`,
      framework: 'react',
    },
    previewCode: `const items = [...];
items.forEach(item => {
  const listItem = document.createElement('ui-list-item');
  listItem.addEventListener('click', () => {
    window.parent.postMessage({
      type: 'tool',
      payload: { toolName: 'itemClicked', params: item }
    }, '*');
  });
  container.appendChild(listItem);
});`,
  },
  {
    id: 'remote-dom-grid',
    name: 'Remote DOM Grid',
    description: 'Grid layout with cards using Remote DOM components',
    category: 'Remote DOM',
    content: {
      type: 'remoteDom',
      script: `// Create a grid layout with Remote DOM
const container = document.createElement('ui-stack');
container.setAttribute('class', 'p-6 bg-gray-50');

const title = document.createElement('ui-heading');
title.setAttribute('level', '1');
title.setAttribute('class', 'text-2xl font-bold text-gray-900 mb-6');
title.textContent = 'Product Grid';

const grid = document.createElement('ui-grid');
grid.setAttribute('columns', '3');
grid.setAttribute('gap', '4');
grid.setAttribute('class', 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6');

const products = [
  { id: 1, name: 'Product A', price: '$29', color: 'blue' },
  { id: 2, name: 'Product B', price: '$39', color: 'green' },
  { id: 3, name: 'Product C', price: '$49', color: 'purple' },
  { id: 4, name: 'Product D', price: '$59', color: 'red' },
  { id: 5, name: 'Product E', price: '$69', color: 'yellow' },
  { id: 6, name: 'Product F', price: '$79', color: 'pink' }
];

products.forEach(product => {
  const card = document.createElement('ui-card');
  card.setAttribute('class', 'bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6');
  
  const productName = document.createElement('ui-heading');
  productName.setAttribute('level', '3');
  productName.setAttribute('class', 'text-lg font-semibold text-gray-900 mb-2');
  productName.textContent = product.name;
  
  const productPrice = document.createElement('ui-text');
  productPrice.setAttribute('class', 'text-xl font-bold text-\${product.color}-600 mb-4');
  productPrice.textContent = product.price;
  
  const buyButton = document.createElement('ui-button');
  buyButton.setAttribute('label', 'Buy Now');
  buyButton.setAttribute('variant', 'primary');
  buyButton.setAttribute('size', 'sm');
  buyButton.addEventListener('press', () => {
    window.parent.postMessage({
      type: 'tool',
      payload: {
        toolName: 'buyProduct',
        params: { productId: product.id, name: product.name, price: product.price }
      }
    }, '*');
  });
  
  card.appendChild(productName);
  card.appendChild(productPrice);
  card.appendChild(buyButton);
  grid.appendChild(card);
});

container.appendChild(title);
container.appendChild(grid);
root.appendChild(container);`,
      framework: 'react',
    },
    previewCode: `const grid = document.createElement('ui-grid');
grid.setAttribute('columns', '3');

products.forEach(product => {
  const card = document.createElement('ui-card');
  const button = document.createElement('ui-button');
  button.addEventListener('press', () => {
    window.parent.postMessage({...});
  });
  card.appendChild(button);
  grid.appendChild(card);
});`,
  },
  {
    id: 'remote-dom-tabs',
    name: 'Remote DOM Tabs',
    description: 'Tabbed interface using Remote DOM components',
    category: 'Remote DOM',
    content: {
      type: 'remoteDom',
      script: `// Create tabs with Remote DOM
const container = document.createElement('ui-stack');
container.setAttribute('class', 'p-6 bg-white rounded-lg shadow-lg max-w-3xl');

const title = document.createElement('ui-heading');
title.setAttribute('level', '2');
title.setAttribute('class', 'text-2xl font-bold text-gray-900 mb-6');
title.textContent = 'Settings Panel';

const tabs = document.createElement('ui-tabs');
tabs.setAttribute('class', 'w-full');

// Tab 1: Profile
const tab1 = document.createElement('ui-tab-panel');
tab1.setAttribute('label', 'Profile');
const tab1Content = document.createElement('ui-text');
tab1Content.setAttribute('class', 'text-gray-700');
tab1Content.textContent = 'Profile settings and preferences go here.';
tab1.appendChild(tab1Content);

// Tab 2: Security
const tab2 = document.createElement('ui-tab-panel');
tab2.setAttribute('label', 'Security');
const tab2Content = document.createElement('ui-text');
tab2Content.setAttribute('class', 'text-gray-700');
tab2Content.textContent = 'Security and privacy settings.';
tab2.appendChild(tab2Content);

// Tab 3: Notifications
const tab3 = document.createElement('ui-tab-panel');
tab3.setAttribute('label', 'Notifications');
const tab3Content = document.createElement('ui-text');
tab3Content.setAttribute('class', 'text-gray-700');
tab3Content.textContent = 'Notification preferences and alerts.';
const notifyButton = document.createElement('ui-button');
notifyButton.setAttribute('label', 'Test Notification');
notifyButton.setAttribute('class', 'mt-4');
notifyButton.addEventListener('press', () => {
  window.parent.postMessage({
    type: 'tool',
    payload: {
      toolName: 'sendTestNotification',
      params: { timestamp: new Date().toISOString() }
    }
  }, '*');
});
tab3.appendChild(tab3Content);
tab3.appendChild(notifyButton);

tabs.appendChild(tab1);
tabs.appendChild(tab2);
tabs.appendChild(tab3);

tabs.addEventListener('change', (e) => {
  window.parent.postMessage({
    type: 'tool',
    payload: {
      toolName: 'tabChanged',
      params: { tabIndex: e.detail.selectedIndex }
    }
  }, '*');
});

container.appendChild(title);
container.appendChild(tabs);
root.appendChild(container);`,
      framework: 'react',
    },
    previewCode: `const tabs = document.createElement('ui-tabs');

const tab1 = document.createElement('ui-tab-panel');
tab1.setAttribute('label', 'Profile');
tab1.textContent = 'Profile content';

tabs.appendChild(tab1);
tabs.addEventListener('change', (e) => {
  window.parent.postMessage({
    type: 'tool',
    payload: { toolName: 'tabChanged', params: {...} }
  }, '*');
});`,
  },
  {
    id: 'remote-dom-modal',
    name: 'Remote DOM Modal',
    description: 'Modal dialog with Remote DOM components',
    category: 'Remote DOM',
    content: {
      type: 'remoteDom',
      script: `// Create a modal trigger and dialog with Remote DOM
const container = document.createElement('ui-stack');
container.setAttribute('spacing', '4');
container.setAttribute('class', 'p-6 bg-white rounded-lg shadow');

const title = document.createElement('ui-heading');
title.setAttribute('level', '2');
title.setAttribute('class', 'text-xl font-bold text-gray-900 mb-4');
title.textContent = 'Modal Example';

const description = document.createElement('ui-text');
description.setAttribute('class', 'text-gray-600 mb-4');
description.textContent = 'Click the button to open a modal dialog.';

const openButton = document.createElement('ui-button');
openButton.setAttribute('label', 'Open Modal');
openButton.setAttribute('variant', 'primary');
openButton.addEventListener('press', () => {
  window.parent.postMessage({
    type: 'tool',
    payload: {
      toolName: 'openModal',
      params: {
        title: 'Confirm Action',
        message: 'Are you sure you want to proceed?',
        actions: ['Cancel', 'Confirm']
      }
    }
  }, '*');
});

const infoText = document.createElement('ui-text');
infoText.setAttribute('class', 'text-sm text-gray-500 mt-4');
infoText.textContent = 'Modal will trigger a tool call when opened.';

container.appendChild(title);
container.appendChild(description);
container.appendChild(openButton);
container.appendChild(infoText);
root.appendChild(container);`,
      framework: 'react',
    },
    previewCode: `const openButton = document.createElement('ui-button');
openButton.setAttribute('label', 'Open Modal');
openButton.addEventListener('press', () => {
  window.parent.postMessage({
    type: 'tool',
    payload: {
      toolName: 'openModal',
      params: { title: 'Confirm', message: '...' }
    }
  }, '*');
});`,
  },
];
