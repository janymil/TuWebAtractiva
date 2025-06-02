const fs = require('fs');
const path = require('path');

class HTMLEditor {
  constructor() {
    this.htmlFiles = {
      index: path.join(__dirname, '../index.html'),
      servicios: path.join(__dirname, '../servicios.html'),
      ejemplos: path.join(__dirname, '../ejemplos.html'),
      contacto: path.join(__dirname, '../contacto.html')
    };
  }

  // Read content from HTML files
  readContent() {
    try {
      const indexContent = fs.readFileSync(this.htmlFiles.index, 'utf8');
      
      return {
        hero: this.extractHeroSection(indexContent),
        services: this.extractServicesSection(indexContent),
        portfolio: this.extractPortfolioSection(indexContent)
      };
    } catch (error) {
      console.error('Error reading HTML content:', error);
      return {};
    }
  }

  // Extract hero section content
  extractHeroSection(html) {
    const heroSection = this.extractSection(html, 'hero');
    if (!heroSection) return {};

    return {
      title: this.extractText(heroSection, 'h1') || '',
      subtitle: this.extractText(heroSection, '.hero-subtitle') || '',
      description: this.extractText(heroSection, '.hero-description') || '',
      buttonText: this.extractText(heroSection, '.btn-primary') || '',
      backgroundImage: this.extractAttribute(heroSection, '.hero-image img', 'src') || '',
      textColor: this.extractCSSProperty(heroSection, 'color') || '#ffffff',
      backgroundColor: this.extractCSSProperty(heroSection, 'background-color') || '#1a202c'
    };
  }

  // Extract services section content
  extractServicesSection(html) {
    const servicesSection = this.extractSection(html, 'servicios');
    if (!servicesSection) return {};

    return {
      title: this.extractText(servicesSection, 'h2') || '',
      subtitle: this.extractText(servicesSection, '.section-subtitle') || '',
      description: this.extractText(servicesSection, '.section-description') || ''
    };
  }

  // Extract portfolio section content
  extractPortfolioSection(html) {
    const portfolioSection = this.extractSection(html, 'ejemplos');
    if (!portfolioSection) return {};

    return {
      title: this.extractText(portfolioSection, 'h2') || '',
      subtitle: this.extractText(portfolioSection, '.section-subtitle') || '',
      description: this.extractText(portfolioSection, '.section-description') || ''
    };
  }

  // Update content in HTML files
  updateContent(sectionName, data) {
    try {
      let html = fs.readFileSync(this.htmlFiles.index, 'utf8');

      if (sectionName === 'hero') {
        html = this.updateHeroSection(html, data);
      } else if (sectionName === 'services') {
        html = this.updateServicesSection(html, data);
      } else if (sectionName === 'portfolio') {
        html = this.updatePortfolioSection(html, data);
      }

      fs.writeFileSync(this.htmlFiles.index, html, 'utf8');
      return true;
    } catch (error) {
      console.error('Error updating HTML content:', error);
      return false;
    }
  }

  // Update hero section
  updateHeroSection(html, data) {
    if (data.title) {
      html = this.replaceText(html, 'section#hero h1', data.title);
    }
    if (data.subtitle) {
      html = this.replaceText(html, 'section#hero .hero-subtitle', data.subtitle);
    }
    if (data.description) {
      html = this.replaceText(html, 'section#hero .hero-description', data.description);
    }
    if (data.buttonText) {
      html = this.replaceText(html, 'section#hero .btn-primary', data.buttonText);
    }
    if (data.backgroundImage) {
      html = this.replaceAttribute(html, 'section#hero .hero-image img', 'src', data.backgroundImage);
    }

    return html;
  }

  // Update services section
  updateServicesSection(html, data) {
    if (data.title) {
      html = this.replaceText(html, 'section#servicios h2', data.title);
    }
    if (data.subtitle) {
      html = this.replaceText(html, 'section#servicios .section-subtitle', data.subtitle);
    }
    if (data.description) {
      html = this.replaceText(html, 'section#servicios .section-description', data.description);
    }

    return html;
  }

