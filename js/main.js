// Dados dos serviços
const services = [
    {
        icon: 'fas fa-stethoscope',
        title: 'Consulta Veterinária',
        description: 'Atendimento completo com profissionais especializados para diagnóstico e tratamento.',
        price: 'R$ 120,00'
    },
    {
        icon: 'fas fa-syringe',
        title: 'Vacinação',
        description: 'Aplicação de todas as vacinas necessárias para manter seu pet saudável.',
        price: 'R$ 80,00'
    },
    {
        icon: 'fas fa-cut',
        title: 'Banho e Tosa',
        description: 'Serviço completo de higiene e beleza com produtos de qualidade.',
        price: 'R$ 60,00'
    },
    {
        icon: 'fas fa-bone',
        title: 'Cirurgias',
        description: 'Procedimentos cirúrgicos com toda segurança e equipamentos modernos.',
        price: 'A partir de R$ 500,00'
    },
    {
        icon: 'fas fa-teeth',
        title: 'Odontologia',
        description: 'Cuidados com a saúde bucal do seu pet, incluindo limpeza e extrações.',
        price: 'R$ 150,00'
    },
    {
        icon: 'fas fa-heartbeat',
        title: 'Exames Laboratoriais',
        description: 'Análises completas para diagnóstico preciso e acompanhamento.',
        price: 'A partir de R$ 90,00'
    }
];

// Gerar serviços dinamicamente
function renderServices() {
    const servicesGrid = document.querySelector('.services-grid');
    
    if (!servicesGrid) return;
    
    services.forEach(service => {
        const serviceCard = document.createElement('div');
        serviceCard.className = 'service-card';
        serviceCard.innerHTML = `
            <div class="service-icon">
                <i class="${service.icon}"></i>
            </div>
            <div class="service-content">
                <h3>${service.title}</h3>
                <p>${service.description}</p>
                <div class="price">${service.price}</div>
                <a href="#agendamento" class="btn">Agendar</a>
            </div>
        `;
        servicesGrid.appendChild(serviceCard);
    });
}

// Preencher select de serviços no formulário
function populateServiceSelect() {
    const serviceSelect = document.getElementById('servico');
    
    if (!serviceSelect) return;
    
    services.forEach(service => {
        const option = document.createElement('option');
        option.value = service.title.toLowerCase().replace(/\s+/g, '-');
        option.textContent = service.title;
        serviceSelect.appendChild(option);
    });
}

// Menu mobile
function initMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!mobileMenu || !navMenu) return;
    
    mobileMenu.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        const icon = mobileMenu.querySelector('i');
        if (icon) {
            icon.className = navMenu.classList.contains('active') 
                ? 'fas fa-times' 
                : 'fas fa-bars';
        }
    });
    
    // Fechar menu ao clicar em um link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const icon = mobileMenu.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-bars';
            }
        });
    });
}

// Smooth scroll para links internos
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Animação de revelação ao scroll
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar elementos para animação
    const elementsToAnimate = document.querySelectorAll('.service-card, .about-content, .appointment-form, .contact-container');
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Validação básica de formulário de contato
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validação simples
            const inputs = this.querySelectorAll('input[required], textarea[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    input.classList.add('error');
                    isValid = false;
                } else {
                    input.classList.remove('error');
                    input.classList.add('success');
                }
            });
            
            if (isValid) {
                // Simular envio
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                
                submitBtn.textContent = 'Enviando...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    // Criar mensagem de sucesso
                    const successMessage = document.createElement('div');
                    successMessage.className = 'form-message success';
                    successMessage.textContent = 'Mensagem enviada com sucesso! Entraremos em contato em breve.';
                    
                    this.parentNode.insertBefore(successMessage, this);
                    this.reset();
                    
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    
                    // Remover mensagem após 5 segundos
                    setTimeout(() => {
                        successMessage.remove();
                    }, 5000);
                    
                    // Remover classes de sucesso dos inputs
                    inputs.forEach(input => input.classList.remove('success'));
                }, 2000);
            }
        });
    }
}

// Carrossel automático
function initCarousel() {
    const carousel = document.querySelector('.clinic-carousel');
    if (!carousel) return;

    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots = carousel.querySelectorAll('.dot');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    
    let currentSlide = 0;
    let slideInterval;

    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentSlide = (n + slides.length) % slides.length;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, 3000); // 3 SEGUNDOS
    }

    function stopAutoSlide() {
        clearInterval(slideInterval);
    }

    // Event listeners
    nextBtn.addEventListener('click', () => {
        stopAutoSlide();
        nextSlide();
        startAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
        stopAutoSlide();
        prevSlide();
        startAutoSlide();
    });

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            stopAutoSlide();
            showSlide(parseInt(dot.getAttribute('data-slide')));
            startAutoSlide();
        });
    });

    // Pausa o carrossel quando o mouse está em cima
    carousel.addEventListener('mouseenter', stopAutoSlide);
    carousel.addEventListener('mouseleave', startAutoSlide);

    // Inicia o carrossel
    startAutoSlide();
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    renderServices();
    populateServiceSelect();
    initMobileMenu();
    initSmoothScroll();
    initScrollReveal();
    initContactForm();
    initCarousel();
    
    // Configurar data mínima no formulário (hoje)
    const dateInput = document.getElementById('data');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
    
    // Adicionar classe active no menu baseado na scroll position
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-menu a');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
});