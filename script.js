// Función que se ejecuta cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Función principal de inicialización
function initializeApp() {
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeLazyLoading();
    initializeScrollToTop();
    initializeFormValidation();
    initializeResponsiveFeatures();
}

// ===== NAVEGACIÓN =====
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.header');

    // Toggle del menú hamburguesa
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Cerrar menú al hacer click en un enlace
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });

        // Cerrar menú al hacer click fuera de él
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }

    // Cambio de estilo del header al hacer scroll
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Ocultar/mostrar header al hacer scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    // Smooth scroll para enlaces internos
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Destacar enlace activo en la navegación
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', function() {
        let current = '';
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 200;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                current = sectionId;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ===== EFECTOS DE SCROLL =====
function initializeScrollEffects() {
    // Parallax effect para el hero
    const hero = document.querySelector('.hero');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    });

    // Efecto de progreso de lectura
    createReadingProgressBar();
}

// Crear barra de progreso de lectura
function createReadingProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.id = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #2C72B7, #0F2D3F);
        z-index: 9999;
        transition: width 0.3s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// ===== ANIMACIONES =====
function initializeAnimations() {
    // Observer para animaciones al hacer scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Aplicar animación según la clase
                if (element.classList.contains('animate-on-scroll')) {
                    element.classList.add('animate-fade-in');
                }
                
                if (element.classList.contains('slide-left')) {
                    element.classList.add('animate-slide-left');
                }
                
                if (element.classList.contains('slide-right')) {
                    element.classList.add('animate-slide-right');
                }
                
                if (element.classList.contains('scale-in')) {
                    element.classList.add('animate-scale');
                }
                
                // Animación de contador para números
                if (element.classList.contains('counter')) {
                    animateCounter(element);
                }
                
                observer.unobserve(element);
            }
        });
    }, observerOptions);

    // Observar elementos para animación
    const animateElements = document.querySelectorAll('.card, .objective-card, .council-member, .bank-card');
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.classList.add('animate-on-scroll');
        
        // Añadir delay escalonado
        setTimeout(() => {
            observer.observe(el);
        }, index * 100);
    });
}

// Animación de contadores
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target') || element.textContent);
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    updateCounter();
}

// ===== LAZY LOADING =====
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('fade-in');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ===== SCROLL TO TOP =====
function initializeScrollToTop() {
    // Crear botón scroll to top
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.setAttribute('aria-label', 'Volver arriba');
    
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #2C72B7, #0F2D3F);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 18px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
        opacity: 0;
        visibility: hidden;
        z-index: 1000;
        transform: translateY(20px);
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    // Mostrar/ocultar botón según scroll
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
            scrollToTopBtn.style.transform = 'translateY(0)';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
            scrollToTopBtn.style.transform = 'translateY(20px)';
        }
    });
    
    // Scroll suave hacia arriba
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effect
    scrollToTopBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.1)';
        this.style.boxShadow = '0 6px 12px rgba(0,0,0,0.4)';
    });
    
    scrollToTopBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
    });
}

// ===== VALIDACIÓN DE FORMULARIOS =====
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
                showNotification('Por favor, completa todos los campos requeridos correctamente.', 'error');
            }
        });
        
        // Validación en tiempo real
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    });
}

// Validar formulario completo
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Validar campo individual
function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    let isValid = true;
    let errorMessage = '';
    
    // Validar campo requerido
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Este campo es requerido.';
    }
    
    // Validaciones específicas por tipo
    if (value) {
        switch (type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Ingresa un email válido.';
                }
                break;
                
            case 'tel':
                const phoneRegex = /^[\d\s\-\+\(\)]+$/;
                if (!phoneRegex.test(value) || value.length < 10) {
                    isValid = false;
                    errorMessage = 'Ingresa un teléfono válido.';
                }
                break;
                
            case 'number':
                const min = parseFloat(field.getAttribute('min'));
                const max = parseFloat(field.getAttribute('max'));
                const numValue = parseFloat(value);
                
                if (isNaN(numValue)) {
                    isValid = false;
                    errorMessage = 'Ingresa un número válido.';
                } else if (!isNaN(min) && numValue < min) {
                    isValid = false;
                    errorMessage = `El valor mínimo es ${min}.`;
                } else if (!isNaN(max) && numValue > max) {
                    isValid = false;
                    errorMessage = `El valor máximo es ${max}.`;
                }
                break;
        }
    }
    
    // Mostrar u ocultar error
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

