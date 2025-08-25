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
    try { initLeadMagnet(); } catch (e) { console.log('Lead magnet init error:', e); }
});

// Navigation functionality
function initNavigation() {
    try {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');
        const navDropdowns = document.querySelectorAll('.nav-dropdown');

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

        // Handle dropdown menus on mobile
        navDropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.nav-dropdown-toggle');
            
            if (toggle) {
                toggle.addEventListener('click', function(e) {
                    // Only prevent default and toggle on mobile
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        dropdown.classList.toggle('active');
                        
                        // Close other dropdowns
                        navDropdowns.forEach(other => {
                            if (other !== dropdown) {
                                other.classList.remove('active');
                            }
                        });
                    }
                });
            }
        });

        // Close dropdowns when clicking outside on mobile
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                navDropdowns.forEach(dropdown => {
                    if (!dropdown.contains(e.target)) {
                        dropdown.classList.remove('active');
                    }
                });
            }
        });

        // Active nav link highlighting
        highlightActiveNavLink();
    } catch (error) {
        console.log('Navigation initialization skipped:', error.message);
    }
    window.addEventListener('scroll', highlightActiveNavLink);
}

function highlightActiveNavLink() {
    // Only run this function on the homepage
    if (window.location.pathname !== '/' && !window.location.pathname.includes('index.html')) {
        return;
    }
    
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
    const backToTopButton = document.createElement('button');
    backToTopButton.className = 'back-to-top';
    backToTopButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTopButton.setAttribute('aria-label', 'Volver arriba');
    backToTopButton.setAttribute('title', 'Volver arriba');
    
    // Add button to body
    document.body.appendChild(backToTopButton);
    
    // Show/hide button based on scroll position
    function toggleBackToTopButton() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    }
    
    // Scroll to top when button is clicked
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Listen for scroll events
    window.addEventListener('scroll', debounce(toggleBackToTopButton, 100));
    
    // Initial check
    toggleBackToTopButton();
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

// Lead Magnet Functionality
function initLeadMagnet() {
    const leadForm = document.getElementById('leadMagnetForm');
    
    if (!leadForm) return;
    
    leadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(leadForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            business: formData.get('business') || 'No especificado'
        };
        
        // Basic validation
        if (!data.name || !data.email) {
            showLeadMessage('Por favor completa todos los campos requeridos.', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showLeadMessage('Por favor ingresa un email válido.', 'error');
            return;
        }
        
        // Show loading state
        leadForm.classList.add('loading');
        const submitBtn = leadForm.querySelector('.btn-primary-lg');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner"></i> Enviando...';
        
        // Send email using EmailJS
        emailjs.send('service_tuwebatractiva', 'template_lead_magnet', {
            to_name: data.name,
            to_email: data.email,
            business_type: data.business,
            from_name: 'Tu Web Atractiva',
            reply_to: data.email
        })
        .then(function(response) {
            console.log('Lead magnet email sent successfully:', response);
            showLeadSuccess(data.name);
            
            // Track conversion
            if (typeof gtag !== 'undefined') {
                gtag('event', 'conversion', {
                    'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL',
                    'value': 1.0,
                    'currency': 'PEN'
                });
            }
            
            // Reset form
            leadForm.reset();
            
        })
        .catch(function(error) {
            console.error('Lead magnet email error:', error);
            showLeadMessage('Hubo un error al enviar. Por favor intenta nuevamente o escríbenos por WhatsApp.', 'error');
        })
        .finally(function() {
            // Remove loading state
            leadForm.classList.remove('loading');
            submitBtn.innerHTML = originalText;
        });
    });
}

