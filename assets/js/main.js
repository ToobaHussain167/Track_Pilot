

import { initDashboard } from './modules/board.js';
import { initContactForm } from './modules/form-validation.js';

document.addEventListener('DOMContentLoaded', () => {
  initDashboard();
  initContactForm();
});
