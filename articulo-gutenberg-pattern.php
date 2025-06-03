<?php
/**
 * Register Articulo Block Pattern for Gutenberg
 * Add this to your theme's functions.php file
 */

function register_articulo_block_pattern() {
    register_block_pattern(
        'tuwebatractiva/articulo-pattern',
        array(
            'title'         => 'Artículo Web Profesional 2025',
            'description'   => 'Guía completa para crear páginas web profesionales',
            'categories'    => array('text'),
            'keywords'      => array('articulo', 'web', 'guia', 'peru'),
            'content'       => '
<!-- wp:html -->
<div class="articulo-content">
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

        <div class="content">
            <!-- Add rest of content here -->
        </div>
    </div>

    <button class="back-to-top" id="backToTop">↑</button>
</div>
<!-- /wp:html -->

<!-- wp:paragraph -->
<p><strong>Nota:</strong> Para funcionamiento completo, agregar CSS y JavaScript personalizados en el tema.</p>
<!-- /wp:paragraph -->'
        )
    );
}
add_action('init', 'register_articulo_block_pattern');

/**
 * Enqueue styles and scripts for the article
 */
function articulo_enqueue_assets() {
    // Only load on pages that contain the articulo content
    if (has_block('html') && strpos(get_the_content(), 'articulo-content') !== false) {
        
        // Add inline CSS
        wp_add_inline_style('wp-block-library', '
            /* Copy CSS from articulo-elementor.css here */
            .articulo-content * { box-sizing: border-box; }
            /* ... rest of CSS ... */
        ');
        
        // Add inline JavaScript
        wp_add_inline_script('jquery', '
            /* Copy JavaScript from articulo-elementor.js here */
        ');
    }
}
add_action('wp_enqueue_scripts', 'articulo_enqueue_assets');
?>