/* global document, window */
(function () {
  'use strict';

  // ── Set current year in footer ──────────────────────────────────────────────
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Mobile navigation toggle ─────────────────────────────────────────────────
  var navToggle = document.querySelector('.nav-toggle');
  var siteNav   = document.querySelector('.site-nav');

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = siteNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close nav when a link is clicked
    siteNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        siteNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ── Booking form: client-side validation + success message ───────────────────
  var form       = document.getElementById('booking-form');
  var successMsg = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var valid = true;

      // Clear previous error states
      form.querySelectorAll('.error').forEach(function (el) {
        el.classList.remove('error');
      });

      // Required fields
      ['name', 'email', 'event-type', 'event-date'].forEach(function (fieldId) {
        var el = document.getElementById(fieldId);
        if (el && !el.value.trim()) {
          el.classList.add('error');
          valid = false;
        }
      });

      // Email format check
      var emailEl = document.getElementById('email');
      if (emailEl && emailEl.value.trim()) {
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailEl.value.trim())) {
          emailEl.classList.add('error');
          valid = false;
        }
      }

      if (!valid) {
        // Scroll to first error
        var firstError = form.querySelector('.error');
        if (firstError) {
          firstError.focus();
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Show success message and reset form
      form.reset();
      if (successMsg) {
        successMsg.hidden = false;
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  // ── Sticky header: add shadow on scroll ──────────────────────────────────────
  var header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 10) {
        header.style.boxShadow = '0 4px 20px rgba(0,0,0,.12)';
      } else {
        header.style.boxShadow = '';
      }
    }, { passive: true });
  }

  // ── Simple scroll-reveal: fade in sections as they enter the viewport ─────────
  var revealEls = document.querySelectorAll(
    '.feature-card, .service-card, .gallery-item, .pricing-card, .testimonial-card'
  );

  if ('IntersectionObserver' in window && revealEls.length) {
    // Set initial invisible state via inline style (avoid FOUC with CSS)
    revealEls.forEach(function (el) {
      el.style.opacity  = '0';
      el.style.transform = el.style.transform
        ? el.style.transform + ' translateY(20px)'
        : 'translateY(20px)';
      el.style.transition = 'opacity .5s ease, transform .5s ease';
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity   = '1';
          entry.target.style.transform = entry.target.style.transform.replace('translateY(20px)', '');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealEls.forEach(function (el) { observer.observe(el); });
  }

  // ── Enforce future dates for the event date picker ────────────────────────────
  var dateInput = document.getElementById('event-date');
  if (dateInput) {
    var today = new Date();
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var dd = String(today.getDate()).padStart(2, '0');
    dateInput.min = today.getFullYear() + '-' + mm + '-' + dd;
  }

}());
