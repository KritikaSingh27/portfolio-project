/**
 * Portfolio Main Script
 * Handles sticky header scroll state, accessible mobile navigation drawer,
 * and active section link highlighting via IntersectionObserver.
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNavigation();
  initActiveSectionSpy();
});

/**
 * Toggles a subtle elevation class on the sticky header after scrolling.
 */
function initStickyHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const updateHeaderState = () => {
    header.classList.toggle('site-header--scrolled', window.scrollY > 12);
  };

  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });
}

/**
 * Manages the responsive mobile hamburger menu with accessible ARIA states,
 * backdrop dismissal, Escape key handling, and viewport resize cleanup.
 */
function initMobileNavigation() {
  const toggleBtn = document.getElementById('nav-toggle');
  const navDrawer = document.getElementById('primary-nav');
  const backdrop = document.getElementById('nav-backdrop');
  if (!toggleBtn || !navDrawer || !backdrop) return;

  const navLinks = navDrawer.querySelectorAll('.primary-nav__link');
  const mobileBreakpoint = window.matchMedia('(max-width: 768px)');

  const setMenuOpen = (isOpen) => {
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
    toggleBtn.setAttribute(
      'aria-label',
      isOpen ? 'Close navigation menu' : 'Open navigation menu'
    );

    navDrawer.classList.toggle('primary-nav--open', isOpen);
    document.body.classList.toggle('nav-open', isOpen);
    backdrop.hidden = !isOpen;
  };

  const closeMenu = () => setMenuOpen(false);

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    setMenuOpen(!isExpanded);
  });

  backdrop.addEventListener('click', closeMenu);

  // Close drawer automatically after selecting a section link on mobile
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (mobileBreakpoint.matches) {
        closeMenu();
      }
    });
  });

  // Allow keyboard users to dismiss the drawer with Escape
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navDrawer.classList.contains('primary-nav--open')) {
      closeMenu();
      toggleBtn.focus();
    }
  });

  // Reset mobile drawer state if the viewport expands past the breakpoint
  mobileBreakpoint.addEventListener('change', (event) => {
    if (!event.matches) {
      closeMenu();
    }
  });
}

/**
 * Updates the active navigation link based on the section or footer currently in view.
 */
function initActiveSectionSpy() {
  const targets = document.querySelectorAll('main > section[id], footer[id]');
  const navLinks = document.querySelectorAll('.primary-nav__link[href^="#"]');
  if (!targets.length || !navLinks.length) return;

  const setActiveLink = (sectionId) => {
    navLinks.forEach((link) => {
      const isMatch = link.getAttribute('href') === `#${sectionId}`;
      link.classList.toggle('primary-nav__link--active', isMatch);
    });
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-30% 0px -45% 0px',
        threshold: 0,
      }
    );

    targets.forEach((target) => observer.observe(target));
  }

  // Highlight Contact when scrolled to the very bottom of the page
  window.addEventListener(
    'scroll',
    () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 24;
      if (nearBottom) {
        setActiveLink('contact');
      }
    },
    { passive: true }
  );

  // Update active state immediately when clicking any navigation link
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const targetId = link.getAttribute('href').slice(1);
      setActiveLink(targetId);
    });
  });
}