  // Update portfolio section
  updatePortfolioSection(html, data) {
    if (data.title) {
      html = this.replaceText(html, 'section#ejemplos h2', data.title);
    }
    if (data.subtitle) {
      html = this.replaceText(html, 'section#ejemplos .section-subtitle', data.subtitle);
    }
    if (data.description) {
      html = this.replaceText(html, 'section#ejemplos .section-description', data.description);
    }

    return html;
  }

  // Helper methods
  extractSection(html, sectionId) {
    const regex = new RegExp(`<section[^>]*id=["']${sectionId}["'][^>]*>([\\s\\S]*?)</section>`, 'i');
    const match = html.match(regex);
    return match ? match[1] : null;
  }

  extractText(html, selector) {
    // Simple text extraction - looks for content between tags
    if (selector.startsWith('.')) {
      const className = selector.substring(1);
      const regex = new RegExp(`class=["'][^"']*${className}[^"']*["'][^>]*>([^<]+)`, 'i');
      const match = html.match(regex);
      return match ? match[1].trim() : null;
    } else {
      const regex = new RegExp(`<${selector}[^>]*>([^<]+)`, 'i');
      const match = html.match(regex);
      return match ? match[1].trim() : null;
    }
  }

  extractAttribute(html, selector, attribute) {
    const regex = new RegExp(`${attribute}=["']([^"']+)["']`, 'i');
    const match = html.match(regex);
    return match ? match[1] : null;
  }

  extractCSSProperty(html, property) {
    // This is a simplified version - in practice, you'd parse CSS more thoroughly
    return null;
  }

  replaceText(html, selector, newText) {
    if (selector.includes('#') && selector.includes(' ')) {
      // Handle complex selectors like "section#hero h1"
      const [sectionPart, elementPart] = selector.split(' ');
      const sectionId = sectionPart.split('#')[1];
      
      // Find the section
      const sectionRegex = new RegExp(`(<section[^>]*id=["']${sectionId}["'][^>]*>)([\\s\\S]*?)(</section>)`, 'i');
      
      return html.replace(sectionRegex, (match, openTag, content, closeTag) => {
        // Replace content within the section
        let updatedContent = content;
        
        if (elementPart === 'h1') {
          updatedContent = content.replace(/(<h1[^>]*>)([^<]+)(<\/h1>)/i, `$1${newText}$3`);
        } else if (elementPart.startsWith('.')) {
          const className = elementPart.substring(1);
          const classRegex = new RegExp(`(<[^>]*class=["'][^"']*${className}[^"']*["'][^>]*>)([^<]+)(<\/[^>]+>)`, 'i');
          updatedContent = content.replace(classRegex, `$1${newText}$3`);
        }
        
        return openTag + updatedContent + closeTag;
      });
    }
    
    return html;
  }

  replaceAttribute(html, selector, attribute, newValue) {
    // Similar logic for replacing attributes
    return html;
  }

  // Gallery management
  getGalleryItems() {
    try {
      const html = fs.readFileSync(this.htmlFiles.ejemplos, 'utf8');
      // Extract gallery items from ejemplos.html
      // This would parse the portfolio cards and return them as objects
      return [];
    } catch (error) {
      console.error('Error reading gallery items:', error);
      return [];
    }
  }

  addGalleryItem(item) {
    try {
      // Add new gallery item to ejemplos.html
      return true;
    } catch (error) {
      console.error('Error adding gallery item:', error);
      return false;
    }
  }

  removeGalleryItem(id) {
    try {
      // Remove gallery item from ejemplos.html
      return true;
    } catch (error) {
      console.error('Error removing gallery item:', error);
      return false;
    }
  }
}

module.exports = HTMLEditor;