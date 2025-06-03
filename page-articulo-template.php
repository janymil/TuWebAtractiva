<?php
/*
Template Name: Articulo Template
*/

get_header(); ?>

<div id="primary" class="content-area">
    <main id="main" class="site-main">
        
        <!-- Custom Article Content -->
        <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
            
            <?php
            // Include the content from articulo.html (without header/footer)
            // You can either copy the content directly here or include it from a file
            ?>
            
            <style>
                /* Copy the entire CSS from articulo.html here */
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.7;
                    color: #333;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                }

                .container {
                    max-width: 1000px;
                    margin: 0 auto;
                    background: white;
                    box-shadow: 0 0 30px rgba(0,0,0,0.1);
                    border-radius: 20px;
                    overflow: hidden;
                    margin-top: 20px;
                    margin-bottom: 20px;
                }

                .hero-section {
                    background: linear-gradient(135deg, #c41e3a 0%, #ff6b6b 100%);
                    color: white;
                    padding: 60px 40px;
                    text-align: center;
                    position: relative;
                    overflow: hidden;
                }

                .hero-section::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="40" r="3" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="80" r="1" fill="rgba(255,255,255,0.1)"/></svg>');
                    opacity: 0.3;
                }

                .hero-content {
                    position: relative;
                    z-index: 1;
                }

                .hero-title {
                    font-size: 2.5rem;
                    font-weight: 700;
                    margin-bottom: 20px;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                }

                .hero-subtitle {
                    font-size: 1.2rem;
                    opacity: 0.9;
                    margin-bottom: 30px;
                }

                .peru-flag {
                    display: inline-block;
                    width: 30px;
                    height: 20px;
                    background: linear-gradient(to right, #c41e3a 33%, white 33%, white 66%, #c41e3a 66%);
                    border-radius: 3px;
                    margin: 0 10px;
                    vertical-align: middle;
                }

                /* Add the rest of your CSS here... */
                /* For brevity, I'm showing just the beginning - copy all CSS from articulo.html */
            </style>

            <!-- Copy the HTML content from articulo.html here (everything between the WordPress comments) -->
            <div class="progress-bar" id="progressBar"></div>
            
            <div class="container">
                <div class="hero-section">
                    <div class="hero-content">
                        <h1 class="hero-title">
                            Cómo Crear una Página Web Profesional con Bajo Presupuesto
                            <span class="peru-flag"></span>
                        </h1>
                        <p class="hero-subtitle">Guía 2025 para Emprendedores Peruanos</p>
                        <p>¿Eres un emprendedor en Lima o cualquier rincón del Perú y sueñas con una página web profesional que no te deje en bancarrota? ¡Estás en el lugar correcto!</p>
                    </div>
                </div>
                
                <!-- Copy the rest of the content from articulo.html -->
                <!-- ... all sections ... -->
            </div>

            <script>
                // Copy all JavaScript from articulo.html here
                // Progress bar functionality
                window.addEventListener('scroll', function() {
                    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                    const scrollPercentage = (scrollTop / scrollHeight) * 100;
                    document.getElementById('progressBar').style.width = scrollPercentage + '%';
                });

                // Copy all the rest of the JavaScript from articulo.html...
            </script>

        </article>

    </main>
</div>

<?php
get_sidebar();
get_footer();
?>