import { Template } from '../types';

export const chatgptSdkTemplates: Template[] = [
  {
    id: 'chatgpt-todo',
    name: 'Todo List Widget',
    description: 'Task management widget with add, complete, and delete functionality',
    category: 'ChatGPT SDK',
    content: {
      type: 'rawHtml',
      htmlString: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-white p-6">
  <div class="max-w-2xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">My Tasks</h1>
      <p class="text-sm text-gray-600">Manage your daily tasks efficiently</p>
    </div>
    
    <div class="mb-6">
      <div class="flex gap-2">
        <input 
          type="text" 
          id="taskInput" 
          placeholder="Add a new task..." 
          class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onkeypress="if(event.key==='Enter') addTask()"
        >
        <button 
          onclick="addTask()" 
          class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
        >
          Add
        </button>
      </div>
    </div>

    <div id="taskList" class="space-y-2">
      <!-- Tasks will be rendered here -->
    </div>

    <div class="mt-6 flex items-center justify-between text-sm text-gray-600">
      <span id="taskCount">0 tasks</span>
      <button onclick="clearCompleted()" class="text-red-600 hover:text-red-700">Clear completed</button>
    </div>
  </div>

  <script>
    let tasks = [
      { id: 1, text: 'Buy groceries', completed: false },
      { id: 2, text: 'Finish project report', completed: false },
      { id: 3, text: 'Call dentist', completed: true }
    ];

    function render() {
      const list = document.getElementById('taskList');
      list.innerHTML = '';
      
      tasks.forEach(task => {
        const item = document.createElement('div');
        item.className = \`flex items-center gap-3 p-3 bg-gray-50 rounded-lg \${task.completed ? 'opacity-50' : ''}\`;
        item.innerHTML = \`
          <input 
            type="checkbox" 
            \${task.completed ? 'checked' : ''} 
            onchange="toggleTask(\${task.id})"
            class="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
          >
          <span class="\${task.completed ? 'line-through' : ''} flex-1 text-gray-900">\${task.text}</span>
          <button 
            onclick="deleteTask(\${task.id})" 
            class="text-red-600 hover:text-red-700"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        \`;
        list.appendChild(item);
      });

      document.getElementById('taskCount').textContent = \`\${tasks.length} task\${tasks.length !== 1 ? 's' : ''}\`;
    }

    function addTask() {
      const input = document.getElementById('taskInput');
      const text = input.value.trim();
      if (!text) return;

      const newTask = {
        id: Date.now(),
        text: text,
        completed: false
      };
      tasks.push(newTask);
      input.value = '';
      render();

      window.parent.postMessage({
        type: 'tool',
        payload: { toolName: 'addTask', params: { task: text } }
      }, '*');
    }

    function toggleTask(id) {
      const task = tasks.find(t => t.id === id);
      if (task) {
        task.completed = !task.completed;
        render();
        window.parent.postMessage({
          type: 'tool',
          payload: { toolName: 'toggleTask', params: { id, completed: task.completed } }
        }, '*');
      }
    }

    function deleteTask(id) {
      tasks = tasks.filter(t => t.id !== id);
      render();
      window.parent.postMessage({
        type: 'tool',
        payload: { toolName: 'deleteTask', params: { id } }
      }, '*');
    }

    function clearCompleted() {
      const completedIds = tasks.filter(t => t.completed).map(t => t.id);
      tasks = tasks.filter(t => !t.completed);
      render();
      window.parent.postMessage({
        type: 'tool',
        payload: { toolName: 'clearCompletedTasks', params: { ids: completedIds } }
      }, '*');
    }

    render();
  </script>
</body>
</html>`,
    },
    previewCode: `// Todo widget with state management
const [tasks, setTasks] = useState([]);

function addTask(text) {
  window.parent.postMessage({
    type: 'tool',
    payload: { toolName: 'addTask', params: { task: text } }
  }, '*');
}`,
  },
  {
    id: 'chatgpt-button',
    name: 'Interactive Button',
    description: 'Simple button widget demonstrating tool calls',
    category: 'ChatGPT SDK',
    content: {
      type: 'rawHtml',
      htmlString: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 p-8 flex items-center justify-center min-h-screen">
  <div class="text-center">
    <h2 class="text-xl font-semibold text-gray-900 mb-4">Button Widget Example</h2>
    <p class="text-gray-600 mb-6">Click the button to trigger a tool call</p>
    
    <button 
      id="actionButton"
      onclick="handleClick()" 
      class="px-8 py-4 bg-blue-500 text-white text-lg font-semibold rounded-lg hover:bg-blue-600 active:transform active:scale-95 transition-all shadow-lg hover:shadow-xl"
    >
      Click Me!
    </button>

    <div id="status" class="mt-4 text-sm text-gray-500"></div>
  </div>

  <script>
    let clickCount = 0;

    function handleClick() {
      clickCount++;
      const status = document.getElementById('status');
      status.textContent = \`Clicked \${clickCount} time\${clickCount !== 1 ? 's' : ''}\`;

      window.parent.postMessage({
        type: 'tool',
        payload: { 
          toolName: 'buttonClicked', 
          params: { 
            clickCount,
            timestamp: new Date().toISOString()
          } 
        }
      }, '*');
    }
  </script>
</body>
</html>`,
    },
    previewCode: `<button onclick="handleClick()">
  Click Me!
</button>

<script>
function handleClick() {
  window.parent.postMessage({
    type: 'tool',
    payload: { toolName: 'buttonClicked', params: { ... } }
  }, '*');
}
</script>`,
  },
  {
    id: 'chatgpt-input-field',
    name: 'Input Field Widget',
    description: 'Text input with validation and submission',
    category: 'ChatGPT SDK',
    content: {
      type: 'rawHtml',
      htmlString: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-white p-6">
  <div class="max-w-md mx-auto">
    <h2 class="text-xl font-bold text-gray-900 mb-4">User Input</h2>
    
    <div class="space-y-4">
      <div>
        <label for="username" class="block text-sm font-medium text-gray-700 mb-2">Username</label>
        <input 
          type="text" 
          id="username" 
          placeholder="Enter your username"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
      </div>

      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <input 
          type="email" 
          id="email" 
          placeholder="you@example.com"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
      </div>

      <div>
        <label for="message" class="block text-sm font-medium text-gray-700 mb-2">Message</label>
        <textarea 
          id="message" 
          rows="4"
          placeholder="Type your message here..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        ></textarea>
      </div>

      <button 
        onclick="submitForm()" 
        class="w-full px-4 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
      >
        Submit
      </button>
    </div>

    <div id="feedback" class="mt-4 hidden p-3 rounded-lg"></div>
  </div>

  <script>
    function submitForm() {
      const username = document.getElementById('username').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      const feedback = document.getElementById('feedback');

      // Simple validation
      if (!username || !email || !message) {
        feedback.className = 'mt-4 p-3 rounded-lg bg-red-50 text-red-700';
        feedback.textContent = 'Please fill in all fields';
        feedback.classList.remove('hidden');
        return;
      }

      if (!email.includes('@')) {
        feedback.className = 'mt-4 p-3 rounded-lg bg-red-50 text-red-700';
        feedback.textContent = 'Please enter a valid email';
        feedback.classList.remove('hidden');
        return;
      }

      feedback.className = 'mt-4 p-3 rounded-lg bg-green-50 text-green-700';
      feedback.textContent = 'Form submitted successfully!';
      feedback.classList.remove('hidden');

      window.parent.postMessage({
        type: 'tool',
        payload: { 
          toolName: 'submitUserInput', 
          params: { username, email, message } 
        }
      }, '*');

      // Clear form
      setTimeout(() => {
        document.getElementById('username').value = '';
        document.getElementById('email').value = '';
        document.getElementById('message').value = '';
        feedback.classList.add('hidden');
      }, 2000);
    }
  </script>
</body>
</html>`,
    },
    previewCode: `<input id="username" placeholder="Enter username">
<input type="email" id="email" placeholder="Email">
<textarea id="message"></textarea>
<button onclick="submitForm()">Submit</button>

<script>
function submitForm() {
  const data = { username, email, message };
  window.parent.postMessage({
    type: 'tool',
    payload: { toolName: 'submitUserInput', params: data }
  }, '*');
}
</script>`,
  },
  {
    id: 'chatgpt-selection-list',
    name: 'Selection List',
    description: 'Scrollable list with single or multiple selection',
    category: 'ChatGPT SDK',
    content: {
      type: 'rawHtml',
      htmlString: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-white p-6">
  <div class="max-w-2xl mx-auto">
    <div class="mb-4">
      <h2 class="text-xl font-bold text-gray-900">Select Your Preferences</h2>
      <p class="text-sm text-gray-600 mt-1">Choose one or more options</p>
    </div>

    <div class="mb-4 flex gap-2">
      <button 
        onclick="setMode('single')" 
        id="singleBtn"
        class="px-4 py-2 text-sm font-medium border rounded-lg bg-blue-500 text-white"
      >
        Single Select
      </button>
      <button 
        onclick="setMode('multiple')" 
        id="multipleBtn"
        class="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-50"
      >
        Multiple Select
      </button>
    </div>

    <div class="border border-gray-200 rounded-lg overflow-hidden">
      <div id="itemList" class="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        <!-- Items will be rendered here -->
      </div>
    </div>

    <div class="mt-4 flex justify-between items-center">
      <span id="selectedCount" class="text-sm text-gray-600">0 selected</span>
      <button 
        onclick="confirmSelection()" 
        class="px-6 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600"
      >
        Confirm
      </button>
    </div>
  </div>

  <script>
    let mode = 'single';
    const items = [
      { id: 1, name: 'Option 1', description: 'First available option' },
      { id: 2, name: 'Option 2', description: 'Second choice available' },
      { id: 3, name: 'Option 3', description: 'Third option to select' },
      { id: 4, name: 'Option 4', description: 'Fourth selection' },
      { id: 5, name: 'Option 5', description: 'Fifth alternative' },
      { id: 6, name: 'Option 6', description: 'Sixth possibility' }
    ];
    let selected = new Set();

    function render() {
      const list = document.getElementById('itemList');
      list.innerHTML = '';

      items.forEach(item => {
        const div = document.createElement('div');
        div.className = \`p-4 hover:bg-gray-50 cursor-pointer \${selected.has(item.id) ? 'bg-blue-50 border-l-4 border-blue-500' : ''}\`;
        div.onclick = () => toggleItem(item.id);
        div.innerHTML = \`
          <div class="flex items-center">
            <div class="flex-1">
              <h3 class="font-medium text-gray-900">\${item.name}</h3>
              <p class="text-sm text-gray-500">\${item.description}</p>
            </div>
            \${selected.has(item.id) ? '<svg class="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>' : ''}
          </div>
        \`;
        list.appendChild(div);
      });

      document.getElementById('selectedCount').textContent = \`\${selected.size} selected\`;
    }

    function setMode(newMode) {
      mode = newMode;
      selected.clear();
      document.getElementById('singleBtn').className = mode === 'single' 
        ? 'px-4 py-2 text-sm font-medium border rounded-lg bg-blue-500 text-white'
        : 'px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-50';
      document.getElementById('multipleBtn').className = mode === 'multiple' 
        ? 'px-4 py-2 text-sm font-medium border rounded-lg bg-blue-500 text-white'
        : 'px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-50';
      render();
    }

    function toggleItem(id) {
      if (mode === 'single') {
        selected.clear();
        selected.add(id);
      } else {
        if (selected.has(id)) {
          selected.delete(id);
        } else {
          selected.add(id);
        }
      }
      render();
    }

    function confirmSelection() {
      const selectedItems = items.filter(item => selected.has(item.id));
      window.parent.postMessage({
        type: 'tool',
        payload: { 
          toolName: 'itemsSelected', 
          params: { 
            mode,
            items: selectedItems
          } 
        }
      }, '*');
    }

    render();
  </script>
</body>
</html>`,
    },
    previewCode: `// Selection list with single/multiple mode
const items = [...];
let selected = new Set();

function toggleItem(id) {
  if (mode === 'single') {
    selected = new Set([id]);
  } else {
    selected.has(id) ? selected.delete(id) : selected.add(id);
  }
}`,
  },
  {
    id: 'chatgpt-carousel',
    name: 'Image Carousel',
    description: 'Swipeable image carousel with navigation',
    category: 'ChatGPT SDK',
    content: {
      type: 'rawHtml',
      htmlString: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 p-6">
  <div class="max-w-3xl mx-auto">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Photo Gallery</h2>
    
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="relative">
        <div id="carousel" class="overflow-hidden">
          <div id="carouselTrack" class="flex transition-transform duration-300 ease-in-out">
            <!-- Slides will be added here -->
          </div>
        </div>

        <button 
          onclick="prevSlide()" 
          class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg"
        >
          <svg class="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button 
          onclick="nextSlide()" 
          class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg"
        >
          <svg class="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div class="p-6">
        <h3 id="slideTitle" class="text-xl font-semibold text-gray-900 mb-2"></h3>
        <p id="slideDescription" class="text-gray-600 mb-4"></p>
        
        <div class="flex justify-center gap-2">
          <div id="indicators" class="flex gap-2">
            <!-- Indicators will be added here -->
          </div>
        </div>
      </div>
    </div>
  </div>

  <script>
    const slides = [
      {
        id: 1,
        image: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&h=500&fit=crop',
        title: 'Beautiful Landscape',
        description: 'A stunning view of nature at its finest'
      },
      {
        id: 2,
        image: 'https://images.unsplash.com/photo-1682687221073-3fc785a80283?w=800&h=500&fit=crop',
        title: 'Modern Architecture',
        description: 'Contemporary design and structure'
      },
      {
        id: 3,
        image: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?w=800&h=500&fit=crop',
        title: 'Urban City',
        description: 'The pulse of metropolitan life'
      },
      {
        id: 4,
        image: 'https://images.unsplash.com/photo-1682687220795-796d3f6f7000?w=800&h=500&fit=crop',
        title: 'Ocean Sunset',
        description: 'Peaceful evening by the sea'
      }
    ];

    let currentSlide = 0;

    function render() {
      const track = document.getElementById('carouselTrack');
      const indicators = document.getElementById('indicators');
      
      track.innerHTML = '';
      indicators.innerHTML = '';

      slides.forEach((slide, index) => {
        const slideDiv = document.createElement('div');
        slideDiv.className = 'w-full flex-shrink-0';
        slideDiv.innerHTML = \`
          <img src="\${slide.image}" alt="\${slide.title}" class="w-full h-[400px] object-cover">
        \`;
        track.appendChild(slideDiv);

        const indicator = document.createElement('button');
        indicator.className = \`w-2 h-2 rounded-full \${index === currentSlide ? 'bg-blue-500 w-8' : 'bg-gray-300'}\`;
        indicator.onclick = () => goToSlide(index);
        indicators.appendChild(indicator);
      });

      track.style.transform = \`translateX(-\${currentSlide * 100}%)\`;
      updateInfo();
    }

    function updateInfo() {
      document.getElementById('slideTitle').textContent = slides[currentSlide].title;
      document.getElementById('slideDescription').textContent = slides[currentSlide].description;
    }

    function prevSlide() {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      render();
      notifyChange();
    }

    function nextSlide() {
      currentSlide = (currentSlide + 1) % slides.length;
      render();
      notifyChange();
    }

    function goToSlide(index) {
      currentSlide = index;
      render();
      notifyChange();
    }

    function notifyChange() {
      window.parent.postMessage({
        type: 'tool',
        payload: { 
          toolName: 'carouselChanged', 
          params: { 
            currentSlide: currentSlide,
            slideId: slides[currentSlide].id,
            title: slides[currentSlide].title
          } 
        }
      }, '*');
    }

    render();
  </script>
</body>
</html>`,
    },
    previewCode: `// Carousel with navigation
let currentSlide = 0;

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  updateCarousel();
  window.parent.postMessage({
    type: 'tool',
    payload: { toolName: 'carouselChanged', params: {...} }
  }, '*');
}`,
  },
];
