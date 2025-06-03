// Tu Web Atractiva - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize each function safely to prevent errors from breaking the form
    try { initNavigation(); } catch (e) { console.log('Navigation init error:', e); }
    try { initContactForm(); } catch (e) { console.log('Contact form init error:', e); }
    try { initPortfolioFilters(); } catch (e) { console.log('Portfolio init error:', e); }
    try { initFAQ(); } catch (e) { console.log('FAQ init error:', e); }
    try { initSmoothScrolling(); } catch (e) { console.log('Smooth scrolling init error:', e); }
    try { initAnimations(); } catch (e) { console.log('Animations init error:', e); }
    try { initDarkMode(); } catch (e) { console.log('Dark mode init error:', e); }
    try { initBackToTop(); } catch (e) { console.log('Back to top init error:', e); }
});

// Navigation functionality
function initNavigation() {
    try {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        // Only add navigation functionality if elements exist
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', function() {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Close menu when clicking on links
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });

            // Close menu when clicking outside - simplified to avoid errors
            document.addEventListener('click', function(e) {
                if (e && e.target && navToggle && navMenu) {
                    const clickedInsideNav = navToggle.contains(e.target) || navMenu.contains(e.target);
                    if (!clickedInsideNav) {
                        navToggle.classList.remove('active');
                        navMenu.classList.remove('active');
                    }
                }
            });
        }

        // Active nav link highlighting
        highlightActiveNavLink();
    } catch (error) {
        console.log('Navigation initialization skipped:', error.message);
    }
    window.addEventListener('scroll', highlightActiveNavLink);
}

function highlightActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
}

// Portfolio filters functionality
function initPortfolioFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (!filterBtns.length || !portfolioItems.length) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter portfolio items
            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    item.classList.remove('hidden');
                } else {
                    item.style.display = 'none';
                    item.classList.add('hidden');
                }
            });
        });
    });
}

// FAQ functionality
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQs
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });
                
                // Toggle current FAQ
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll animations
function initAnimations() {
    // Fade in animation for cards and sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate
    const animatedElements = document.querySelectorAll(`
        .service-card,
        .testimonial-card,
        .feature-item,
        .portfolio-card,
        .contact-method,
        .process-step,
        .quick-option
    `);
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroImage = document.querySelector('.hero-image img');
        
        if (heroImage) {
            const rate = scrolled * -0.5;
            heroImage.style.transform = `translateY(${rate}px)`;
        }
    });
    
    // Number counter animation
    const counterElements = document.querySelectorAll('.result-item strong');
    counterElements.forEach(counter => {
        const target = counter.textContent;
        const match = target.match(/\+(\d+)%?/);
        
        if (match) {
            const number = parseInt(match[1]);
            animateCounter(counter, number, target.includes('%') ? '%' : '');
        }
    });
}

function animateCounter(element, target, suffix) {
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                let current = 0;
                const increment = target / 50;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    element.textContent = `+${Math.floor(current)}${suffix}`;
                }, 40);
                
                observer.unobserve(element);
            }
        });
    });
    
    observer.observe(element);
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle form validation in real-time
function initRealTimeValidation() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', debounce(function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        }, 500));
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing error styling
    field.classList.remove('error');
    removeFieldError(field);
    
    // Check if field is required and empty
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Este campo es obligatorio';
    }
    
    // Field-specific validations
    if (value) {
        switch (field.type) {
            case 'email':
                if (!isValidEmail(value)) {
                    isValid = false;
                    errorMessage = 'Ingresa un email válido';
                }
                break;
            case 'tel':
                if (!isValidPhone(value)) {
                    isValid = false;
                    errorMessage = 'Ingresa un teléfono válido';
                }
                break;
        }
        
        // Special validations
        if (field.name === 'mensaje' && value.length < 10) {
            isValid = false;
            errorMessage = 'El mensaje debe tener al menos 10 caracteres';
        }
        
        if (field.name === 'nombre' && value.length < 2) {
            isValid = false;
            errorMessage = 'El nombre debe tener al menos 2 caracteres';
        }
    }
    
    if (!isValid) {
        field.classList.add('error');
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = 'hsl(var(--primary))';
    errorDiv.style.fontSize = 'var(--font-size-sm)';
    errorDiv.style.marginTop = 'var(--spacing-xs)';
    
    field.parentNode.appendChild(errorDiv);
}

function removeFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Dark mode functionality
function initDarkMode() {
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else if (systemPrefersDark) {
        htmlElement.setAttribute('data-theme', 'dark');
    } else {
        htmlElement.setAttribute('data-theme', 'light');
    }
    
    // Theme toggle functionality
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Add smooth transition effect
            document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
            setTimeout(() => {
                document.body.style.transition = '';
            }, 300);
        });
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
            htmlElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        }
    });
}

// Back to top functionality
function initBackToTop() {
    // Create back to top button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTopBtn.setAttribute('aria-label', 'Volver arriba');
    backToTopBtn.setAttribute('title', 'Volver arriba');
    
    // Add button to page
    document.body.appendChild(backToTopBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // Smooth scroll to top when clicked
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize real-time validation
document.addEventListener('DOMContentLoaded', function() {
    initRealTimeValidation();
});

// WhatsApp floating button (optional enhancement)
function addFloatingWhatsApp() {
    const floatingBtn = document.createElement('a');
    floatingBtn.href = 'https://wa.me/51999999999?text=Hola,%20quiero%20información%20sobre%20diseño%20web';
    floatingBtn.target = '_blank';
    floatingBtn.className = 'floating-whatsapp';
    floatingBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';
    floatingBtn.setAttribute('aria-label', 'Contactar por WhatsApp');
    
    // Add CSS for floating button
    const style = document.createElement('style');
    style.textContent = `
        .floating-whatsapp {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background: #25d366;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            box-shadow: 0 4px 20px rgba(37, 211, 102, 0.3);
            z-index: 1000;
            transition: all 0.3s ease;
            text-decoration: none;
        }
        
        .floating-whatsapp:hover {
            background: #128c7e;
            transform: scale(1.1);
            color: white;
        }
        
        @media (max-width: 768px) {
            .floating-whatsapp {
                bottom: 15px;
                right: 15px;
                width: 50px;
                height: 50px;
                font-size: 20px;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(floatingBtn);
}

// Uncomment to add floating WhatsApp button
// addFloatingWhatsApp();

// Page loading optimization
window.addEventListener('load', function() {
    // Hide loading spinner if exists
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 300);
    }
    
    // Initialize lazy loading for images
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
});

// Error handling for missing elements
window.addEventListener('error', function(e) {
    console.warn('Tu Web Atractiva: Error capturado:', e.error);
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(() => {
            const navigation = performance.getEntriesByType('navigation')[0];
            console.log(`Tiempo de carga: ${navigation.loadEventEnd - navigation.loadEventStart}ms`);
        }, 0);
    });
}
