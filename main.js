/**
 * HIMOROGI - Main JavaScript
 * Scroll animations, header behavior, and interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initHeader();
    initScrollAnimations();
    initSmoothScroll();
    initHamburgerMenu();
});

/**
 * Header scroll behavior
 * Adds 'is-scrolled' class when page is scrolled
 */
function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    let lastScroll = 0;
    const scrollThreshold = 50;

    const handleScroll = () => {
        const currentScroll = window.scrollY;

        // Add/remove scrolled class
        if (currentScroll > scrollThreshold) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }

        lastScroll = currentScroll;
    };

    // Throttle scroll event
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial check
    handleScroll();
}

/**
 * Scroll-triggered fade-in animations
 * Uses Intersection Observer for performance
 */
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    if (fadeElements.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observerCallback = (entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation for multiple elements
                const delay = index * 100;
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Smooth scroll for internal links
 */
function initSmoothScroll() {
    const internalLinks = document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            const headerHeight = document.getElementById('header')?.offsetHeight || 0;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            closeMobileMenu();
        });
    });
}

/**
 * Mobile hamburger menu
 */
function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    const header = document.getElementById('header');

    if (!hamburger || !nav) return;

    hamburger.addEventListener('click', () => {
        const isOpen = hamburger.classList.contains('is-active');

        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!header.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });
}

function openMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');

    hamburger?.classList.add('is-active');
    nav?.classList.add('is-active');
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');

    hamburger?.classList.remove('is-active');
    nav?.classList.remove('is-active');
    document.body.style.overflow = '';
}

/**
 * Parallax effect for hero image (subtle)
 */
function initParallax() {
    const heroImg = document.querySelector('.hero__img');
    if (!heroImg) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                const rate = scrolled * 0.3;
                
                if (scrolled < window.innerHeight) {
                    heroImg.style.transform = `translateY(${rate}px) scale(1.1)`;
                }
                
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Initialize parallax after images load
window.addEventListener('load', () => {
    initParallax();
});
