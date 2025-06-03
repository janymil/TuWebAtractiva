// Dedicated EmailJS handler - isolated from main.js to prevent conflicts
(function() {
    'use strict';
    
    // Initialize EmailJS when page loads
    document.addEventListener('DOMContentLoaded', function() {
        console.log('EmailJS contact script loaded');
        
        // Initialize EmailJS
        if (typeof emailjs !== 'undefined') {
            emailjs.init('LCZm2DW6dqd8h1bWi');
            console.log('EmailJS initialized successfully');
        } else {
            console.error('EmailJS library not loaded');
        }
        
        // Get the contact form
        const contactForm = document.getElementById('contact-form');
        if (!contactForm) {
            console.log('Contact form not found on this page');
            return;
        }
        
        console.log('Contact form found, attaching submit handler');
        
        // Handle form submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted, processing...');
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            console.log('Form data collected:', data);
            
            // Check honeypot
            if (data._honey) {
                console.log('Spam detected via honeypot');
                return;
            }
            
            // Basic validation
            if (!data.nombre || !data.telefono || !data.email || !data.mensaje) {
                alert('Por favor completa todos los campos obligatorios');
                return;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            }
            
            // Add timestamp
            data.fecha_envio = new Date().toLocaleString('es-PE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            console.log('Attempting to send email with data:', data);
            
            // Send email via EmailJS
            sendEmailViaEmailJS(data, submitBtn);
        });
    });
    
    function sendEmailViaEmailJS(formData, submitBtn) {
        console.log('sendEmailViaEmailJS called');
        
        // Check if EmailJS is available
        if (typeof emailjs === 'undefined') {
            console.error('EmailJS not available, using fallback');
            handleFallback(formData, submitBtn);
            return;
        }
        
        // EmailJS configuration
        const serviceID = 'service_tkcskxl';
        const templateID = 'template_01oosn8';
        const userTemplateID = 'template_9lx7svc';
        
        console.log('Sending email with config:', { serviceID, templateID });
        
        // Send main email
        emailjs.send(serviceID, templateID, formData)
            .then(function(response) {
                console.log('Email sent successfully:', response);
                
                // Send user confirmation if email provided
                if (formData.email && userTemplateID) {
                    console.log('Sending confirmation email to:', formData.email);
                    emailjs.send(serviceID, userTemplateID, formData)
                        .then(() => console.log('Confirmation email sent'))
                        .catch(err => console.log('Confirmation email failed:', err));
                }
                
                // Show success and redirect
                showSuccess();
                setTimeout(() => {
                    window.location.href = 'gracias.html';
                }, 2000);
            })
            .catch(function(error) {
                console.error('EmailJS failed:', error);
                handleFallback(formData, submitBtn);
            });
                if (formData.email && userTemplateID) {
                    console.log('Sending confirmation email to:', formData.email);
                    emailjs.send(serviceID, userTemplateID, formData)
                        .then(() => console.log('Confirmation email sent'))
                        .catch(err => console.log('Confirmation email failed:', err));
                }
                
                // Show success and redirect
                showSuccess();
                setTimeout(() => {
                    window.location.href = 'gracias.html';
                }, 2000);
            })
            .catch(function(error) {
                console.error('EmailJS failed:', error);
                handleFallback(formData, submitBtn);
            });
    }
    
    function handleFallback(formData, submitBtn) {
        console.log('Using WhatsApp fallback');
        
        // Reset button
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Solicitud';
        }
        
        // Create WhatsApp message
        const message = createWhatsAppMessage(formData);
        
        // Show fallback message
        alert('Redirigiendo a WhatsApp para completar tu solicitud...');
        
        // Open WhatsApp
        setTimeout(() => {
            window.open(`https://wa.me/51938693848?text=${encodeURIComponent(message)}`, '_blank');
            window.location.href = 'gracias.html';
        }, 1000);
    }
    
    function createWhatsAppMessage(data) {
        return `Hola! Solicito cotización para diseño web:

👤 Nombre: ${data.nombre}
📧 Email: ${data.email}
📱 Teléfono: ${data.telefono}
🏢 Empresa: ${data.empresa || 'No especificado'}
🌐 Sitio actual: ${data.sitio_actual || 'No tiene'}

💼 Servicio: ${data.tipo_servicio || 'No especificado'}
🎯 Negocio: ${data.tipo_negocio || 'No especificado'}
💰 Presupuesto: ${data.presupuesto || 'No especificado'}
⏰ Urgencia: ${data.urgencia || 'No especificado'}

📋 Descripción:
${data.mensaje}

Enviado desde: tuwebatractiva.com`;
    }
    
    function showSuccess() {
        // Simple success message
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 10000;
            font-family: Arial, sans-serif;
        `;
        messageDiv.textContent = '¡Solicitud enviada exitosamente!';
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 3000);
    }
})();