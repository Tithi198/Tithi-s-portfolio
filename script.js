// DOM Content Loaded - Main Initialization
document.addEventListener('DOMContentLoaded', function() {
    // Set current year for copyright
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Initialize all functionality
    initNavigation();
    initTypingEffect();
    initSkillBars();
    initCarousel();
    initContactForm();
    initScrollAnimations();
    initServices();
    initScrollToTop();
    initThemeToggle();
});

// Auto-typing effect for the name
function initTypingEffect() {
    const typedNameElement = document.getElementById('typed-name');
    const nameText = 'Marzana Rahman';
    let charIndex = 0;
    
    function typeCharacter() {
        if (charIndex < nameText.length) {
            typedNameElement.textContent += nameText.charAt(charIndex);
            charIndex++;
            setTimeout(typeCharacter, 100); // Adjust speed here (milliseconds)
        } else {
            // After typing is complete, start the cursor blinking
            setTimeout(() => {
                const cursor = document.querySelector('.typing-cursor');
                if (cursor) {
                    cursor.style.animation = 'blink 1s infinite';
                }
            }, 500);
        }
    }
    
    // Clear the element and start typing
    typedNameElement.textContent = '';
    setTimeout(typeCharacter, 1000); // Delay before starting to type
}

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    
    // Sticky header on scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.style.padding = '10px 0';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.padding = '20px 0';
            header.style.boxShadow = 'none';
        }
    });
}

// Animate skill bars on scroll
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-level');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width');
                entry.target.style.width = width + '%';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => {
        observer.observe(bar);
    });
}

// Projects carousel functionality
function initCarousel() {
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicatorsContainer = document.getElementById('indicators');
    
    if (!track || !prevBtn || !nextBtn || !indicatorsContainer) return;
    
    const projects = document.querySelectorAll('.project-card');
    const projectCount = projects.length;
    let currentIndex = 0;
    
    // Create indicators
    for (let i = 0; i < projectCount; i++) {
        const indicator = document.createElement('div');
        indicator.classList.add('indicator');
        if (i === 0) indicator.classList.add('active');
        indicator.addEventListener('click', () => goToSlide(i));
        indicatorsContainer.appendChild(indicator);
    }
    
    const indicators = document.querySelectorAll('.indicator');
    
    // Update carousel based on screen size
    function updateCarousel() {
        setTrackPosition();
    }
    
    function getItemsPerView() {
        if (window.innerWidth < 768) return 1;
        if (window.innerWidth < 992) return 2;
        return 3;
    }
    
    function setTrackPosition() {
        const itemsPerView = getItemsPerView();
        const slideWidth = (100 / itemsPerView);
        track.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
        
        // Update indicators
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }
    
    function goToSlide(index) {
        const itemsPerView = getItemsPerView();
        currentIndex = Math.max(0, Math.min(index, projectCount - itemsPerView));
        setTrackPosition();
    }
    
    function nextSlide() {
        const itemsPerView = getItemsPerView();
        if (currentIndex < projectCount - itemsPerView) {
            goToSlide(currentIndex + 1);
        } else {
            goToSlide(0);
        }
    }
    
    function prevSlide() {
        const itemsPerView = getItemsPerView();
        if (currentIndex > 0) {
            goToSlide(currentIndex - 1);
        } else {
            goToSlide(projectCount - itemsPerView);
        }
    }
    
    // Event listeners
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    // Handle window resize
    window.addEventListener('resize', updateCarousel);
    
    // Initialize carousel
    updateCarousel();
    
    // Auto slide every 5 seconds
    setInterval(nextSlide, 5000);
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;
            
            // Simple validation
            if (!name || !email || !message) {
                alert('Please fill in all fields');
                return;
            }
            
            // Email validation
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // In a real application, you would send the form data to a server here
            // For this example, we'll just show a success message
            alert('Thank you for your message! I will get back to you soon.');
            this.reset();
        });
    }
}

// Scroll animations for sections
function initScrollAnimations() {
    const sections = document.querySelectorAll('section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Services Section JavaScript
function initServices() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    // Add enhanced hover animations
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add scroll animation for services
    const servicesSection = document.querySelector('.services');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = entry.target.querySelectorAll('.service-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 200);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    if (servicesSection) {
        // Initially hide cards for animation
        const cards = servicesSection.querySelectorAll('.service-card');
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease';
        });
        
        observer.observe(servicesSection);
    }
}

// Scroll to Top functionality
function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (scrollToTopBtn) {
        // Show/hide scroll to top button
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.style.display = 'flex';
            } else {
                scrollToTopBtn.style.display = 'none';
            }
        });
        
        // Smooth scroll to top when clicked
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}


// Enhanced smooth scrolling for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});


// Theme toggle functionality
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
        });
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
        }
    }
}

// Enhanced smooth scrolling for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// CV Download button
document.getElementById('download-cv')?.addEventListener('click', function(e) {
    e.preventDefault();
    
    // In a real application, this would download the actual CV file
    // For demonstration, we'll show a message
    alert('CV download would start in a real implementation. The CV is available at: https://drive.google.com/file/d/1wd5xOQyKJ-s0sZ278MGdMDtt2BSThfmt/view?usp=drive_link');
});

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroSection = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');
    
    if (heroSection && heroContent && heroImage) {
        const rate = scrolled * -0.5;
        heroContent.style.transform = `translateY(${rate}px)`;
        heroImage.style.transform = `translateY(${rate * 0.8}px)`;
    }
});

// Add loading animation
window.addEventListener('load', function() {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
    
    // Trigger animations after page load
    const animatedElements = document.querySelectorAll('.animate-on-load');
    animatedElements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('animated');
        }, index * 100);
    });
});

// Enhanced form validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input, textarea');
    let isValid = true;
    
    inputs.forEach(input => {
        const value = input.value.trim();
        const errorElement = input.parentNode.querySelector('.error-message');
        
        // Remove existing error message
        if (errorElement) {
            errorElement.remove();
        }
        
        // Remove error styling
        input.classList.remove('error');
        
        // Check if field is empty
        if (!value) {
            showFieldError(input, 'This field is required');
            isValid = false;
            return;
        }
        
        // Email validation
        if (input.type === 'email') {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(value)) {
                showFieldError(input, 'Please enter a valid email address');
                isValid = false;
            }
        }
        
        // Name validation
        if (input.type === 'text' && input.placeholder.includes('Name')) {
            if (value.length < 2) {
                showFieldError(input, 'Name must be at least 2 characters long');
                isValid = false;
            }
        }
        
        // Message validation
        if (input.tagName === 'TEXTAREA') {
            if (value.length < 10) {
                showFieldError(input, 'Message must be at least 10 characters long');
                isValid = false;
            }
        }
    });
    
    return isValid;
}

function showFieldError(input, message) {
    input.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '0.8rem';
    errorDiv.style.marginTop = '5px';
    input.parentNode.appendChild(errorDiv);
}