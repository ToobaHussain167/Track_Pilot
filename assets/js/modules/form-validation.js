

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function showFieldError(fieldWrapper) {
  fieldWrapper.classList.add('has-error');
}

function clearFieldError(fieldWrapper) {
  fieldWrapper.classList.remove('has-error');
}

export function initContactForm() {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return; // Not on the contact page, stop here.

  const successBanner = document.querySelector('[data-form-success]');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    let isValid = true;

    const nameWrapper = form.querySelector('[data-field="name"]');
    const emailWrapper = form.querySelector('[data-field="email"]');
    const messageWrapper = form.querySelector('[data-field="message"]');

    if (form.elements.name.value.trim() === '') {
      showFieldError(nameWrapper);
      isValid = false;
    } else {
      clearFieldError(nameWrapper);
    }

    if (!EMAIL_PATTERN.test(form.elements.email.value.trim())) {
      showFieldError(emailWrapper);
      isValid = false;
    } else {
      clearFieldError(emailWrapper);
    }

    if (form.elements.message.value.trim() === '') {
      showFieldError(messageWrapper);
      isValid = false;
    } else {
      clearFieldError(messageWrapper);
    }

    if (!isValid) return;

    /* Bootstrap's "d-none" utility class hides the banner in the HTML
       by default; removing it here is what makes it visible. */
    successBanner.classList.remove('d-none');
    form.reset();
  });
}
