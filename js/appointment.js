// Dados e funções específicas para agendamento

// Formatadores de input
function initInputMasks() {
    // Máscara para telefone
    const phoneInput = document.getElementById('telefone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length <= 11) {
                if (value.length <= 2) {
                    value = value.replace(/^(\d{0,2})/, '($1');
                } else if (value.length <= 6) {
                    value = value.replace(/^(\d{2})(\d{0,4})/, '($1) $2');
                } else if (value.length <= 10) {
                    value = value.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
                } else {
                    value = value.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
                }
                
                e.target.value = value;
            }
        });
    }
}

// Validação do formulário de agendamento
function initAppointmentForm() {
    const appointmentForm = document.getElementById('appointmentForm');
    
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateAppointmentForm()) {
                submitAppointmentForm();
            }
        });
        
        // Validação em tempo real
        const requiredInputs = this.querySelectorAll('input[required], select[required]');
        requiredInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
    }
}

// Validar campo individual
function validateField(field) {
    const value = field.value.trim();
    
    if (!value) {
        field.classList.add('error');
        field.classList.remove('success');
        return false;
    }
    
    // Validações específicas por tipo de campo
    switch(field.type) {
        case 'email':
            if (!isValidEmail(value)) {
                field.classList.add('error');
                field.classList.remove('success');
                return false;
            }
            break;
        case 'tel':
            if (!isValidPhone(value)) {
                field.classList.add('error');
                field.classList.remove('success');
                return false;
            }
            break;
    }
    
    field.classList.remove('error');
    field.classList.add('success');
    return true;
}

// Validar formulário completo
function validateAppointmentForm() {
    const form = document.getElementById('appointmentForm');
    const requiredFields = form.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    // Remover mensagens anteriores
    const existingMessages = form.querySelectorAll('.form-message');
    existingMessages.forEach(msg => msg.remove());
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Validar email se preenchido
    const emailField = document.getElementById('email');
    if (emailField.value.trim() && !isValidEmail(emailField.value)) {
        emailField.classList.add('error');
        isValid = false;
    }
    
    return isValid;
}

// Validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validar telefone
function isValidPhone(phone) {
    const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
    return phoneRegex.test(phone);
}

// Enviar formulário de agendamento
function submitAppointmentForm() {
    const form = document.getElementById('appointmentForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Coletar dados do formulário
    const formData = {
        nome: document.getElementById('nome').value,
        telefone: document.getElementById('telefone').value,
        email: document.getElementById('email').value,
        pet: document.getElementById('pet').value,
        especie: document.getElementById('especie').value,
        raca: document.getElementById('raca').value,
        servico: document.getElementById('servico').value,
        data: document.getElementById('data').value,
        observacoes: document.getElementById('observacoes').value,
        dataEnvio: new Date().toLocaleString('pt-BR')
    };
    
    // Simular envio
    submitBtn.textContent = 'Agendando...';
    submitBtn.disabled = true;
    
    // Simular delay de rede
    setTimeout(() => {
        // Salvar no localStorage (simulando banco de dados)
        saveAppointment(formData);
        
        // Mostrar mensagem de sucesso
        showAppointmentSuccess(formData);
        
        // Resetar formulário
        form.reset();
        
        // Restaurar botão
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Limpar classes de validação
        const validatedFields = form.querySelectorAll('.success, .error');
        validatedFields.forEach(field => {
            field.classList.remove('success', 'error');
        });
        
    }, 2000);
}

// Salvar agendamento no localStorage
function saveAppointment(appointmentData) {
    let appointments = JSON.parse(localStorage.getItem('zoomzoom_appointments')) || [];
    appointments.push({
        ...appointmentData,
        id: Date.now(),
        status: 'pendente'
    });
    localStorage.setItem('zoomzoom_appointments', JSON.stringify(appointments));
}

// Mostrar mensagem de sucesso
function showAppointmentSuccess(data) {
    const form = document.getElementById('appointmentForm');
    
    // Criar mensagem de sucesso
    const successMessage = document.createElement('div');
    successMessage.className = 'form-message success';
    successMessage.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <div style="font-size: 3rem; color: var(--success); margin-bottom: 15px;">✅</div>
            <h3 style="color: var(--success); margin-bottom: 15px; font-size: 1.5rem;">Agendamento concluído com sucesso!</h3>
            <p style="margin-bottom: 20px; color: var(--dark);">Seu agendamento foi registrado e entraremos em contato em breve para confirmação.</p>
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: left;">
                <h4 style="color: var(--secondary); margin-bottom: 10px;">Resumo do Agendamento:</h4>
                <p><strong>Pet:</strong> ${data.pet} (${data.especie})</p>
                <p><strong>Serviço:</strong> ${data.servico}</p>
                <p><strong>Data preferencial:</strong> ${formatDate(data.data)}</p>
                ${data.observacoes ? `<p><strong>Observações:</strong> ${data.observacoes}</p>` : ''}
            </div>
            
            <p style="font-size: 0.9rem; color: #666;">
                <strong>Próximo passo:</strong> Nossa equipe entrará em contato em até 2 horas úteis para confirmar o horário.
            </p>
            
            <div style="margin-top: 20px; padding: 10px; background: #e9f7ef; border-radius: 5px;">
                <p style="font-size: 0.8rem; color: #666; margin: 0;">
                    ⏰ Esta mensagem desaparecerá automaticamente em <span id="countdown">7</span> segundos
                </p>
            </div>
        </div>
    `;
    
    form.parentNode.insertBefore(successMessage, form);
    
    // Ocultar o formulário
    form.style.display = 'none';
    
    // Rolagem suave para a mensagem
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Adicionar botão para novo agendamento
    const newAppointmentBtn = document.createElement('button');
    newAppointmentBtn.textContent = 'Fazer Novo Agendamento';
    newAppointmentBtn.className = 'btn';
    newAppointmentBtn.style.marginTop = '20px';
    newAppointmentBtn.onclick = function() {
        clearTimeout(countdownTimer);
        successMessage.remove();
        form.style.display = 'block';
        form.scrollIntoView({ behavior: 'smooth' });
    };
    
    successMessage.querySelector('div').appendChild(newAppointmentBtn);
    
    // Contador regressivo
    let secondsLeft = 7;
    const countdownElement = successMessage.querySelector('#countdown');
    
    const countdownTimer = setInterval(() => {
        secondsLeft--;
        countdownElement.textContent = secondsLeft;
        
        if (secondsLeft <= 0) {
            clearInterval(countdownTimer);
            successMessage.remove();
            form.style.display = 'block';
        }
    }, 1000);
}

// Formatar data para exibição
function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    initInputMasks();
    initAppointmentForm();
    
    // Prevenir datas passadas
    const dateInput = document.getElementById('data');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        
        // Sugerir data (próximo dia útil)
        const nextBusinessDay = getNextBusinessDay();
        dateInput.value = nextBusinessDay;
    }
});

// Calcular próximo dia útil
function getNextBusinessDay() {
    const today = new Date();
    let nextDay = new Date(today);
    
    // Pular fins de semana
    do {
        nextDay.setDate(nextDay.getDate() + 1);
    } while (nextDay.getDay() === 0 || nextDay.getDay() === 6);
    
    return nextDay.toISOString().split('T')[0];
}

// Função para administrador visualizar agendamentos (para desenvolvimento)
function viewAppointments() {
    const appointments = JSON.parse(localStorage.getItem('zoomzoom_appointments')) || [];
    console.log('Agendamentos salvos:', appointments);
    return appointments;
}