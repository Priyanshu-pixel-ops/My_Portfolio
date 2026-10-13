/**
 * PRIYANSHU — PERSONAL PORTFOLIO JAVASCRIPT
 * B.Tech ECE | Semiconductor & Chip Design
 * Plain Vanilla JavaScript — Zero external dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 1. DYNAMIC CURRENT YEAR IN FOOTER
  // =========================================================================
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // =========================================================================
  // 2. ACCESSIBLE ROLE ROTATOR / TYPEWRITER IN HERO
  // =========================================================================
  const roleRotator = document.getElementById('role-rotator');
  const roles = [
    'ECE Student',
    'Embedded Systems Learner',
    'Aspiring Semiconductor Engineer'
  ];

  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (roleRotator && !prefersReducedMotion) {
    let currentRoleIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function typeEffect() {
      const currentRole = roles[currentRoleIndex];

      if (isDeleting) {
        currentCharIndex--;
        roleRotator.textContent = currentRole.substring(0, currentCharIndex);
        typeSpeed = 45;
      } else {
        currentCharIndex++;
        roleRotator.textContent = currentRole.substring(0, currentCharIndex);
        typeSpeed = 95;
      }

      if (!isDeleting && currentCharIndex === currentRole.length) {
        // Pause at full word
        typeSpeed = 2200;
        isDeleting = true;
      } else if (isDeleting && currentCharIndex === 0) {
        // Finished deleting, move to next role
        isDeleting = false;
        currentRoleIndex = (currentRoleIndex + 1) % roles.length;
        typeSpeed = 400;
      }

      setTimeout(typeEffect, typeSpeed);
    }

    // Initiate typewriter
    setTimeout(typeEffect, 600);
  } else if (roleRotator) {
    // If reduced motion is preferred, static default
    roleRotator.textContent = roles[0];
  }

  // =========================================================================
  // 3. MOBILE NAVIGATION HAMBURGER MENU
  // =========================================================================
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  function openMobileMenu() {
    if (!menuToggle || !mainNav) return;
    menuToggle.setAttribute('aria-expanded', 'true');
    mainNav.classList.add('is-open');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  function closeMobileMenu() {
    if (!menuToggle || !mainNav) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    mainNav.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close menu when clicking on any navigation link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close menu when pressing Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('is-open')) {
        closeMobileMenu();
        menuToggle.focus();
      }
    });

    // Close menu if resized above mobile breakpoint (768px)
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && mainNav.classList.contains('is-open')) {
        closeMobileMenu();
      }
    });
  }

  // =========================================================================
  // 4. ACTIVE NAVIGATION LINK ON SCROLL (IntersectionObserver)
  // =========================================================================
  const sections = document.querySelectorAll('section[id]');

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  // =========================================================================
  // 5. BACK TO TOP BUTTON
  // =========================================================================
  const backToTopBtn = document.getElementById('back-to-top');

  if (backToTopBtn) {
    const toggleBackToTop = () => {
      if (window.scrollY > 380) {
        backToTopBtn.classList.add('is-visible');
      } else {
        backToTopBtn.classList.remove('is-visible');
      }
    };

    window.addEventListener('scroll', toggleBackToTop, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });
  }

  // =========================================================================
  // 6. CONTACT FORM VALIDATION & CLIENT-SIDE EMAIL PREPARATION
  // =========================================================================
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');
  const formFeedback = document.getElementById('form-feedback');
  const copyMsgBtn = document.getElementById('btn-copy-msg');

  // Error label containers
  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const subjectError = document.getElementById('subject-error');
  const messageError = document.getElementById('message-error');

  // Recipient email address
  const recipientEmail = 'priyanshu.ece.jecrc@example.com';

  function validateEmail(email) {
    // Robust simple regex for email format
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function clearErrors() {
    if (nameError) nameError.textContent = '';
    if (emailError) emailError.textContent = '';
    if (subjectError) subjectError.textContent = '';
    if (messageError) messageError.textContent = '';

    [nameInput, emailInput, subjectInput, messageInput].forEach((input) => {
      if (input) input.classList.remove('is-invalid');
    });

    if (formFeedback) {
      formFeedback.className = 'form-status-feedback';
      formFeedback.textContent = '';
    }
  }

  function validateForm() {
    let isValid = true;
    clearErrors();

    // Validate Name
    if (!nameInput.value.trim()) {
      if (nameError) nameError.textContent = 'Please enter your name.';
      nameInput.classList.add('is-invalid');
      isValid = false;
    }

    // Validate Email
    if (!emailInput.value.trim()) {
      if (emailError) emailError.textContent = 'Please enter your email address.';
      emailInput.classList.add('is-invalid');
      isValid = false;
    } else if (!validateEmail(emailInput.value.trim())) {
      if (emailError) emailError.textContent = 'Please enter a valid email address.';
      emailInput.classList.add('is-invalid');
      isValid = false;
    }

    // Validate Subject
    if (!subjectInput.value.trim()) {
      if (subjectError) subjectError.textContent = 'Please enter a subject.';
      subjectInput.classList.add('is-invalid');
      isValid = false;
    }

    // Validate Message
    if (!messageInput.value.trim()) {
      if (messageError) messageError.textContent = 'Please enter your message.';
      messageInput.classList.add('is-invalid');
      isValid = false;
    } else if (messageInput.value.trim().length < 10) {
      if (messageError) messageError.textContent = 'Message should be at least 10 characters.';
      messageInput.classList.add('is-invalid');
      isValid = false;
    }

    return isValid;
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!validateForm()) {
        if (formFeedback) {
          formFeedback.className = 'form-status-feedback error';
          formFeedback.textContent = 'Please correct the highlighted fields above.';
        }
        return;
      }

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const subject = subjectInput.value.trim();
      const message = messageInput.value.trim();

      // Construct prefilled mailto link
      const emailSubject = encodeURIComponent(`[Portfolio Inquiry] ${subject}`);
      const emailBody = encodeURIComponent(
        `Hi Priyanshu,\n\n${message}\n\n---\nSender: ${name}\nContact Email: ${email}`
      );

      const mailtoUrl = `mailto:${recipientEmail}?subject=${emailSubject}&body=${emailBody}`;

      if (formFeedback) {
        formFeedback.className = 'form-status-feedback info';
        formFeedback.textContent = 'Opening your email client with your pre-filled message...';
      }

      // Trigger the mail client
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 350);
    });
  }

  // Copy Message to Clipboard Helper
  if (copyMsgBtn) {
    copyMsgBtn.addEventListener('click', () => {
      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const subject = subjectInput ? subjectInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      if (!message) {
        if (formFeedback) {
          formFeedback.className = 'form-status-feedback error';
          formFeedback.textContent = 'Please type a message in the textarea before copying.';
        }
        if (messageInput) messageInput.focus();
        return;
      }

      const fullText = `Subject: [Portfolio Inquiry] ${subject || 'General Inquiry'}\nFrom: ${name || 'Visitor'} (${email || 'Not specified'})\nTo: Priyanshu (${recipientEmail})\n\nMessage:\n${message}`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(fullText)
          .then(() => {
            if (formFeedback) {
              formFeedback.className = 'form-status-feedback success';
              formFeedback.textContent = '✓ Message text copied to clipboard! You can paste it directly into Gmail or Outlook.';
            }
          })
          .catch(() => {
            fallbackCopy(fullText);
          });
      } else {
        fallbackCopy(fullText);
      }
    });
  }

  function fallbackCopy(text) {
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = text;
    tempTextArea.style.position = 'fixed';
    tempTextArea.style.left = '-9999px';
    document.body.appendChild(tempTextArea);
    tempTextArea.focus();
    tempTextArea.select();

    try {
      const successful = document.execCommand('copy');
      if (formFeedback) {
        if (successful) {
          formFeedback.className = 'form-status-feedback success';
          formFeedback.textContent = '✓ Message text copied to clipboard! You can paste it directly into your email provider.';
        } else {
          formFeedback.className = 'form-status-feedback error';
          formFeedback.textContent = 'Could not automatically copy. Please select and copy the text manually.';
        }
      }
    } catch (err) {
      if (formFeedback) {
        formFeedback.className = 'form-status-feedback error';
        formFeedback.textContent = 'Clipboard access denied by browser.';
      }
    }

    document.body.removeChild(tempTextArea);
  }
});
