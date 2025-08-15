// ===== CONFIGURACIÓN GLOBAL =====
let isVideoInitialized = false;

// Función que se ejecuta cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Iniciando aplicación...');
    initializeApp();
});

// Función principal de inicialización
function initializeApp() {
    console.log('Inicializando aplicación FUTRAVIF...');
    
    // Inicialización en orden específico
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeLazyLoading();
    initializeScrollToTop();
    initializeFormValidation();
    initializeResponsiveFeatures();
    initializeAccessibility();
    
    // Video player debe inicializarse después de todo lo demás
    setTimeout(() => {
        initializeVideoPlayer();
    }, 500);
    
    console.log('Aplicación inicializada correctamente ✅');
}

// ===== FUNCIONALIDAD DE VIDEO =====
function initializeVideoPlayer() {
    if (isVideoInitialized) {
        console.log('Video player ya inicializado, saltando...');
        return;
    }

    const video = document.getElementById('fundacion-video');
    
    if (!video) {
        console.log('⚠️ Video element not found');
        return;
    }

    console.log('🎬 Inicializando video player...');
    isVideoInitialized = true;

    // Variables globales del video
    let isPlaying = false;
    let controlsTimeout;

    // Elementos del DOM
    const videoWrapper = document.querySelector('.video-wrapper');
    const overlay = document.getElementById('video-overlay');
    const playButton = document.getElementById('play-button');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const progressBar = document.getElementById('progress-bar');
    const progressFill = document.getElementById('progress-fill');
    const timeDisplay = document.getElementById('time-display');
    const volumeBtn = document.getElementById('volume-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const videoControls = document.getElementById('video-controls');

    // ===== FUNCIÓN PRINCIPAL DE PLAY/PAUSE =====
    function togglePlay() {
        console.log('🎯 Toggle play called, video paused:', video.paused);
        
        if (video.paused) {
            // Reproducir
            const playPromise = video.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('▶️ Video playing successfully');
                    isPlaying = true;
                    updateUIForPlay();
                    hideControlsAfterDelay();
                }).catch(error => {
                    console.error('❌ Error playing video:', error);
                    showNotification('Error al reproducir el video: ' + error.message, 'error');
                });
            }
        } else {
            // Pausar
            video.pause();
            isPlaying = false;
            updateUIForPause();
            clearTimeout(controlsTimeout);
        }
    }

    function updateUIForPlay() {
        if (overlay) overlay.style.display = 'none';
        if (videoWrapper) videoWrapper.classList.add('playing');
        if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }

    function updateUIForPause() {
        if (overlay) overlay.style.display = 'flex';
        if (videoWrapper) videoWrapper.classList.remove('playing');
        if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        if (videoControls) videoControls.style.opacity = '1';
    }

    // ===== ACTUALIZAR PROGRESO =====
    function updateProgress() {
        if (video.duration && progressFill && timeDisplay) {
            const progress = (video.currentTime / video.duration) * 100;
            progressFill.style.width = progress + '%';
            
            // Actualizar tiempo
            const currentMin = Math.floor(video.currentTime / 60);
            const currentSec = Math.floor(video.currentTime % 60);
            const totalMin = Math.floor(video.duration / 60);
            const totalSec = Math.floor(video.duration % 60);
            
            timeDisplay.textContent = 
                `${currentMin}:${currentSec.toString().padStart(2, '0')} / ${totalMin}:${totalSec.toString().padStart(2, '0')}`;
        }
    }

    // ===== CAMBIAR POSICIÓN DEL VIDEO =====
    function setProgress(e) {
        if (!progressBar || !video.duration) return;
        
        const rect = progressBar.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        video.currentTime = pos * video.duration;
    }

    // ===== CONTROLAR VOLUMEN =====
    function toggleMute() {
        if (!volumeBtn) return;
        
        video.muted = !video.muted;
        volumeBtn.innerHTML = video.muted ? 
            '<i class="fas fa-volume-mute"></i>' : 
            '<i class="fas fa-volume-up"></i>';
    }

    function changeVolume() {
        if (!volumeSlider) return;
        
        video.volume = volumeSlider.value;
        video.muted = video.volume === 0;
        
        if (volumeBtn) {
            volumeBtn.innerHTML = video.muted || video.volume === 0 ? 
                '<i class="fas fa-volume-mute"></i>' : 
                '<i class="fas fa-volume-up"></i>';
        }
    }

    // ===== PANTALLA COMPLETA =====
    function toggleFullscreen() {
        if (!videoWrapper) return;
        
        if (!document.fullscreenElement) {
            videoWrapper.requestFullscreen().catch(err => {
                console.error('❌ Error fullscreen:', err);
            });
        } else {
            document.exitFullscreen().catch(err => {
                console.error('❌ Error exit fullscreen:', err);
            });
        }
    }

    // ===== OCULTAR CONTROLES =====
    function hideControlsAfterDelay() {
        if (!videoControls) return;
        
        clearTimeout(controlsTimeout);
        videoControls.style.opacity = '1';
        
        if (isPlaying) {
            controlsTimeout = setTimeout(() => {
                if (isPlaying && !videoWrapper.matches(':hover')) {
                    videoControls.style.opacity = '0';
                }
            }, 3000);
        }
    }

    // ===== SETUP EVENT LISTENERS =====
    function setupVideoEventListeners() {
        // Play buttons
        if (playButton) {
            playButton.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('🎯 Main play button clicked');
                togglePlay();
            });
        }

        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('🎯 Control play button clicked');
                togglePlay();
            });
        }

        // Video click
        video.addEventListener('click', function(e) {
            e.preventDefault();
            togglePlay();
        });

        // Progress bar
        if (progressBar) {
            progressBar.addEventListener('click', setProgress);
        }

        // Volume controls
        if (volumeBtn) {
            volumeBtn.addEventListener('click', toggleMute);
        }
        
        if (volumeSlider) {
            volumeSlider.addEventListener('input', changeVolume);
            volumeSlider.value = 1;
            video.volume = 1;
        }

        // Fullscreen
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', toggleFullscreen);
        }

        // Video events
        video.addEventListener('timeupdate', updateProgress);
        
        video.addEventListener('loadedmetadata', function() {
            console.log('📊 Video metadata loaded');
            updateProgress();
        });

        video.addEventListener('ended', function() {
            console.log('🔚 Video ended');
            isPlaying = false;
            if (overlay) overlay.style.display = 'flex';
            if (videoWrapper) videoWrapper.classList.remove('playing');
            if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-replay"></i>';
            if (videoControls) videoControls.style.opacity = '1';
        });

        video.addEventListener('error', function(e) {
            console.error('❌ Video error:', e);
            console.error('Error code:', video.error ? video.error.code : 'unknown');
            showNotification('Error al cargar el video. Verifica la ruta: Videos/Video_Fundacion.mp4', 'error');
        });

        // Mouse events para mostrar controles
        if (videoWrapper) {
            videoWrapper.addEventListener('mouseenter', function() {
                if (videoControls) videoControls.style.opacity = '1';
                clearTimeout(controlsTimeout);
            });

            videoWrapper.addEventListener('mouseleave', function() {
                if (isPlaying) hideControlsAfterDelay();
            });

            videoWrapper.addEventListener('mousemove', function() {
                if (isPlaying) hideControlsAfterDelay();
            });
        }

        // Keyboard shortcuts
        video.setAttribute('tabindex', '0');
        video.addEventListener('keydown', function(e) {
            switch(e.code) {
                case 'Space':
                    e.preventDefault();
                    togglePlay();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    video.currentTime = Math.max(0, video.currentTime - 10);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    video.currentTime = Math.min(video.duration || 0, video.currentTime + 10);
                    break;
                case 'KeyM':
                    e.preventDefault();
                    toggleMute();
                    break;
            }
        });

        // Fullscreen change event
        document.addEventListener('fullscreenchange', function() {
            if (fullscreenBtn) {
                fullscreenBtn.innerHTML = document.fullscreenElement ? 
                    '<i class="fas fa-compress"></i>' : 
                    '<i class="fas fa-expand"></i>';
            }
        });

        console.log('🎧 Video event listeners configurados');
    }

    // Configurar todos los event listeners
    setupVideoEventListeners();
    
    console.log('✅ Video player initialized successfully!');
}