function showLeadMessage(message, type) {
    const leadForm = document.getElementById('leadMagnetForm');
    if (!leadForm) return;
    
    // Remove existing messages
    const existingMessage = leadForm.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message form-message-${type}`;
    messageDiv.innerHTML = `
        <div class="message-content">
            <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : 'check-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Insert message
    leadForm.insertBefore(messageDiv, leadForm.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

function showLeadSuccess(name) {
    const leadMagnetForm = document.querySelector('.lead-magnet-form');
    if (!leadMagnetForm) return;
    
    // Replace form with success message and download links
    leadMagnetForm.innerHTML = `
        <div class="form-success">
            <i class="fas fa-check-circle"></i>
            <h3>¡Perfecto, ${name}!</h3>
            <p>Los recursos han sido enviados a tu email. Mientras tanto, puedes descargarlos directamente:</p>
            
            <div class="download-links">
                <a href="/downloads/guia-10-elementos-esenciales-web.pdf" 
                   class="download-btn" 
                   download
                   target="_blank">
                    <i class="fas fa-download"></i>
                    Descargar Guía Completa
                </a>
                
                <a href="/downloads/checklist-antes-lanzar-web.pdf" 
                   class="download-btn" 
                   download
                   target="_blank">
                    <i class="fas fa-download"></i>
                    Descargar Checklist
                </a>
            </div>
            
            <p class="success-note">
                <i class="fas fa-heart"></i>
                ¡Gracias por confiar en Tu Web Atractiva!
            </p>
            
            <a href="https://wa.me/51938693848?text=Hola,%20descargué%20los%20recursos%20gratuitos%20y%20me%20gustaría%20conversar%20sobre%20mi%20proyecto%20web" 
               class="btn btn-primary" 
               target="_blank">
                <i class="fab fa-whatsapp"></i>
                ¿Tienes dudas? Conversemos por WhatsApp
            </a>
        </div>
    `;
    
    // Scroll to success message
    leadMagnetForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ===========================
// PRICE CALCULATOR FUNCTIONS
// ===========================

// Price data for Peru market 2025
window.priceData = {
    projectTypes: {
        simple: {
            name: 'Página Web Simple',
            competitorMin: 800,
            competitorMax: 2500,
            ourPrice: 199
        },
        landing: {
            name: 'Landing Page',
            competitorMin: 500,
            competitorMax: 1800,
            ourPrice: 99
        },
        corporate: {
            name: 'Sitio Corporativo',
            competitorMin: 1500,
            competitorMax: 4500,
            ourPrice: 299
        },
        ecommerce: {
            name: 'Tienda Online',
            competitorMin: 2500,
            competitorMax: 8000,
            ourPrice: 499
        },
        redesign: {
            name: 'Rediseño Web',
            competitorMin: 800,
            competitorMax: 3500,
            ourPrice: 249
        },
        custom: {
            name: 'Proyecto Personalizado',
            competitorMin: 2000,
            competitorMax: 6000,
            ourPrice: 399
        }
    },
    addons: {
        seo: { name: 'SEO Básico', competitorPrice: 300, ourPrice: 0 },
        content: { name: 'Creación de Contenido', competitorPrice: 400, ourPrice: 50 },
        hosting: { name: 'Hosting (1 año)', competitorPrice: 200, ourPrice: 0 },
        maintenance: { name: 'Mantenimiento (3 meses)', competitorPrice: 350, ourPrice: 0 },
        ssl: { name: 'Certificado SSL', competitorPrice: 100, ourPrice: 0 },
        analytics: { name: 'Google Analytics', competitorPrice: 150, ourPrice: 0 }
    },
    timelines: {
        urgent: { multiplier: 1.5, name: 'Urgente (1-7 días)' },
        normal: { multiplier: 1, name: 'Normal (2-4 semanas)' },
        flexible: { multiplier: 0.9, name: 'Flexible (1-3 meses)' }
    }
};

// Initialize price calculator
function initPriceCalculator() {
    console.log('Initializing price calculator...'); // Debug
    
    const floatingBtn = document.getElementById('floatingCalculatorBtn');
    const modal = document.getElementById('calculatorModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');

    console.log('Elements found:', {
        floatingBtn: !!floatingBtn,
        modal: !!modal,
        modalOverlay: !!modalOverlay,
        modalClose: !!modalClose
    }); // Debug

    if (!floatingBtn || !modal) {
        console.error('Calculator elements not found!');
        return;
    }

    // Show modal
    floatingBtn.addEventListener('click', function(e) {
        console.log('Calculator button clicked!'); // Debug
        e.preventDefault();
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    });

    // Hide modal
    function hideModal() {
        console.log('Hiding modal...'); // Debug
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', hideModal);
    }
    
    if (modalClose) {
        modalClose.addEventListener('click', hideModal);
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            hideModal();
        }
    });
    
    console.log('Calculator initialized successfully!'); // Debug
}

// Calculate price based on selections
window.calculatePrice = function() {
    console.log('calculatePrice called'); // Debug log
    
    const projectType = document.getElementById('projectType').value;
    const timeline = document.getElementById('timeline').value;
    const checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked');
    const resultsSection = document.getElementById('resultsSection');

    console.log('Project type:', projectType); // Debug log

    if (!projectType) {
        resultsSection.style.display = 'none';
        return;
    }

    const project = priceData.projectTypes[projectType];
    if (!project) return;

    // Calculate base prices
    let competitorMin = project.competitorMin;
    let competitorMax = project.competitorMax;
    let ourPrice = project.ourPrice;

    // Add addon costs
    let competitorAddonCost = 0;
    let ourAddonCost = 0;

    checkboxes.forEach(checkbox => {
        const addonKey = checkbox.value;
        const addon = priceData.addons[addonKey];
        if (addon) {
            competitorAddonCost += addon.competitorPrice;
            ourAddonCost += addon.ourPrice;
        }
    });

    // Apply timeline multiplier
    if (timeline && priceData.timelines[timeline]) {
        const multiplier = priceData.timelines[timeline].multiplier;
        competitorMin = Math.round(competitorMin * multiplier);
        competitorMax = Math.round(competitorMax * multiplier);
        ourPrice = Math.round(ourPrice * multiplier);
    }

    // Add addon costs
    competitorMin += competitorAddonCost;
    competitorMax += competitorAddonCost;
    ourPrice += ourAddonCost;

    // Update display
    updatePriceDisplay(competitorMin, competitorMax, ourPrice);
    resultsSection.style.display = 'block';
    
    // Smooth scroll to results
    setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

// Update price display
function updatePriceDisplay(competitorMin, competitorMax, ourPrice) {
    const competitorPriceEl = document.getElementById('competitorPrice');
    const ourPriceEl = document.getElementById('ourPrice');
    const savingsEl = document.getElementById('savingsHighlight');

    if (competitorPriceEl) {
        competitorPriceEl.textContent = `S/ ${competitorMin.toLocaleString()} - S/ ${competitorMax.toLocaleString()}`;
    }

    if (ourPriceEl) {
        ourPriceEl.textContent = `S/ ${ourPrice.toLocaleString()}`;
    }

    // Calculate savings
    const minSavings = competitorMin - ourPrice;
    const maxSavings = competitorMax - ourPrice;

    if (savingsEl) {
        const savingsBadge = savingsEl.querySelector('.savings-badge span');
        if (savingsBadge) {
            savingsBadge.textContent = `¡Ahorras entre S/ ${minSavings.toLocaleString()} - S/ ${maxSavings.toLocaleString()}!`;
        }
    }
}

// Reset calculator
window.resetCalculator = function() {
    console.log('resetCalculator called'); // Debug log
    
    document.getElementById('projectType').value = '';
    document.getElementById('timeline').value = '';
    
    const checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    document.getElementById('resultsSection').style.display = 'none';
    
    // Scroll back to top of form
    document.querySelector('.calculator-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initPriceCalculator();
});
