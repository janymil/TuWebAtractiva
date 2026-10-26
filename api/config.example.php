<?php
/**
 * Plantilla de configuración de correo para /api/enviar-brief.php
 *
 * CÓMO USARLA (no guardes contraseñas dentro del repositorio):
 *   1. Copia este archivo como:
 *        /home/TU_USUARIO/montaweb-mail-config.php     <-- UN NIVEL ARRIBA de public_html (recomendado)
 *      o, si tu hosting no permite salir del webroot:
 *        /api/config.php                               <-- ya está en .gitignore y bloqueado por .htaccess
 *   2. Rellena los datos de tu buzón Zoho.
 *   3. Verifica que /api/vendor/autoload.php exista (PHPMailer). Sin PHPMailer el script
 *      cae en mail() del hosting, que puede acabar en spam.
 *
 * Zoho Mail:
 *   - host: smtp.zoho.com | puerto: 465 | secure: ssl   (o puerto 587 con secure: tls)
 *   - user: el correo completo, ej. hola@montaweb.pe
 *   - pass: CONTRASEÑA DE APLICACIÓN (Zoho > Configuración > Seguridad > Contraseñas de aplicación),
 *           nunca la contraseña normal de la cuenta, sobre todo si tienes 2FA.
 */

return [
    // Destinatario interno que recibe cada brief
    'to' => 'hola@montaweb.pe',

    // Remitente (debe ser un buzón real de tu dominio para no fallar SPF/DKIM)
    'from' => 'hola@montaweb.pe',
    'from_name' => 'MontaWeb · Brief',

    'smtp' => [
        'host' => 'smtp.zoho.com',
        'port' => 465,
        'secure' => 'ssl',
        'user' => 'hola@montaweb.pe',
        'pass' => 'PON_AQUI_LA_CONTRASENA_DE_APLICACION',
    ],
];