// ===== NAVEGACIÓN =====
function initializeNavigation() {
    console.log('🧭 Inicializando navegación...');
    
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
    window.addEventListener('scroll', throttle(function() {
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
    }, 16));

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
    
    window.addEventListener('scroll', throttle(function() {
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
    }, 100));

    console.log('✅ Navegación inicializada');
}

// ===== EFECTOS DE SCROLL =====
function initializeScrollEffects() {
    console.log('📜 Inicializando efectos de scroll...');
    
    // Parallax effect para el hero
    const hero = document.querySelector('.hero');
    
    window.addEventListener('scroll', throttle(function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    }, 16));

    // Efecto de progreso de lectura
    createReadingProgressBar();
    
    console.log('✅ Efectos de scroll inicializados');
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
    
    window.addEventListener('scroll', throttle(function() {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    }, 16));
}

// ===== ANIMACIONES =====
function initializeAnimations() {
    console.log('🎨 Inicializando animaciones...');
    
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

    console.log('✅ Animaciones inicializadas');
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
    console.log('🖼️ Inicializando lazy loading...');
    
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
    
    console.log('✅ Lazy loading inicializado');
}

// ===== SCROLL TO TOP =====
function initializeScrollToTop() {
    console.log('⬆️ Inicializando scroll to top...');
    
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
    window.addEventListener('scroll', throttle(function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
            scrollToTopBtn.style.transform = 'translateY(0)';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
            scrollToTopBtn.style.transform = 'translateY(20px)';
        }
    }, 100));
    
    // Scroll suave hacia arriba
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effects
    scrollToTopBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.1)';
        this.style.boxShadow = '0 6px 12px rgba(0,0,0,0.4)';
    });
    
    scrollToTopBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
    });

    console.log('✅ Scroll to top inicializado');
}

