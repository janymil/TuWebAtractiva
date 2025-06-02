// Admin Panel JavaScript
let authToken = null;
let currentContent = {};
let currentSettings = {};

// Initialize the admin panel
document.addEventListener('DOMContentLoaded', function() {
    // Check if already logged in
    const savedToken = localStorage.getItem('adminToken');
    if (savedToken) {
        authToken = savedToken;
        showAdminPanel();
        loadAllData();
    }

    // Login form handler
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Logout handler
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    // Navigation handlers
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.dataset.section;
            showSection(section);
        });
    });

    // Content save handlers
    document.getElementById('saveHeroBtn').addEventListener('click', () => saveContentSection('hero'));
    document.getElementById('saveServicesBtn').addEventListener('click', () => saveContentSection('services'));
    document.getElementById('savePortfolioBtn').addEventListener('click', () => saveContentSection('portfolio'));
    
    // Gallery handlers
    document.getElementById('addGalleryBtn').addEventListener('click', addGalleryItem);
    
    // Settings handler
    document.getElementById('saveSettingsBtn').addEventListener('click', saveSettings);
    
    // Preview button
    document.getElementById('previewBtn').addEventListener('click', function() {
        window.open('/', '_blank');
    });

    // File upload handlers
    document.getElementById('heroBackgroundImage').addEventListener('change', function() {
        if (this.files[0]) {
            uploadImage(this.files[0], (imageUrl) => {
                document.getElementById('heroBackgroundImage').dataset.url = imageUrl;
                showMessage('contentMessage', 'Imagen subida correctamente. No olvides guardar los cambios.', 'success');
            });
        }
    });

    document.getElementById('galleryImage').addEventListener('change', function() {
        if (this.files[0]) {
            const preview = document.createElement('img');
            preview.style.width = '100px';
            preview.style.height = '100px';
            preview.style.objectFit = 'cover';
            preview.style.marginTop = '10px';
            preview.src = URL.createObjectURL(this.files[0]);
            
            const existing = this.parentNode.querySelector('img');
            if (existing) existing.remove();
            this.parentNode.appendChild(preview);
        }
    });
});

async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            authToken = data.token;
            localStorage.setItem('adminToken', authToken);
            showAdminPanel();
            loadAllData();
        } else {
            showMessage('loginMessage', data.message, 'error');
        }
    } catch (error) {
        showMessage('loginMessage', 'Error de conexión', 'error');
    }
}

function handleLogout() {
    authToken = null;
    localStorage.removeItem('adminToken');
    document.getElementById('loginContainer').style.display = 'flex';
    document.getElementById('adminContainer').style.display = 'none';
    document.getElementById('previewBtn').style.display = 'none';
}

function showAdminPanel() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('adminContainer').style.display = 'block';
    document.getElementById('previewBtn').style.display = 'block';
}

function showSection(sectionName) {
    // Update navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
    
    // Show content section
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionName).classList.add('active');
    
    // Load section-specific data
    if (sectionName === 'gallery') {
        loadGalleryItems();
    }
}

async function loadAllData() {
    await Promise.all([
        loadContentData(),
        loadSettings(),
        loadGalleryItems()
    ]);
}

async function loadContentData() {
    try {
        const response = await fetch('/api/content');
        const data = await response.json();
        currentContent = data;
        
        // Populate hero section
        if (data.hero) {
            document.getElementById('heroTitle').value = data.hero.title || '';
            document.getElementById('heroSubtitle').value = data.hero.subtitle || '';
            document.getElementById('heroDescription').value = data.hero.description || '';
            document.getElementById('heroButtonText').value = data.hero.buttonText || '';
            document.getElementById('heroTextColor').value = data.hero.textColor || '#ffffff';
            document.getElementById('heroBackgroundColor').value = data.hero.backgroundColor || '#1a202c';
        }
        
        // Populate services section
        if (data.services) {
            document.getElementById('servicesTitle').value = data.services.title || '';
            document.getElementById('servicesSubtitle').value = data.services.subtitle || '';
            document.getElementById('servicesDescription').value = data.services.description || '';
        }
        
        // Populate portfolio section
        if (data.portfolio) {
            document.getElementById('portfolioTitle').value = data.portfolio.title || '';
            document.getElementById('portfolioSubtitle').value = data.portfolio.subtitle || '';
            document.getElementById('portfolioDescription').value = data.portfolio.description || '';
        }
    } catch (error) {
        showMessage('contentMessage', 'Error cargando contenido', 'error');
    }
}

