/**
 * Sreelakshmi N S — DevOps & Linux Portfolio
 * Pure Vanilla JavaScript — Zero external libraries or frameworks
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Dynamic Footer Year
  // --------------------------------------------------------------------------
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // --------------------------------------------------------------------------
  // 2. Mobile Navigation Toggle & Drawer
  // --------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobileNavToggle');
  const mobileMenu = document.getElementById('mobileNavMenu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileToggle && mobileMenu) {
    const toggleMenu = (open) => {
      const isExpanded = open !== undefined ? open : mobileToggle.getAttribute('aria-expanded') !== 'true';
      mobileToggle.setAttribute('aria-expanded', String(isExpanded));
      if (isExpanded) {
        mobileMenu.removeAttribute('hidden');
      } else {
        mobileMenu.setAttribute('hidden', '');
      }
    };

    mobileToggle.addEventListener('click', () => {
      toggleMenu();
    });

    // Close when clicking mobile links
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggleMenu(false);
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileToggle.getAttribute('aria-expanded') === 'true') {
        toggleMenu(false);
        mobileToggle.focus();
      }
    });

    // Close if resized to desktop viewport
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && mobileToggle.getAttribute('aria-expanded') === 'true') {
        toggleMenu(false);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 3. Active Navigation Highlighting on Scroll (IntersectionObserver)
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-desktop .nav-link');

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -65% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          desktopNavLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${id}`) {
              link.classList.add('active');
            } else if (!link.classList.contains('nav-cta-link')) {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));
  }

  // --------------------------------------------------------------------------
  // 4. One-Click Copy Email with Toast Feedback
  // --------------------------------------------------------------------------
  const copyBtn = document.getElementById('btnCopyEmail');
  const toast = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMessage');
  const emailToCopy = 'sreelakshmins78@gmail.com';
  let toastTimer = null;

  const showToast = (message) => {
    if (!toast) return;
    if (toastMsg) toastMsg.textContent = message;
    toast.removeAttribute('hidden');
    // Force reflow for animation
    void toast.offsetWidth;
    toast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.setAttribute('hidden', '');
      }, 350);
    }, 3200);
  };

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(emailToCopy);
        } else {
          // Fallback for non-https or older browsers
          const textArea = document.createElement('textarea');
          textArea.value = emailToCopy;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }

        const copyTextEl = copyBtn.querySelector('.copy-text');
        if (copyTextEl) copyTextEl.textContent = 'Copied!';
        copyBtn.style.borderColor = 'var(--color-lavender)';
        copyBtn.style.color = 'var(--color-lavender-light)';

        showToast(`Email copied: ${emailToCopy}`);

        setTimeout(() => {
          if (copyTextEl) copyTextEl.textContent = 'Copy';
          copyBtn.style.borderColor = '';
          copyBtn.style.color = '';
        }, 2500);

      } catch (err) {
        showToast(`Could not copy automatically. Email: ${emailToCopy}`);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 5. Contact Form Validation & Informative Feedback
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const nameInput = document.getElementById('formName');
  const emailInput = document.getElementById('formEmail');
  const subjectInput = document.getElementById('formSubject');
  const messageInput = document.getElementById('formMessage');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');
  const formFeedback = document.getElementById('formFeedback');

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const clearErrors = () => {
    [nameInput, emailInput, messageInput].forEach(el => {
      if (el) el.classList.remove('is-invalid');
    });
    if (nameError) nameError.textContent = '';
    if (emailError) emailError.textContent = '';
    if (messageError) messageError.textContent = '';
  };

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();

      let isValid = true;
      const nameVal = nameInput ? nameInput.value.trim() : '';
      const emailVal = emailInput ? emailInput.value.trim() : '';
      const subjectVal = subjectInput ? subjectInput.value.trim() : 'Portfolio Inquiry';
      const messageVal = messageInput ? messageInput.value.trim() : '';

      // Validate Name
      if (!nameVal) {
        if (nameError) nameError.textContent = 'Please enter your name.';
        if (nameInput) nameInput.classList.add('is-invalid');
        isValid = false;
      }

      // Validate Email
      if (!emailVal) {
        if (emailError) emailError.textContent = 'Please enter your email address.';
        if (emailInput) emailInput.classList.add('is-invalid');
        isValid = false;
      } else if (!validateEmail(emailVal)) {
        if (emailError) emailError.textContent = 'Please enter a valid email address.';
        if (emailInput) emailInput.classList.add('is-invalid');
        isValid = false;
      }

      // Validate Message
      if (!messageVal) {
        if (messageError) messageError.textContent = 'Please write a brief message.';
        if (messageInput) messageInput.classList.add('is-invalid');
        isValid = false;
      } else if (messageVal.length < 10) {
        if (messageError) messageError.textContent = 'Message should be at least 10 characters long.';
        if (messageInput) messageInput.classList.add('is-invalid');
        isValid = false;
      }

      if (!isValid) {
        if (formFeedback) {
          formFeedback.removeAttribute('hidden');
          formFeedback.className = 'form-feedback error';
          formFeedback.textContent = 'Please check the required fields highlighted above.';
        }
        return;
      }

      // Valid Form Submission Simulation (Explaining client-side nature cleanly)
      if (formFeedback) {
        formFeedback.removeAttribute('hidden');
        formFeedback.className = 'form-feedback success';
        formFeedback.innerHTML = `
          <strong>Thank you, ${escapeHtml(nameVal)}!</strong><br>
          This is a static frontend website without a backend mail daemon. 
          To ensure direct delivery, <a href="mailto:${emailToCopy}?subject=${encodeURIComponent(subjectVal)}&body=${encodeURIComponent(messageVal + '\n\n— From: ' + nameVal + ' (' + emailVal + ')')}" style="text-decoration: underline; color: #fff; font-weight: bold;">click here to open in your mail client</a> or write directly to <code class="font-mono">${emailToCopy}</code>.
        `;
      }

      // Reset form
      contactForm.reset();
    });
  }

  // Helper to escape HTML characters
  function escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  // --------------------------------------------------------------------------
  // 6. Back-to-Top Button
  // --------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('btnBackToTop');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --------------------------------------------------------------------------
  // 7. Header Scroll Effect (Backdrop border enhancement)
  // --------------------------------------------------------------------------
  const siteHeader = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (siteHeader) {
      if (window.scrollY > 40) {
        siteHeader.style.borderBottomColor = 'rgba(185, 160, 255, 0.2)';
        siteHeader.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.45)';
      } else {
        siteHeader.style.borderBottomColor = 'var(--border-subtle)';
        siteHeader.style.boxShadow = 'none';
      }
    }
  }, { passive: true });

});