// ===== VALIDACIÓN DE FORMULARIOS =====
function initializeFormValidation() {
    console.log('📋 Inicializando validación de formularios...');
    
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

    console.log('✅ Validación de formularios inicializada');
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
    console.log('📱 Inicializando características responsive...');
    
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

    console.log('✅ Características responsive inicializadas');
}

function handleResponsiveChanges() {
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
    
    // Ajustar comportamiento según el dispositivo
    if (isMobile) {
        document.body.classList.add('mobile');
        document.body.classList.remove('tablet', 'desktop');
        document.body.classList.add('reduced-motion');
        
    } else if (isTablet) {
        document.body.classList.add('tablet');
        document.body.classList.remove('mobile', 'desktop');
        document.body.classList.remove('reduced-motion');
        
    } else {
        document.body.classList.add('desktop');
        document.body.classList.remove('mobile', 'tablet');
        document.body.classList.remove('reduced-motion');
    }
}

// ===== ACCESSIBILITY =====
function initializeAccessibility() {
    console.log('♿ Inicializando accesibilidad...');
    
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

    console.log('✅ Accesibilidad inicializada');
}

// ===== EFECTOS VISUALES AVANZADOS =====
function initializeAdvancedEffects() {
    console.log('✨ Inicializando efectos avanzados...');
    
    // Efecto de partículas en el hero
    createParticleEffect();
    
    // Efecto de typing en el hero
    initializeTypingEffect();
    
    // Hover effects mejorados para cards
    initializeCardEffects();

    console.log('✅ Efectos avanzados inicializados');
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

// ===== ANALYTICS Y TRACKING =====
function trackUserInteraction(action, category = 'general') {
    // Aquí puedes integrar Google Analytics o cualquier otro servicio
    console.log(`📊 Tracking: ${category} - ${action}`);
    
    // Ejemplo para Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: window.location.pathname
        });
    }
}

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