// Mostrar error en campo
function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        animation: fadeIn 0.3s ease;
    `;
    
    field.parentNode.appendChild(errorDiv);
}

// Limpiar error en campo
function clearFieldError(field) {
    field.classList.remove('error');
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// ===== NOTIFICACIONES =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
        transform: translateX(100%);
    `;
    
    document.body.appendChild(notification);
    
    // Animación de entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto close después de 5 segundos
    const autoClose = setTimeout(() => {
        closeNotification(notification);
    }, 5000);
    
    // Botón de cerrar
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: auto;
        opacity: 0.8;
    `;
    
    closeBtn.addEventListener('click', () => {
        clearTimeout(autoClose);
        closeNotification(notification);
    });
}

function closeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

function getNotificationIcon(type) {
    const icons = {
        info: 'info-circle',
        success: 'check-circle',
        warning: 'exclamation-triangle',
        error: 'times-circle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        info: '#2C72B7',
        success: '#28a745',
        warning: '#ffc107',
        error: '#dc3545'
    };
    return colors[type] || '#2C72B7';
}

// ===== CARACTERÍSTICAS RESPONSIVE =====
function initializeResponsiveFeatures() {
    // Detectar cambios en el tamaño de pantalla
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            handleResponsiveChanges();
        }, 250);
    });
    
    // Manejo inicial
    handleResponsiveChanges();
}

function handleResponsiveChanges() {
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
    
    // Ajustar comportamiento según el dispositivo
    if (isMobile) {
        // Comportamiento para móviles
        document.body.classList.add('mobile');
        document.body.classList.remove('tablet', 'desktop');
        
        // Reducir animaciones en móviles para mejor rendimiento
        document.body.classList.add('reduced-motion');
        
    } else if (isTablet) {
        // Comportamiento para tablets
        document.body.classList.add('tablet');
        document.body.classList.remove('mobile', 'desktop');
        document.body.classList.remove('reduced-motion');
        
    } else {
        // Comportamiento para desktop
        document.body.classList.add('desktop');
        document.body.classList.remove('mobile', 'tablet');
        document.body.classList.remove('reduced-motion');
    }
}

// ===== EFECTOS VISUALES AVANZADOS =====
function initializeAdvancedEffects() {
    // Efecto de partículas en el hero
    createParticleEffect();
    
    // Efecto de typing en el hero
    initializeTypingEffect();
    
    // Hover effects mejorados para cards
    initializeCardEffects();
}

// Crear efecto de partículas
function createParticleEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    particlesContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
    `;
    
    hero.appendChild(particlesContainer);
    
    // Crear partículas
    for (let i = 0; i < 50; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const size = Math.random() * 4 + 2;
    const x = Math.random() * 100;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;
    
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 50%;
        left: ${x}%;
        top: 100%;
        animation: floatUp ${duration}s ${delay}s infinite linear;
    `;
    
    container.appendChild(particle);
}

// Efecto de escritura automática
function initializeTypingEffect() {
    const typingElement = document.querySelector('.hero-description');
    if (!typingElement) return;
    
    const text = typingElement.textContent;
    typingElement.textContent = '';
    typingElement.style.borderRight = '2px solid rgba(255,255,255,0.8)';
    
    let index = 0;
    const typeSpeed = 50;
    
    function typeWriter() {
        if (index < text.length) {
            typingElement.textContent += text.charAt(index);
            index++;
            setTimeout(typeWriter, typeSpeed);
        } else {
            // Remover cursor después de completar
            setTimeout(() => {
                typingElement.style.borderRight = 'none';
            }, 1000);
        }
    }
    
    // Iniciar efecto después de 2 segundos
    setTimeout(typeWriter, 2000);
}

// Efectos mejorados para cards
function initializeCardEffects() {
    const cards = document.querySelectorAll('.card, .objective-card, .council-member, .bank-card');
    
    cards.forEach(card => {
        // Efecto de inclinación en hover
        card.addEventListener('mouseenter', function(e) {
            this.style.transform = 'translateY(-10px) rotateX(5deg)';
            this.style.transition = 'all 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function(e) {
            this.style.transform = 'translateY(0) rotateX(0deg)';
        });
        
        // Efecto de seguimiento del mouse
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            this.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
    });
}

// ===== UTILIDADES =====
// Debounce function para optimizar rendimiento
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

// Throttle function para eventos de scroll
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Formatear números con separadores de miles
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Validar cédula dominicana (formato básico)
function validateCedula(cedula) {
    const cedulaRegex = /^\d{3}-\d{7}-\d{1}$/;
    return cedulaRegex.test(cedula);
}

// Formatear cédula automáticamente
function formatCedula(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length >= 3) {
        value = value.substring(0, 3) + '-' + value.substring(3);
    }
    if (value.length >= 11) {
        value = value.substring(0, 11) + '-' + value.substring(11, 12);
    }
    
    input.value = value;
}

// Formatear teléfono
function formatPhone(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length >= 3) {
        value = '(' + value.substring(0, 3) + ') ' + value.substring(3);
    }
    if (value.length >= 9) {
        value = value.substring(0, 9) + '-' + value.substring(9, 13);
    }
    
    input.value = value;
}

// ===== PERFORMANCE =====
// Optimizar scroll events
const optimizedScrollHandler = throttle(function() {
    // Manejar efectos de scroll aquí
}, 16); // 60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Precargar imágenes importantes
function preloadImages() {
    const importantImages = [
        'img/logo.jpg',
        'img/consejo.jpg'
    ];
    
    importantImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// ===== ACCESSIBILITY =====
function initializeAccessibility() {
    // Soporte para navegación por teclado
    document.addEventListener('keydown', function(e) {
        // ESC para cerrar menú móvil
        if (e.key === 'Escape') {
            const hamburger = document.querySelector('.hamburger');
            const navMenu = document.querySelector('.nav-menu');
            
            if (hamburger && navMenu && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        }
        
        // Enter en cards para activar hover effect
        if (e.key === 'Enter' && e.target.classList.contains('card')) {
            e.target.click();
        }
    });
    
    // Añadir indicadores de focus visibles
    const focusableElements = document.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.classList.add('focused');
        });
        
        element.addEventListener('blur', function() {
            this.classList.remove('focused');
        });
    });
}

// ===== ANALYTICS Y TRACKING =====
function trackUserInteraction(action, category = 'general') {
    // Aquí puedes integrar Google Analytics o cualquier otro servicio
    console.log(`Tracking: ${category} - ${action}`);
    
    // Ejemplo para Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: window.location.pathname
        });
    }
}

// Rastrear clics en botones importantes
document.addEventListener('click', function(e) {
    if (e.target.matches('.btn-primary, .btn-cta')) {
        trackUserInteraction('solicitud_beca_click', 'conversions');
    }
    
    if (e.target.matches('.social-link')) {
        const platform = e.target.className.split(' ').find(c => c !== 'social-link');
        trackUserInteraction(`social_${platform}_click`, 'social');
    }
});

// ===== INICIALIZACIÓN COMPLETA =====
// Ejecutar funciones adicionales cuando todo esté listo
window.addEventListener('load', function() {
    preloadImages();
    initializeAccessibility();
    initializeAdvancedEffects();
    
    // Mostrar notificación de bienvenida
    setTimeout(() => {
        showNotification('¡Bienvenido a FUTRAVIF! Explora nuestros programas educativos.', 'success');
    }, 2000);
});

// ===== MANEJO DE ERRORES =====
window.addEventListener('error', function(e) {
    console.error('Error en la aplicación:', e.error);
    
    // En producción, enviar errores a servicio de logging
    if (window.location.hostname !== 'localhost') {
        // trackError(e.error);
    }
});

// ===== FUNCIONES DE UTILIDAD ADICIONALES =====
// Detectar si el usuario prefiere modo oscuro
function detectDarkMode() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// Obtener información del dispositivo
function getDeviceInfo() {
    return {
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
        isAndroid: /Android/.test(navigator.userAgent),
        isTouchDevice: 'ontouchstart' in window
    };
}

// Función para copiar texto al portapapeles
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showNotification('Texto copiado al portapapeles', 'success');
        return true;
    } catch (err) {
        console.error('Error al copiar:', err);
        showNotification('No se pudo copiar el texto', 'error');
        return false;
    }
}

// Añadir funcionalidad de copia para números de cuenta
document.addEventListener('click', function(e) {
    if (e.target.closest('.account-info')) {
        const accountNumber = e.target.textContent.match(/\d{3}-\d{6}-\d/);
        if (accountNumber) {
            copyToClipboard(accountNumber[0]);
        }
    }
});

// ===== CSS DINÁMICO ADICIONAL =====
// Añadir estilos CSS adicionales dinámicamente
const additionalCSS = `
@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes floatUp {
    0% {
        transform: translateY(0) rotate(0deg);
        opacity: 1;
    }
    100% {
        transform: translateY(-100vh) rotate(360deg);
        opacity: 0;
    }
}

.notification {
    font-family: var(--font-primary);
    font-size: 0.9rem;
}

.notification-close:hover {
    opacity: 1 !important;
    transform: scale(1.1);
}

.field-error {
    display: block;
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}

.error {
    border-color: #dc3545 !important;
    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
}

.focused {
    outline: 2px solid #2C72B7 !important;
    outline-offset: 2px !important;
}

.mobile .card, .mobile .objective-card {
    transform: none !important;
    transition: box-shadow 0.3s ease !important;
}

.mobile .card:hover, .mobile .objective-card:hover {
    transform: none !important;
    box-shadow: 0 8px 16px rgba(0,0,0,0.2) !important;
}

.reduced-motion * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
}

