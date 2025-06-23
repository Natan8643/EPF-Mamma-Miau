document.addEventListener('DOMContentLoaded', function() {
    var senhaInput = document.getElementById("senha");
    var olhoIcone = document.getElementById("toggleSenha");

    if (olhoIcone && senhaInput) {
        olhoIcone.onclick = function () {
            if (senhaInput.type === "password") {
                senhaInput.type = "text";
                olhoIcone.src = "../static/img/interface/olho-aberto.png";
            }
            else {
                senhaInput.type = "password";
                olhoIcone.src = "../static/img/interface/olho-fechado.png";
            }
        }
    }
});

const telInput = document.querySelector('input[type="tel"]');

// Bloqueia letras enquanto digita
telInput.addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9\-\s]/g, '');
});

// // Validação completa no submit
// document.querySelector('.form-cadastro').addEventListener('submit', function(e) {
//     e.preventDefault();
//     // Validação do telefone
//     if (/[^0-9\-\s]/.test(telInput.value)) {
//         alert('Digite apenas números, traços e espaços no telefone.');
//         telInput.focus();
//         return;
//     }
    
//     // Validação do email
//     const emailInput = document.querySelector('input[type="email"]');
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(emailInput.value)) {
//         alert('Digite um e-mail válido.');
//         emailInput.focus();
//         return;
//     }

//     // Validação HTML5
//     if (this.checkValidity()) {
//         window.location.href = '../views/cadastro-confirm.html';
//     }
// });

document.querySelector('.form-cadastro').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Validação do telefone
    const telInput = this.querySelector('input[type="tel"]');
    if (/[^0-9\-\s]/.test(telInput.value)) {
        alert('Digite apenas números, traços e espaços no telefone.');
        telInput.focus();
        return;
    }

    // Validação do email
    const emailInput = this.querySelector('input[type="email"]');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
        alert('Digite um e-mail válido.');
        emailInput.focus();
        return;
    }

    // Validação HTML5
    if (!this.checkValidity()) {
        alert('Preencha todos os campos corretamente.');
        return;
    }

    // Pegando os valores dos campos
    const name = this.querySelector('input[placeholder="Nome completo"]').value;
    const phone = telInput.value;
    const login = emailInput.value;
    const password = this.querySelector('input[type="password"]').value;

    // Montando o objeto para enviar
    const data = {
        name,
        phone,
        login,
        password
    };

    try {
        const response = await fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            // Cadastro realizado com sucesso
            window.location.href = 'cadastro-confirm.html';
        } else {
            alert(result.error || 'Erro ao cadastrar');
        }
    } catch (err) {
        alert('Erro de conexão com o servidor.');
    }
});