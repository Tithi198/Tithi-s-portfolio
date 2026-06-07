// Main website interactions
// Responsive-safe navigation, carousel, animations, and form handling.
document.addEventListener('DOMContentLoaded', () => {
    setCurrentYear();
    initNavigation();
    initTypingEffect();
    initSkillBars();
    initCarousel();
    initContactForm();
    initScrollAnimations();
    initServices();
    initScrollToTop();
    initThemeToggle();
    initHeroParallax();
});

function setCurrentYear() {
    const currentYear = document.getElementById('currentYear');
    if (currentYear) currentYear.textContent = new Date().getFullYear();
}

function getHeaderOffset() {
    const header = document.querySelector('header');
    return header ? header.offsetHeight + 12 : 80;
}

function initNavigation() {
    const header = document.querySelector('header');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a[href^="#"]');
    const sections = [...document.querySelectorAll('main section[id]')];

    if (!hamburger || !navLinks) return;

    hamburger.setAttribute('role', 'button');
    hamburger.setAttribute('tabindex', '0');
    hamburger.setAttribute('aria-label', 'Toggle navigation menu');
    hamburger.setAttribute('aria-expanded', 'false');

    const openMenu = () => {
        hamburger.classList.add('active');
        navLinks.classList.add('active');
        document.body.classList.add('menu-open');
        hamburger.setAttribute('aria-expanded', 'true');
    };

    const closeMenu = () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.classList.remove('menu-open');
        hamburger.setAttribute('aria-expanded', 'false');
    };

    const toggleMenu = () => {
        navLinks.classList.contains('active') ? closeMenu() : openMenu();
    };

    hamburger.addEventListener('click', toggleMenu);
    hamburger.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleMenu();
        }
    });

    document.addEventListener('click', (event) => {
        if (!navLinks.classList.contains('active')) return;
        if (!navLinks.contains(event.target) && !hamburger.contains(event.target)) closeMenu();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', debounce(() => {
        if (window.innerWidth > 768) closeMenu();
    }, 150));

    links.forEach((link) => {
        link.addEventListener('click', (event) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (!target) return;

            event.preventDefault();
            closeMenu();

            window.scrollTo({
                top: target.offsetTop - getHeaderOffset(),
                behavior: 'smooth'
            });
        });
    });

    const updateHeader = () => {
        if (!header) return;
        header.classList.toggle('scrolled', window.scrollY > 60);
    };

    const updateActiveLink = () => {
        if (!sections.length || !links.length) return;
        const currentPosition = window.scrollY + getHeaderOffset() + 40;
        let activeId = sections[0].id;

        sections.forEach((section) => {
            if (section.offsetTop <= currentPosition) activeId = section.id;
        });

        links.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`);
        });
    };

    updateHeader();
    updateActiveLink();

    window.addEventListener('scroll', throttle(() => {
        updateHeader();
        updateActiveLink();
    }, 100), { passive: true });
}

function initTypingEffect() {
    const typedNameElement = document.getElementById('typed-name');
    if (!typedNameElement) return;

    const nameText = 'Marzana Rahman';
    const cursor = document.querySelector('.typing-cursor');
    let charIndex = 0;

    typedNameElement.textContent = '';
    if (cursor) cursor.style.animation = 'none';

    const typeCharacter = () => {
        if (charIndex < nameText.length) {
            typedNameElement.textContent += nameText.charAt(charIndex);
            charIndex += 1;
            window.setTimeout(typeCharacter, 95);
        } else if (cursor) {
            cursor.style.animation = 'blink 1s infinite';
        }
    };

    window.setTimeout(typeCharacter, 650);
}

function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-level');
    if (!skillBars.length) return;

    const fillBar = (bar) => {
        const width = Number(bar.getAttribute('data-width')) || 0;
        bar.style.width = `${Math.min(Math.max(width, 0), 100)}%`;
    };

    if (!('IntersectionObserver' in window)) {
        skillBars.forEach(fillBar);
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                fillBar(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.35 });

    skillBars.forEach((bar) => observer.observe(bar));
}

function initCarousel() {
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicatorsContainer = document.getElementById('indicators');

    if (!track || !prevBtn || !nextBtn || !indicatorsContainer) return;

    const projects = [...track.querySelectorAll('.project-card')];
    if (!projects.length) return;

    let currentIndex = 0;
    let itemsPerView = getItemsPerView();
    let autoSlideId = null;
    let touchStartX = 0;

    function getItemsPerView() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }

    function getMaxIndex() {
        return Math.max(0, projects.length - itemsPerView);
    }

    function clampIndex(index) {
        return Math.min(Math.max(index, 0), getMaxIndex());
    }

    function buildIndicators() {
        indicatorsContainer.innerHTML = '';
        const indicatorCount = getMaxIndex() + 1;

        for (let index = 0; index < indicatorCount; index += 1) {
            const indicator = document.createElement('button');
            indicator.type = 'button';
            indicator.className = 'indicator';
            indicator.setAttribute('aria-label', `Go to project slide ${index + 1}`);
            indicator.addEventListener('click', () => goToSlide(index));
            indicatorsContainer.appendChild(indicator);
        }
    }

    function updateCarousel() {
        itemsPerView = getItemsPerView();
        currentIndex = clampIndex(currentIndex);

        const targetProject = projects[currentIndex];
        const offset = targetProject ? targetProject.offsetLeft : 0;
        track.style.transform = `translateX(-${offset}px)`;

        indicatorsContainer.querySelectorAll('.indicator').forEach((indicator, index) => {
            const isActive = index === currentIndex;
            indicator.classList.toggle('active', isActive);
            indicator.setAttribute('aria-current', isActive ? 'true' : 'false');
        });
    }

    function goToSlide(index) {
        currentIndex = clampIndex(index);
        updateCarousel();
    }

    function nextSlide() {
        currentIndex = currentIndex >= getMaxIndex() ? 0 : currentIndex + 1;
        updateCarousel();
    }

    function prevSlide() {
        currentIndex = currentIndex <= 0 ? getMaxIndex() : currentIndex - 1;
        updateCarousel();
    }

    function startAutoSlide() {
        stopAutoSlide();
        autoSlideId = window.setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
        if (autoSlideId) window.clearInterval(autoSlideId);
        autoSlideId = null;
    }

    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    track.addEventListener('mouseenter', stopAutoSlide);
    track.addEventListener('mouseleave', startAutoSlide);
    track.addEventListener('focusin', stopAutoSlide);
    track.addEventListener('focusout', startAutoSlide);

    track.addEventListener('touchstart', (event) => {
        touchStartX = event.touches[0].clientX;
        stopAutoSlide();
    }, { passive: true });

    track.addEventListener('touchend', (event) => {
        const touchEndX = event.changedTouches[0].clientX;
        const difference = touchStartX - touchEndX;

        if (Math.abs(difference) > 45) {
            difference > 0 ? nextSlide() : prevSlide();
        }

        startAutoSlide();
    }, { passive: true });

    window.addEventListener('resize', debounce(() => {
        const newItemsPerView = getItemsPerView();
        if (newItemsPerView !== itemsPerView) buildIndicators();
        updateCarousel();
    }, 150));

    buildIndicators();
    updateCarousel();
    startAutoSlide();
}

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!validateForm(contactForm)) return;

        alert('Thank you for your message! I will get back to you soon.');
        contactForm.reset();
    });
}

function validateForm(form) {
    const fields = [...form.querySelectorAll('input, textarea')];
    let isValid = true;

    fields.forEach((field) => {
        const value = field.value.trim();
        const existingError = field.parentElement.querySelector('.error-message');
        if (existingError) existingError.remove();
        field.classList.remove('error');

        if (!value) {
            showFieldError(field, 'This field is required');
            isValid = false;
            return;
        }

        if (field.type === 'email') {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(value)) {
                showFieldError(field, 'Please enter a valid email address');
                isValid = false;
            }
        }

        if (field.type === 'text' && value.length < 2) {
            showFieldError(field, 'Name must be at least 2 characters long');
            isValid = false;
        }

        if (field.tagName === 'TEXTAREA' && value.length < 10) {
            showFieldError(field, 'Message must be at least 10 characters long');
            isValid = false;
        }
    });

    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '0.85rem';
    errorDiv.style.marginTop = '6px';

    field.parentElement.appendChild(errorDiv);
}

function initScrollAnimations() {
    const sections = document.querySelectorAll('section');
    if (!sections.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) entry.target.classList.add('animate');
        });
    }, { threshold: 0.1 });

    sections.forEach((section) => observer.observe(section));
}

function initServices() {
    const servicesSection = document.querySelector('.services');
    const serviceCards = document.querySelectorAll('.service-card');
    if (!servicesSection || !serviceCards.length) return;

    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (canHover) {
        serviceCards.forEach((card) => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    if (!('IntersectionObserver' in window)) return;

    serviceCards.forEach((card) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            serviceCards.forEach((card, index) => {
                window.setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 160);
            });

            observer.unobserve(entry.target);
        });
    }, { threshold: 0.25 });

    observer.observe(servicesSection);
}

function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    if (!scrollToTopBtn) return;

    const updateButton = () => {
        scrollToTopBtn.classList.toggle('is-visible', window.scrollY > 320);
    };

    updateButton();

    window.addEventListener('scroll', throttle(updateButton, 100), { passive: true });
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') document.body.classList.add('dark-theme');

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    });
}

function initHeroParallax() {
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');
    const allowMotion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const desktopOnly = window.matchMedia('(min-width: 993px)');

    if (!heroContent || !heroImage || !allowMotion) return;

    let ticking = false;

    const updateParallax = () => {
        if (!desktopOnly.matches) {
            heroContent.style.transform = '';
            heroImage.style.transform = '';
            ticking = false;
            return;
        }

        const scrolled = window.scrollY;
        const rate = Math.min(scrolled * -0.12, 0);
        heroContent.style.transform = `translateY(${rate}px)`;
        heroImage.style.transform = `translateY(${rate * 0.7}px)`;
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });

    window.addEventListener('resize', debounce(updateParallax, 150));
}

function debounce(callback, delay = 150) {
    let timeoutId;
    return (...args) => {
        window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => callback(...args), delay);
    };
}

function throttle(callback, limit = 100) {
    let waiting = false;
    return (...args) => {
        if (waiting) return;
        callback(...args);
        waiting = true;
        window.setTimeout(() => {
            waiting = false;
        }, limit);
    };
}
