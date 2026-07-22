// SpanOne static site — shared behavior
// 1) Mobile nav toggle
// 2) Forms submit silently via EmailJS (Service: service_va9nicd, Template: template_uc4ttxa)

const EMAILJS_PUBLIC_KEY = 'S4hdLNx3RECe8Ut4N';
const EMAILJS_SERVICE_ID = 'service_va9nicd';
const EMAILJS_TEMPLATE_ID = 'template_uc4ttxa';

if (window.emailjs) {
  window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var header = document.querySelector('header.site');
  if (toggle && header) {
    toggle.addEventListener('click', function () {
      header.classList.toggle('open');
      var expanded = header.classList.contains('open');
      toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });
  }

  // Highlight active nav link
  var here = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav.main-nav a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === here || (here === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // EmailJS forms — submit silently, no email app opens
  document.querySelectorAll('form[data-emailjs-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Honeypot: if a hidden bot-only field got filled in, pretend success and stop.
      var honeypot = form.querySelector('[name="_honeypot"]');
      if (honeypot && honeypot.value) {
        showStatus(form, 'Thank you! We will be in touch with you soon.');
        form.reset();
        return;
      }

      var formLabel = form.getAttribute('data-form-name') || 'New inquiry';
      var nameValue = '';
      var emailValue = '';
      var lines = [];

      form.querySelectorAll('[data-field]').forEach(function (field) {
        if (field.type === 'checkbox') return; // handled in the grouped pass below
        var label = field.getAttribute('data-field');
        var value = field.value ? field.value.trim() : '';
        if (!value) return;
        lines.push(label + ': ' + value);
        if (label === 'Name') nameValue = value;
        if (label === 'Email') emailValue = value;
      });

      var groups = {};
      form.querySelectorAll('input[type="checkbox"][data-field]').forEach(function (cb) {
        var label = cb.getAttribute('data-field');
        if (!groups[label]) groups[label] = [];
        if (cb.checked) groups[label].push(cb.value);
      });
      Object.keys(groups).forEach(function (label) {
        if (groups[label].length) lines.push(label + ': ' + groups[label].join(', '));
      });

      if (!window.emailjs) {
        showStatus(form, 'Something went wrong loading the form. Please call us instead at 1-408-641-6636.');
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending...'; }

      window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        name: nameValue || 'Website visitor',
        email: emailValue,
        message: formLabel + '\n\n' + lines.join('\n'),
      }).then(function () {
        showStatus(form, 'Thank you! We will be in touch with you soon.');
        form.reset();
      }).catch(function (err) {
        console.error('EmailJS error:', err);
        showStatus(form, 'Something went wrong sending your message. Please call us instead at 1-408-641-6636 or email spanoneinc@gmail.com directly.');
      }).finally(function () {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Submit'; }
      });
    });
  });

  function showStatus(form, text) {
    var status = form.querySelector('.form-status');
    if (status) {
      status.textContent = text;
      status.classList.add('show');
    }
  }
});
