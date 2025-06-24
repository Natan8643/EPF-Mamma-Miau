document.addEventListener('DOMContentLoaded', function() {
    // Toggle de visibilidade da senha
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

    // Validação de telefone (para o cadastro)
    const telInput = document.querySelector('input[type="tel"]');
    if (telInput) {
        telInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9\-\s]/g, '');
        });
    }

    // Função de login
    async function log(login, password) {
        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ login, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Erro ao conectar com o servidor");
        }

        return await response.json();
    }

    // Evento de login
    const btnLogin = document.querySelector("#btnLogin");
    if (btnLogin) {
        btnLogin.addEventListener("click", async (e) => {
            e.preventDefault();

            const login = document.querySelector("#login-input").value;
            const password = document.querySelector("#senha").value;

            try {
                const result = await log(login, password);
                console.log(result);
                localStorage.setItem('token', result.token);
                
                window.location.href = './index.html';
            } catch (error) {
                alert("Erro: " + error.message);
            }
        });
    }

    // Evento de cadastro
    const formCadastro = document.querySelector('.form-cadastro');
    if (formCadastro) {
        formCadastro.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Validação do telefone
            const telInput = this.querySelector('input[type="tel"]');
            if (telInput && /[^0-9\-\s]/.test(telInput.value)) {
                alert('Digite apenas números, traços e espaços no telefone.');
                telInput.focus();
                return;
            }

            // Validação do email
            const emailInput = this.querySelector('input[type="email"]');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailInput && !emailRegex.test(emailInput.value)) {
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
            const name = this.querySelector('input[placeholder="Nome completo"]')?.value;
            const phone = telInput?.value;
            const login = emailInput?.value;
            const password = this.querySelector('input[type="password"]')?.value;

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
    }
});