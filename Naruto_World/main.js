import { init } from './app-core.js';

init().catch(err => {
  console.error('Failed to initialize application:', err);
  document.body.innerHTML = `<div style="color:red;padding:20px;">Failed to load: ${err.message}</div>`;
});

