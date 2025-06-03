// Elementor Compatible JavaScript - Add this to Elementor Custom JavaScript

jQuery(document).ready(function($) {
    
    // Progress bar functionality
    $(window).scroll(function() {
        const scrollTop = $(document).scrollTop();
        const docHeight = $(document).height();
        const winHeight = $(window).height();
        const scrollPercent = (scrollTop) / (docHeight - winHeight);
        const scrollPercentRounded = Math.round(scrollPercent * 100);
        $('#progressBar').css('width', scrollPercentRounded + '%');
    });

    // Back to top button
    const backToTop = $('#backToTop');
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
    function checkVisibility() {
        $('.articulo-content .section').each(function() {
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
    $(window).scroll(checkVisibility);
    $(window).load(checkVisibility);
    
    // Initial check
    setTimeout(checkVisibility, 100);

    // Interactive stat cards
    $('.articulo-content .stat-card').click(function() {
        $(this).css('transform', 'scale(1.05)');
        setTimeout(() => {
            $(this).css('transform', 'translateY(-5px)');
        }, 200);
    });

    // Table row hover effects
    $('.articulo-content .comparison-table tr').each(function() {
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
    $('.articulo-content .step-counter').addClass('bounce');

    // Initialize all animations when page loads
    $(window).on('load', function() {
        // Add fade-in class to hero section
        $('.articulo-content .hero-section').addClass('fade-in');
        
        // Stagger animation for sections
        setTimeout(function() {
            $('.articulo-content .section').each(function(index) {
                var $this = $(this);
                setTimeout(function() {
                    $this.addClass('visible');
                }, index * 200);
            });
        }, 500);
    });

    // Smooth scrolling for internal links
    $('.articulo-content a[href^="#"]').click(function(e) {
        e.preventDefault();
        var target = $($(this).attr('href'));
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top
            }, 800);
        }
    });

    // Typing effect for hero title
    function typeWriter(element, text, speed) {
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

    // Initialize typing effect after a delay
    setTimeout(function() {
        var heroTitle = $('.articulo-content .hero-title')[0];
        if (heroTitle) {
            var originalText = heroTitle.textContent;
            typeWriter(heroTitle, originalText, 30);
        }
    }, 1000);

    // Tooltip functionality
    $('.articulo-content .interactive-tooltip').hover(
        function() {
            $(this).find('.tooltip-content').css('opacity', '1');
        },
        function() {
            $(this).find('.tooltip-content').css('opacity', '0');
        }
    );

    // Enhanced scroll animations with intersection observer fallback
    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        $('.articulo-content .section').each(function() {
            observer.observe(this);
        });
    }

    // Add loading class to prevent flash of unstyled content
    $('.articulo-content').css('opacity', '1');
    
    // Initialize counters animation
    $('.articulo-content .stat-number').each(function() {
        var $this = $(this);
        var countTo = $this.text();
        
        $this.text('0');
        
        var observer = new IntersectionObserver(function(entries) {
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
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(this);
    });
});

// Vanilla JavaScript fallback for non-jQuery environments
document.addEventListener('DOMContentLoaded', function() {
    
    // Progress bar functionality (vanilla JS)
    window.addEventListener('scroll', function() {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.style.width = scrollPercentage + '%';
        }
    });

    // Back to top button (vanilla JS)
    const backToTop = document.getElementById('backToTop');
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
});