// ===== EVENT LISTENERS GLOBALES =====
function setupGlobalEventListeners() {
    console.log('🎧 Configurando event listeners globales...');
    
    // Rastrear clics en botones importantes
    document.addEventListener('click', function(e) {
        if (e.target.matches('.btn-primary, .btn-cta')) {
            trackUserInteraction('solicitud_beca_click', 'conversions');
        }
        
        if (e.target.matches('.social-link')) {
            const platform = e.target.className.split(' ').find(c => c !== 'social-link');
            trackUserInteraction(`social_${platform}_click`, 'social');
        }
        
        // Tracking de interacciones específicas
        if (e.target.matches('a[href="Formulario/formulario.html"]')) {
            handleBecaApplication();
        }
        
        if (e.target.matches('.social-link')) {
            const platform = Array.from(e.target.classList).find(c => c !== 'social-link');
            handleContact(platform);
        }
        
        // Funcionalidad de copia para números de cuenta
        if (e.target.closest('.account-info')) {
            const accountNumber = e.target.textContent.match(/\d{3}-\d{6}-\d|\d{10}/);
            if (accountNumber) {
                copyToClipboard(accountNumber[0]);
            }
        }
    });

    // Añadir funcionalidad a las tarjetas bancarias
    document.querySelectorAll('.bank-card').forEach(card => {
        card.addEventListener('click', function() {
            showAccountDetails(this);
            showNotification('Información de cuenta destacada. Haz clic en el número para copiarlo.', 'info');
        });
    });

    console.log('✅ Event listeners globales configurados');
}

// ===== CSS DINÁMICO =====
function injectDynamicCSS() {
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

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
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

.nav-link.active {
    color: #2C72B7 !important;
    background: rgba(44, 114, 183, 0.1) !important;
}

.bank-card:hover {
    border-color: #0F2D3F;
    cursor: pointer;
}

.council-member:hover {
    border-top-color: #0F2D3F;
}

.social-link:hover {
    transform: translateY(-3px) scale(1.1);
    filter: brightness(1.2);
}

.scroll-indicator {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    color: white;
    animation: bounce 2s infinite;
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
`;

    // Inyectar CSS adicional
    const styleSheet = document.createElement('style');
    styleSheet.textContent = additionalCSS;
    document.head.appendChild(styleSheet);
}

// ===== MANEJO DE ERRORES =====
function setupErrorHandling() {
    window.addEventListener('error', function(e) {
        console.error('❌ Error en la aplicación:', e.error);
        
        // En producción, enviar errores a servicio de logging
        if (window.location.hostname !== 'localhost') {
            trackUserInteraction('javascript_error', 'errors');
        }
    });

    window.addEventListener('unhandledrejection', function(e) {
        console.error('❌ Promise rejection no manejada:', e.reason);
    });
}

// ===== INICIALIZACIÓN FINAL =====
// Ejecutar cuando la página esté completamente cargada
window.addEventListener('load', function() {
    console.log('🚀 Página completamente cargada - Ejecutando funciones adicionales...');
    
    // Funciones que necesitan que todo esté cargado
    preloadImages();
    initializeAdvancedEffects();
    setupGlobalEventListeners();
    injectDynamicCSS();
    setupErrorHandling();
    
    // Mostrar notificación de bienvenida
    setTimeout(() => {
        showNotification('¡Bienvenido a FUTRAVIF! Explora nuestros programas educativos.', 'success');
    }, 2000);
    
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
                z-index: 10;
            `;
            
            scrollIndicator.addEventListener('click', function() {
                const nosotrosSection = document.getElementById('nosotros');
                if (nosotrosSection) {
                    nosotrosSection.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
            
            hero.appendChild(scrollIndicator);
        }
    }, 1000);

    console.log('🎉 FUTRAVIF Website completamente inicializado!');
});

// Backup initialization si DOMContentLoaded ya pasó
if (document.readyState === 'loading') {
    // Ya tenemos el listener de DOMContentLoaded arriba
} else {
    // DOM ya está listo, inicializar inmediatamente
    console.log('DOM ya estaba listo, inicializando...');
    initializeApp();
}

