import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';

import './index.css';
import './common/styles.css';

import { render } from 'preact';
import { App } from './app';

if (location.pathname === '/index.html') {
  history.replaceState(null, '', '/');
}

document.body.setAttribute('data-bs-theme', 'dark');
render(<App />, document.getElementById('app')!);