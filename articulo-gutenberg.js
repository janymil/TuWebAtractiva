// Gutenberg Compatible JavaScript - Add this using "Insert Headers and Footers" plugin or similar

jQuery(document).ready(function($) {
    
    // Progress bar functionality
    $(window).scroll(function() {
        const scrollTop = $(document).scrollTop();
        const docHeight = $(document).height();
        const winHeight = $(window).height();
        const scrollPercent = (scrollTop) / (docHeight - winHeight);
        const scrollPercentRounded = Math.round(scrollPercent * 100);
        $('#articuloProgressBar').css('width', scrollPercentRounded + '%');
    });

    // Back to top button
    const backToTop = $('#articuloBackToTop');
    $(window).scroll(function() {
        if ($(window).scrollTop() > 300) {
            backToTop.addClass('visible');
        } else {
            backToTop.removeClass('visible');
        }
    });

    backToTop.click(function() {
        $('html, body').animate({scrollTop: 0}, 800);
        return false;
    });

    // Animate sections on scroll
    function checkArticuloVisibility() {
        $('.wp-articulo-content .articulo-section').each(function() {
            var elementTop = $(this).offset().top;
            var elementBottom = elementTop + $(this).outerHeight();
            var viewportTop = $(window).scrollTop();
            var viewportBottom = viewportTop + $(window).height();
            
            if (elementBottom > viewportTop && elementTop < viewportBottom) {
                $(this).addClass('visible');
            }
        });
    }

    // Check visibility on scroll and load
    $(window).scroll(checkArticuloVisibility);
    $(window).load(checkArticuloVisibility);
    
    // Initial check after short delay
    setTimeout(checkArticuloVisibility, 100);

    // Interactive stat cards
    $('.wp-articulo-content .articulo-stat-card').click(function() {
        $(this).css('transform', 'scale(1.05)');
        setTimeout(() => {
            $(this).css('transform', 'translateY(-5px)');
        }, 200);
    });

    // Table row hover effects
    $('.wp-articulo-content .articulo-comparison-table tr').each(function() {
        if (!$(this).find('th').length) {
            $(this).hover(
                function() {
                    $(this).css('transform', 'scale(1.02)');
                },
                function() {
                    $(this).css('transform', 'scale(1)');
                }
            );
        }
    });

    // Add bounce animation to step counters
    $('.wp-articulo-content .articulo-step-counter').addClass('articulo-bounce');

    // Initialize animations when page loads
    $(window).on('load', function() {
        // Add fade-in class to hero section
        $('.wp-articulo-content .articulo-hero-section').addClass('articulo-fade-in');
        
        // Stagger animation for sections
        setTimeout(function() {
            $('.wp-articulo-content .articulo-section').each(function(index) {
                var $this = $(this);
                setTimeout(function() {
                    $this.addClass('visible');
                }, index * 200);
            });
        }, 500);
    });

    // Smooth scrolling for internal links
    $('.wp-articulo-content a[href^="#"]').click(function(e) {
        e.preventDefault();
        var target = $($(this).attr('href'));
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top
            }, 800);
        }
    });

    // Typing effect for hero title
    function articuloTypeWriter(element, text, speed) {
        speed = speed || 50;
        var i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    // Initialize typing effect after delay
    setTimeout(function() {
        var heroTitle = $('.wp-articulo-content .articulo-hero-title')[0];
        if (heroTitle) {
            var originalText = heroTitle.textContent;
            articuloTypeWriter(heroTitle, originalText, 30);
        }
    }, 1000);

    // Tooltip functionality
    $('.wp-articulo-content .articulo-interactive-tooltip').hover(
        function() {
            $(this).find('.articulo-tooltip-content').css('opacity', '1');
        },
        function() {
            $(this).find('.articulo-tooltip-content').css('opacity', '0');
        }
    );

    // Enhanced scroll animations with intersection observer
    if ('IntersectionObserver' in window) {
        var articuloObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        $('.wp-articulo-content .articulo-section').each(function() {
            articuloObserver.observe(this);
        });
    }

    // Initialize counters animation
    $('.wp-articulo-content .articulo-stat-number').each(function() {
        var $this = $(this);
        var countTo = $this.text();
        
        $this.text('0');
        
        if ('IntersectionObserver' in window) {
            var counterObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        $({ countNum: 0 }).animate({
                            countNum: parseInt(countTo)
                        }, {
                            duration: 2000,
                            easing: 'swing',
                            step: function() {
                                $this.text(Math.floor(this.countNum) + (countTo.includes('%') ? '%' : ''));
                            },
                            complete: function() {
                                $this.text(countTo);
                            }
                        });
                        counterObserver.unobserve(entry.target);
                    }
                });
            });
            
            counterObserver.observe(this);
        }
    });

    // Make content visible
    $('.wp-articulo-content').css('opacity', '1');
});

// Vanilla JavaScript fallback for environments without jQuery
document.addEventListener('DOMContentLoaded', function() {
    
    // Progress bar functionality
    window.addEventListener('scroll', function() {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;
        const progressBar = document.getElementById('articuloProgressBar');
        if (progressBar) {
            progressBar.style.width = scrollPercentage + '%';
        }
    });

    // Back to top button
    const backToTop = document.getElementById('articuloBackToTop');
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Section visibility on scroll
    function checkSectionVisibility() {
        const sections = document.querySelectorAll('.wp-articulo-content .articulo-section');
        sections.forEach(function(section) {
            const rect = section.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            if (isVisible) {
                section.classList.add('visible');
            }
        });
    }

    window.addEventListener('scroll', checkSectionVisibility);
    window.addEventListener('load', checkSectionVisibility);
    
    // Initial check
    setTimeout(checkSectionVisibility, 100);
});