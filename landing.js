/* FitTrack Landing Page JavaScript - Interactive & Animated Features */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
  initScrollReveals();
  initCounterAnimations();
  initSmoothScroll();
});

/**
 * Navbar background shadow & blur on scroll
 */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check
}

/**
 * Mobile Hamburger Navigation Toggle
 */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-open');
    const isOpen = navLinks.classList.contains('mobile-open');
    hamburger.setAttribute('aria-expanded', isOpen);
    hamburger.innerHTML = isOpen ? '✕' : '☰';
  });

  // Close mobile menu when clicking a link
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('mobile-open');
      hamburger.innerHTML = '☰';
    });
  });
}

/**
 * Scroll Reveal Animations using IntersectionObserver
 */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  if (!('IntersectionObserver' in window)) {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('active'));
    return;
  }

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Handle stagger delay if data-delay attribute is present
        const delay = entry.target.getAttribute('data-delay') || 0;
        setTimeout(() => {
          entry.target.classList.add('active');
        }, parseInt(delay, 10));

        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

/**
 * Animated Stat Counters when entering viewport
 */
function initCounterAnimations() {
  const counterElements = document.querySelectorAll('.counter-value');
  if (!counterElements.length) return;

  let hasAnimated = false;

  const animateCounters = () => {
    counterElements.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
      const prefix = counter.getAttribute('data-prefix') || '';
      const suffix = counter.getAttribute('data-suffix') || '';
      const duration = 2000; // ms
      const frameRate = 1000 / 60; // 60fps
      const totalFrames = Math.round(duration / frameRate);
      let currentFrame = 0;

      const timer = setInterval(() => {
        currentFrame++;
        const progress = currentFrame / totalFrames;
        // Ease-out quad formula
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(easeProgress * target);

        counter.textContent = `${prefix}${currentValue}${suffix}`;

        if (currentFrame >= totalFrames) {
          counter.textContent = `${prefix}${target}${suffix}`;
          clearInterval(timer);
        }
      }, frameRate);
    });
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        animateCounters();
        obs.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('#stats') || document.querySelector('.stats-section');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/**
 * Smooth Scroll for internal anchor links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