// ===== CARRUSEL LIMPIO DE UNIVERSIDADES =====
// Reemplaza el código anterior del carrusel con este:

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del carrusel
    const carouselTrack = document.getElementById('carousel-track-clean');
    const dots = document.querySelectorAll('.dot');
    
    // Variables
    let currentDot = 0;
    const totalDots = dots.length;
    let dotInterval;
    
    // Función para actualizar el dot activo
    function updateActiveDot() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentDot);
        });
    }
    
    // Función para cambiar al siguiente dot
    function nextDot() {
        currentDot = (currentDot + 1) % totalDots;
        updateActiveDot();
    }
    
    // Auto-cambio de dots cada 5 segundos
    function startDotRotation() {
        dotInterval = setInterval(nextDot, 5000);
    }
    
    // Pausar rotación de dots
    function pauseDotRotation() {
        clearInterval(dotInterval);
    }
    
    // Event listeners para los dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentDot = index;
            updateActiveDot();
            pauseDotRotation();
            setTimeout(startDotRotation, 3000); // Reanudar después de 3 segundos
        });
    });
    
    // Pausar cuando el mouse está sobre el carrusel
    const carousel = document.querySelector('.universities-carousel-clean');
    if (carousel) {
        carousel.addEventListener('mouseenter', pauseDotRotation);
        carousel.addEventListener('mouseleave', startDotRotation);
    }
    
    // Pausar cuando la pestaña no está visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            pauseDotRotation();
        } else {
            startDotRotation();
        }
    });
    
    // Pausar para usuarios que prefieren menos movimiento
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // No iniciar rotación automática
        return;
    }
    
    // Inicializar
    if (carousel && carouselTrack) {
        startDotRotation();
        updateActiveDot();
    }
    
    // ===== ANIMACIÓN DE CONTADORES =====
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalNumber = target.textContent;
                    const isPercentage = finalNumber.includes('%');
                    const isPlusSign = finalNumber.includes('+');
                    const numericValue = parseInt(finalNumber.replace(/[^\d]/g, ''));
                    
                    // Animar el contador
                    let currentValue = 0;
                    const increment = numericValue / 60; // 60 frames para 1 segundo
                    const timer = setInterval(() => {
                        currentValue += increment;
                        if (currentValue >= numericValue) {
                            currentValue = numericValue;
                            clearInterval(timer);
                        }
                        
                        let displayValue = Math.floor(currentValue);
                        if (isPlusSign) displayValue += '+';
                        if (isPercentage) displayValue += '%';
                        
                        target.textContent = displayValue;
                    }, 16); // ~60fps
                    
                    observer.unobserve(target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => observer.observe(counter));
    }
    
    // Inicializar animación de contadores
    animateCounters();
    
    // ===== SOPORTE PARA TECLADO (ACCESIBILIDAD) =====
    document.addEventListener('keydown', (e) => {
        if (e.target.closest('.universities-carousel-clean')) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                currentDot = currentDot === 0 ? totalDots - 1 : currentDot - 1;
                updateActiveDot();
                pauseDotRotation();
                setTimeout(startDotRotation, 3000);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextDot();
                pauseDotRotation();
                setTimeout(startDotRotation, 3000);
            }
        }
    });
    
    // ===== SOPORTE PARA TOUCH (MÓVILES) =====
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    
    if (carousel) {
        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            pauseDotRotation();
        }, { passive: true });
        
        carousel.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            
            // Calcular la diferencia
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Solo procesar si el swipe es más horizontal que vertical
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    // Swipe left - siguiente
                    nextDot();
                } else {
                    // Swipe right - anterior
                    currentDot = currentDot === 0 ? totalDots - 1 : currentDot - 1;
                    updateActiveDot();
                }
                setTimeout(startDotRotation, 3000);
            } else {
                // Si no fue un swipe válido, reanudar inmediatamente
                startDotRotation();
            }
        }, { passive: true });
    }
});


// ===== LOGGING Y DEBUG =====
console.log('%c🚀 FUTRAVIF Website JavaScript loaded successfully!', 'background: #2C72B7; color: white; padding: 8px; border-radius: 4px;');
console.log('%cVersión: 2.0.0 - Optimizado', 'color: #2C72B7; font-weight: bold;');
console.log('%cDesarrollado para: Fundación Transformando Vidas para el Futuro', 'color: #0F2D3F;');
console.log('%c📹 Video player incluido y optimizado', 'color: #28a745;');

// Información de debug en desarrollo
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('%c🔧 MODO DESARROLLO ACTIVO', 'background: #ffc107; color: black; padding: 4px;');
    console.log('Device Info:', getDeviceInfo());
    console.log('Dark mode preferred:', detectDarkMode());
}