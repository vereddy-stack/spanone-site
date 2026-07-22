// SpanOne static site — shared behavior
// 1) Mobile nav toggle
// 2) Forms open a pre-filled email to support@spanone.com (no backend/service required)

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

  // Mailto forms
  document.querySelectorAll('form[data-mailto]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var to = form.getAttribute('data-mailto');
      var subject = form.getAttribute('data-subject') || 'New inquiry from spanone.com';

      var lines = [];
      form.querySelectorAll('[data-field]').forEach(function (field) {
        var label = field.getAttribute('data-field');
        var value = '';

        if (field.type === 'checkbox') {
          return; // handled in a grouped pass below
        }
        value = field.value ? field.value.trim() : '';
        if (value) lines.push(label + ': ' + value);
      });

      // Group checkboxes by shared name into one line
      var groups = {};
      form.querySelectorAll('input[type="checkbox"][data-field]').forEach(function (cb) {
        var label = cb.getAttribute('data-field');
        if (!groups[label]) groups[label] = [];
        if (cb.checked) groups[label].push(cb.value);
      });
      Object.keys(groups).forEach(function (label) {
        if (groups[label].length) lines.push(label + ': ' + groups[label].join(', '));
      });

      var body = lines.join('\n');
      var mailtoUrl = 'mailto:' + encodeURIComponent(to) +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      window.location.href = mailtoUrl;

      var status = form.querySelector('.form-status');
      if (status) {
        status.textContent = 'Opening your email app with this information filled in — just hit send.';
        status.classList.add('show');
      }
    });
  });
});
