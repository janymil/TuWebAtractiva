const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const HTMLEditor = require('./htmlEditor');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from parent directory
app.use(express.static(path.join(__dirname, '..')));

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// HTML Editor instance
const htmlEditor = new HTMLEditor();

let galleryData = [
  {
    id: 1,
    title: "Sitio Web para Restaurante",
    description: "Diseño moderno con sistema de reservas online",
    imageUrl: "/ejemplos/mockup-restaurante.svg",
    category: "restaurante",
    isActive: true
  },
  {
    id: 2,
    title: "Página Web para Consultorio Médico",
    description: "Sitio profesional con sistema de citas",
    imageUrl: "/ejemplos/mockup-consultorio.svg",
    category: "salud",
    isActive: true
  },
  {
    id: 3,
    title: "E-commerce para Boutique",
    description: "Tienda online con carrito de compras",
    imageUrl: "/ejemplos/mockup-boutique.svg",
    category: "ecommerce",
    isActive: true
  }
];

let siteSettings = {
  siteName: "WebSimple Perú",
  primaryColor: "#3b82f6",
  secondaryColor: "#1e40af",
  contactEmail: "contacto@websimple.pe",
  contactPhone: "+51 999 888 777",
  whatsappNumber: "+51999888777"
};

// Admin login endpoint (simple authentication for demo)
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  // Simple hardcoded credentials for demo
  if (username === 'admin' && password === 'admin123') {
    res.json({ 
      success: true, 
      message: 'Login successful',
      token: 'demo-token-' + Date.now()
    });
  } else {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid credentials' 
    });
  }
});

// Get all content sections
app.get('/api/content', (req, res) => {
  const content = htmlEditor.readContent();
  res.json(content);
});

// Update content section
app.put('/api/content/:section', (req, res) => {
  const { section } = req.params;
  const updateData = req.body;
  
  const success = htmlEditor.updateContent(section, updateData);
  
  if (success) {
    res.json({ 
      success: true, 
      message: 'Content updated successfully',
      data: updateData
    });
  } else {
    res.status(500).json({ 
      success: false, 
      message: 'Error updating content' 
    });
  }
});

// Get gallery items
app.get('/api/gallery', (req, res) => {
  res.json(galleryData.filter(item => item.isActive));
});

// Add gallery item
app.post('/api/gallery', upload.single('image'), (req, res) => {
  try {
    const { title, description, category, projectUrl } = req.body;
    
    const newItem = {
      id: Date.now(),
      title,
      description,
      category,
      projectUrl: projectUrl || '',
      imageUrl: req.file ? `/uploads/${req.file.filename}` : '',
      isActive: true,
      createdAt: new Date().toISOString()
    };
    
    galleryData.push(newItem);
    
    res.json({ 
      success: true, 
      message: 'Gallery item added successfully',
      data: newItem
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error adding gallery item: ' + error.message
    });
  }
});

// Update gallery item
app.put('/api/gallery/:id', upload.single('image'), (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, projectUrl } = req.body;
    
    const itemIndex = galleryData.findIndex(item => item.id === parseInt(id));
    
    if (itemIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Gallery item not found' 
      });
    }
    
    const updateData = {
      title,
      description,
      category,
      projectUrl: projectUrl || galleryData[itemIndex].projectUrl
    };
    
    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }
    
    galleryData[itemIndex] = { ...galleryData[itemIndex], ...updateData };
    
    res.json({ 
      success: true, 
      message: 'Gallery item updated successfully',
      data: galleryData[itemIndex]
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error updating gallery item: ' + error.message
    });
  }
});

// Delete gallery item
app.delete('/api/gallery/:id', (req, res) => {
  const { id } = req.params;
  const itemIndex = galleryData.findIndex(item => item.id === parseInt(id));
  
  if (itemIndex === -1) {
    return res.status(404).json({ 
      success: false, 
      message: 'Gallery item not found' 
    });
  }
  
  galleryData[itemIndex].isActive = false;
  
  res.json({ 
    success: true, 
    message: 'Gallery item deleted successfully'
  });
});

// Get site settings
app.get('/api/settings', (req, res) => {
  res.json(siteSettings);
});

// Update site settings
app.put('/api/settings', (req, res) => {
  siteSettings = { ...siteSettings, ...req.body };
  res.json({ 
    success: true, 
    message: 'Settings updated successfully',
    data: siteSettings
  });
});

// Upload image endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Image uploaded successfully',
      imageUrl: `/uploads/${req.file.filename}`
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error uploading image: ' + error.message
    });
  }
});

// Serve uploads directory
app.use('/uploads', express.static('uploads'));

// Admin dashboard route
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../admin/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`Admin panel available at http://0.0.0.0:${PORT}/admin`);
});

module.exports = app;