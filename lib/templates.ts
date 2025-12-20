import { Template } from './types';

export const templates: Template[] = [
  {
    id: 'external-dashboard',
    name: 'External Dashboard',
    description: 'Embed external analytics or monitoring dashboard',
    category: 'Dashboards',
    content: {
      type: 'externalUrl',
      iframeUrl: 'https://example.com/analytics'
    },
    previewCode: `{
  "type": "iframe",
  "props": {
    "url": "https://example.com/analytics"
  }
}`
  },
  {
    id: 'contact-form',
    name: 'Contact Form',
    description: 'A professional contact form with validation',
    category: 'Forms',
    content: {
      type: 'rawHtml',
      htmlString: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 2rem; background: #f8f9fa; }
    .form-container { max-width: 500px; margin: 0 auto; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    h1 { font-size: 1.5rem; margin-bottom: 0.5rem; color: #1a202c; }
    .description { color: #64748b; margin-bottom: 2rem; font-size: 0.875rem; }
    .form-group { margin-bottom: 1.5rem; }
    label { display: block; margin-bottom: 0.5rem; font-weight: 500; color: #334155; font-size: 0.875rem; }
    input, textarea { width: 100%; padding: 0.625rem 0.75rem; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.875rem; font-family: inherit; }
    input:focus, textarea:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
    textarea { resize: vertical; min-height: 100px; }
    button { width: 100%; padding: 0.625rem; background: #3b82f6; color: white; border: none; border-radius: 6px; font-weight: 500; cursor: pointer; font-size: 0.875rem; }
    button:hover { background: #2563eb; }
  </style>
</head>
<body>
  <div class="form-container">
    <h1>Contact Us</h1>
    <p class="description">Fill out the form below and we'll get back to you soon.</p>
    <form id="contactForm">
      <div class="form-group">
        <label for="name">Name *</label>
        <input type="text" id="name" name="name" placeholder="John Doe" required>
      </div>
      <div class="form-group">
        <label for="email">Email *</label>
        <input type="email" id="email" name="email" placeholder="john@example.com" required>
      </div>
      <div class="form-group">
        <label for="message">Message</label>
        <textarea id="message" name="message" placeholder="Your message here..."></textarea>
      </div>
      <button type="submit">Send Message</button>
    </form>
  </div>
  <script>
    document.getElementById('contactForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
      };
      window.parent.postMessage({
        type: 'tool',
        payload: {
          toolName: 'submitContactForm',
          params: formData
        }
      }, '*');
    });
  </script>
</body>
</html>`
    },
    previewCode: `<form id="contactForm">
  <h1>Contact Us</h1>
  <input type="text" placeholder="Name" required>
  <input type="email" placeholder="Email" required>
  <textarea placeholder="Message"></textarea>
  <button type="submit">Send</button>
</form>`
  },
  {
    id: 'login-form',
    name: 'Login Form',
    description: 'Simple login form with email and password',
    category: 'Forms',
    content: {
      type: 'rawHtml',
      htmlString: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .login-container { max-width: 400px; width: 100%; background: white; padding: 2.5rem; border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
    h1 { font-size: 1.75rem; margin-bottom: 0.5rem; color: #1a202c; text-align: center; }
    .description { color: #64748b; margin-bottom: 2rem; text-align: center; font-size: 0.875rem; }
    .form-group { margin-bottom: 1.5rem; }
    label { display: block; margin-bottom: 0.5rem; font-weight: 500; color: #334155; font-size: 0.875rem; }
    input { width: 100%; padding: 0.75rem 1rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.875rem; transition: all 0.2s; }
    input:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1); }
    .checkbox-group { display: flex; align-items: center; margin-bottom: 1.5rem; }
    .checkbox-group input[type="checkbox"] { width: auto; margin-right: 0.5rem; }
    .checkbox-group label { margin: 0; font-weight: normal; }
    button { width: 100%; padding: 0.75rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 0.875rem; transition: transform 0.2s; }
    button:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); }
    .link { display: block; text-align: center; margin-top: 1rem; color: #667eea; font-size: 0.875rem; text-decoration: none; }
  </style>
</head>
<body>
  <div class="login-container">
    <h1>Welcome Back</h1>
    <p class="description">Sign in to your account</p>
    <form id="loginForm">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" placeholder="you@example.com" required>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" placeholder="••••••••" required>
      </div>
      <div class="checkbox-group">
        <input type="checkbox" id="remember" name="remember">
        <label for="remember">Remember me</label>
      </div>
      <button type="submit">Sign In</button>
      <a href="#" class="link" onclick="event.preventDefault(); forgotPassword();">Forgot password?</a>
    </form>
  </div>
  <script>
    document.getElementById('loginForm').addEventListener('submit', (e) => {
      e.preventDefault();
      window.parent.postMessage({
        type: 'tool',
        payload: {
          toolName: 'login',
          params: {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            remember: document.getElementById('remember').checked
          }
        }
      }, '*');
    });
    function forgotPassword() {
      window.parent.postMessage({
        type: 'intent',
        payload: { intent: 'reset-password', params: {} }
      }, '*');
    }
  </script>
</body>
</html>`
    },
    previewCode: `<form id="loginForm">
  <h1>Welcome Back</h1>
  <input type="email" placeholder="you@example.com" required>
  <input type="password" placeholder="••••••••" required>
  <label><input type="checkbox"> Remember me</label>
  <button type="submit">Sign In</button>
</form>`
  }
];
