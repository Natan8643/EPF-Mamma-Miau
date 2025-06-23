var senhaInput = document.getElementById("senha");
var olhoIcone = document.getElementById("toggleSenha");

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

const telInput = document.querySelector('input[type="tel"]');

// Bloqueia letras enquanto digita
telInput.addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9\-\s]/g, '');
});

// Validação completa no submit
document.querySelector('.form-cadastro').addEventListener('submit', function(e) {
    e.preventDefault();
    // Validação do telefone
    if (/[^0-9\-\s]/.test(telInput.value)) {
        alert('Digite apenas números, traços e espaços no telefone.');
        telInput.focus();
        return;
    }
    
    // Validação do email
    const emailInput = document.querySelector('input[type="email"]');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
        alert('Digite um e-mail válido.');
        emailInput.focus();
        return;
    }

    // Validação HTML5
    if (this.checkValidity()) {
        window.location.href = '../views/cadastro-confirm.html';
    }
});