async function saveContentSection(sectionName) {
    let sectionData = {};
    
    if (sectionName === 'hero') {
        sectionData = {
            title: document.getElementById('heroTitle').value,
            subtitle: document.getElementById('heroSubtitle').value,
            description: document.getElementById('heroDescription').value,
            buttonText: document.getElementById('heroButtonText').value,
            textColor: document.getElementById('heroTextColor').value,
            backgroundColor: document.getElementById('heroBackgroundColor').value
        };
        
        const backgroundImageEl = document.getElementById('heroBackgroundImage');
        if (backgroundImageEl.dataset.url) {
            sectionData.backgroundImage = backgroundImageEl.dataset.url;
        }
    } else if (sectionName === 'services') {
        sectionData = {
            title: document.getElementById('servicesTitle').value,
            subtitle: document.getElementById('servicesSubtitle').value,
            description: document.getElementById('servicesDescription').value
        };
    } else if (sectionName === 'portfolio') {
        sectionData = {
            title: document.getElementById('portfolioTitle').value,
            subtitle: document.getElementById('portfolioSubtitle').value,
            description: document.getElementById('portfolioDescription').value
        };
    }
    
    try {
        const response = await fetch(`/api/content/${sectionName}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sectionData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('contentMessage', 'Contenido guardado correctamente', 'success');
            currentContent[sectionName] = data.data;
        } else {
            showMessage('contentMessage', data.message, 'error');
        }
    } catch (error) {
        showMessage('contentMessage', 'Error guardando contenido', 'error');
    }
}

async function loadGalleryItems() {
    try {
        const response = await fetch('/api/gallery');
        const items = await response.json();
        
        const container = document.getElementById('galleryItems');
        container.innerHTML = '';
        
        items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'gallery-item';
            itemDiv.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.title}">
                <h4>${item.title}</h4>
                <p>${item.description}</p>
                <p><strong>Categoría:</strong> ${item.category}</p>
                ${item.projectUrl ? `<p><strong>URL:</strong> <a href="${item.projectUrl}" target="_blank">Ver proyecto</a></p>` : ''}
                <div class="item-actions">
                    <button onclick="editGalleryItem(${item.id})" class="btn btn-secondary">Editar</button>
                    <button onclick="deleteGalleryItem(${item.id})" class="btn btn-danger">Eliminar</button>
                </div>
            `;
            container.appendChild(itemDiv);
        });
    } catch (error) {
        showMessage('galleryMessage', 'Error cargando galería', 'error');
    }
}

async function addGalleryItem() {
    const title = document.getElementById('galleryTitle').value;
    const description = document.getElementById('galleryDescription').value;
    const category = document.getElementById('galleryCategory').value;
    const projectUrl = document.getElementById('galleryProjectUrl').value;
    const imageFile = document.getElementById('galleryImage').files[0];
    
    if (!title || !description || !imageFile) {
        showMessage('galleryMessage', 'Por favor completa todos los campos requeridos', 'error');
        return;
    }
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('projectUrl', projectUrl);
    formData.append('image', imageFile);
    
    try {
        const response = await fetch('/api/gallery', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('galleryMessage', 'Proyecto agregado correctamente', 'success');
            
            // Clear form
            document.getElementById('galleryTitle').value = '';
            document.getElementById('galleryDescription').value = '';
            document.getElementById('galleryProjectUrl').value = '';
            document.getElementById('galleryImage').value = '';
            
            // Remove preview image
            const preview = document.querySelector('#galleryImage + img');
            if (preview) preview.remove();
            
            // Reload gallery
            loadGalleryItems();
        } else {
            showMessage('galleryMessage', data.message, 'error');
        }
    } catch (error) {
        showMessage('galleryMessage', 'Error agregando proyecto', 'error');
    }
}

async function deleteGalleryItem(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/gallery/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('galleryMessage', 'Proyecto eliminado correctamente', 'success');
            loadGalleryItems();
        } else {
            showMessage('galleryMessage', data.message, 'error');
        }
    } catch (error) {
        showMessage('galleryMessage', 'Error eliminando proyecto', 'error');
    }
}

async function loadSettings() {
    try {
        const response = await fetch('/api/settings');
        const settings = await response.json();
        currentSettings = settings;
        
        document.getElementById('siteName').value = settings.siteName || '';
        document.getElementById('primaryColor').value = settings.primaryColor || '#3b82f6';
        document.getElementById('secondaryColor').value = settings.secondaryColor || '#1e40af';
        document.getElementById('contactEmail').value = settings.contactEmail || '';
        document.getElementById('contactPhone').value = settings.contactPhone || '';
        document.getElementById('whatsappNumber').value = settings.whatsappNumber || '';
    } catch (error) {
        showMessage('settingsMessage', 'Error cargando configuración', 'error');
    }
}

async function saveSettings() {
    const settingsData = {
        siteName: document.getElementById('siteName').value,
        primaryColor: document.getElementById('primaryColor').value,
        secondaryColor: document.getElementById('secondaryColor').value,
        contactEmail: document.getElementById('contactEmail').value,
        contactPhone: document.getElementById('contactPhone').value,
        whatsappNumber: document.getElementById('whatsappNumber').value
    };
    
    try {
        const response = await fetch('/api/settings', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(settingsData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('settingsMessage', 'Configuración guardada correctamente', 'success');
            currentSettings = data.data;
        } else {
            showMessage('settingsMessage', data.message, 'error');
        }
    } catch (error) {
        showMessage('settingsMessage', 'Error guardando configuración', 'error');
    }
}

async function uploadImage(file, callback) {
    const formData = new FormData();
    formData.append('image', file);
    
    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            callback(data.imageUrl);
        } else {
            showMessage('contentMessage', 'Error subiendo imagen: ' + data.message, 'error');
        }
    } catch (error) {
        showMessage('contentMessage', 'Error subiendo imagen', 'error');
    }
}

function showMessage(containerId, message, type) {
    const container = document.getElementById(containerId);
    container.innerHTML = `<div class="message ${type}">${message}</div>`;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        container.innerHTML = '';
    }, 5000);
}

// Make functions available globally for onclick handlers
window.editGalleryItem = function(id) {
    // Implement edit functionality if needed
    alert('Función de edición en desarrollo');
};

window.deleteGalleryItem = deleteGalleryItem;