.header.scrolled {
    background: rgba(15, 45, 63, 0.98);
    backdrop-filter: blur(20px);
    box-shadow: 0 2px 20px rgba(0,0,0,0.1);
}

.particles-container {
    z-index: 1;
}

.particle {
    pointer-events: none;
}

.scroll-to-top:active {
    transform: scale(0.95) !important;
}

/* Mejoras de accesibilidad */
@media (prefers-reduced-motion: reduce) {
    .hero::before,
    .particle,
    .cta-section::before {
        animation: none !important;
    }
    
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}

/* Estilos para impresión */
@media print {
    .hamburger,
    .scroll-to-top,
    .particles-container,
    .notification {
        display: none !important;
    }
    
    .hero {
        height: auto !important;
        background: white !important;
        color: black !important;
        padding: 2rem 0 !important;
    }
    
    .hero-content * {
        color: black !important;
    }
    
    .section {
        page-break-inside: avoid;
        padding: 1rem 0 !important;
    }
    
    .card, .objective-card, .council-member, .bank-card {
        box-shadow: none !important;
        border: 1px solid #ccc !important;
        page-break-inside: avoid;
    }
}

/* Estados de carga */
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(15, 45, 63, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    backdrop-filter: blur(5px);
}

.spinner {
    width: 50px;
    height: 50px;
    border: 4px solid rgba(44, 114, 183, 0.3);
    border-top: 4px solid #2C72B7;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Mejoras de UX */
.nav-link.active {
    color: #2C72B7 !important;
    background: rgba(44, 114, 183, 0.1) !important;
}

.nav-link.active::after {
    width: 80% !important;
}

/* Hover mejorado para elementos interactivos */
.bank-card:hover {
    border-color: #0F2D3F;
    cursor: pointer;
}

.council-member:hover {
    border-top-color: #0F2D3F;
}

/* Efectos de gradiente animados */
.gradient-text {
    background: linear-gradient(45deg, #2C72B7, #0F2D3F);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

/* Estados de hover para botones sociales */
.social-link:hover {
    transform: translateY(-3px) scale(1.1);
    filter: brightness(1.2);
}

/* Indicador de scroll */
.scroll-indicator {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    color: white;
    animation: bounce 2s infinite;
}

@keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
        transform: translateX(-50%) translateY(0);
    }
    40% {
        transform: translateX(-50%) translateY(-10px);
    }
    60% {
        transform: translateX(-50%) translateY(-5px);
    }
}
`;

// Inyectar CSS adicional
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalCSS;
document.head.appendChild(styleSheet);

// ===== INICIALIZACIÓN FINAL =====
// Asegurar que todo esté inicializado correctamente
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Añadir indicador de scroll en el hero
setTimeout(() => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrollIndicator = document.createElement('div');
        scrollIndicator.className = 'scroll-indicator';
        scrollIndicator.innerHTML = '<i class="fas fa-chevron-down"></i>';
        scrollIndicator.style.cssText = `
            position: absolute;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            color: white;
            font-size: 1.5rem;
            animation: bounce 2s infinite;
            cursor: pointer;
        `;
        
        scrollIndicator.addEventListener('click', function() {
            document.getElementById('nosotros').scrollIntoView({
                behavior: 'smooth'
            });
        });
        
        hero.appendChild(scrollIndicator);
    }
}, 1000);

// ===== FUNCIONES ESPECÍFICAS PARA FUTRAVIF =====
// Función para manejar solicitudes de beca
function handleBecaApplication() {
    trackUserInteraction('formulario_beca_inicio', 'conversions');
    window.location.href = 'Formulario/formulario.html';
}

// Función para manejar contacto
function handleContact(method) {
    trackUserInteraction(`contacto_${method}`, 'contact');
}

// Añadir listeners para eventos específicos
document.addEventListener('click', function(e) {
    // Tracking de interacciones
    if (e.target.matches('a[href="Formulario/formulario.html"]')) {
        handleBecaApplication();
    }
    
    if (e.target.matches('.social-link')) {
        const platform = Array.from(e.target.classList).find(c => c !== 'social-link');
        handleContact(platform);
    }
});

// Función para mostrar información de cuenta bancaria
function showAccountDetails(element) {
    const accountInfo = element.querySelector('.account-info');
    if (accountInfo) {
        accountInfo.style.background = 'rgba(44, 114, 183, 0.1)';
        accountInfo.style.borderRadius = '8px';
        accountInfo.style.padding = '1rem';
        accountInfo.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            accountInfo.style.background = 'transparent';
            accountInfo.style.padding = '0';
        }, 2000);
    }
}

// Añadir funcionalidad a las tarjetas bancarias
document.querySelectorAll('.bank-card').forEach(card => {
    card.addEventListener('click', function() {
        showAccountDetails(this);
        showNotification('Información de cuenta destacada. Haz clic en el número para copiarlo.', 'info');
    });
});

console.log('FUTRAVIF Website JavaScript loaded successfully! 🚀');
console.log('Versión: 1.0.0');
console.log('Desarrollado para: Fundación Transformando Vidas para el Futuro');