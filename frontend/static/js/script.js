function isTokenExpired(token) {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return Date.now() >= payload.exp * 1000;
  } catch (e) {
    return true;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");
  const linkGerenciamento = document.querySelector('a[href*="gerenciamento"]');

  // Verifica se o token está expirado
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    if (linkGerenciamento) linkGerenciamento.style.display = "none";
  } else {
    if (linkGerenciamento) {
      if (userRole !== "admin") {
        linkGerenciamento.style.display = "none";
      }
    }
  }

  // Toggle de visibilidade da senha
  var senhaInput = document.getElementById("senha");
  var olhoIcone = document.getElementById("toggleSenha");

  if (olhoIcone && senhaInput) {
    olhoIcone.onclick = function () {
      if (senhaInput.type === "password") {
        senhaInput.type = "text";
        olhoIcone.src = "../../static/img/interface/olho-aberto.png";
      } else {
        senhaInput.type = "password";
        olhoIcone.src = "../../static/img/interface/olho-fechado.png";
      }
    };
  }

  // Validação de telefone (para o cadastro)
  const telInput = document.querySelector('input[type="tel"]');
  if (telInput) {
    telInput.addEventListener("input", function () {
      this.value = this.value.replace(/[^0-9\-\s]/g, "");
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
        localStorage.setItem("token", result.token);
        localStorage.setItem("userRole", result.user.role); // Salva a role do usuário
        localStorage.setItem("userName", result.user.name);
        window.location.href = "../menu/index.html";
      } catch (error) {
        alert("Erro: " + error.message);
      }
    });
  }

  const loginMenuBtn = document.querySelector(".login-menu")
  const userName = localStorage.getItem("userName");

  if (loginMenuBtn) {
    const token = localStorage.getItem("token");
    const isLogged = token && !isTokenExpired(token);

    if (userName && isLogged) {
      loginMenuBtn.textContent = `Olá, ${userName.split(" ")[0]}!`;
      loginMenuBtn.classList.add("logado");

      loginMenuBtn.addEventListener("click", () => {
        const logoutBtn = document.querySelector(".logout");
        if (logoutBtn.style.display === "flex") {
          logoutBtn.style.animation = "slideOutLogout 0.3s forwards";
          setTimeout(() => {
            logoutBtn.style.display = "none";
          }, 300);
        } else {
          logoutBtn.style.display = "flex";
          logoutBtn.style.animation = "slideInLogout 0.3s forwards";
        }
      });
    } else {
      // Se não estiver logado, redireciona ao clicar
      loginMenuBtn.addEventListener("click", () => {
        window.location.href = "../login/login.html";
      });
    }
  }

  // Evento de cadastro
  const formCadastro = document.querySelector(".form-cadastro");
  if (formCadastro) {
    formCadastro.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Validação do telefone
      const telInput = this.querySelector('input[type="tel"]');
      if (telInput && /[^0-9\-\s]/.test(telInput.value)) {
        alert("Digite apenas números, traços e espaços no telefone.");
        telInput.focus();
        return;
      }

      // Validação do email
      const emailInput = this.querySelector('input[type="email"]');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailInput && !emailRegex.test(emailInput.value)) {
        alert("Digite um e-mail válido.");
        emailInput.focus();
        return;
      }

      // Validação HTML5
      if (!this.checkValidity()) {
        alert("Preencha todos os campos corretamente.");
        return;
      }

      // Pegando os valores dos campos
      const name = this.querySelector(
        'input[placeholder="Nome completo"]'
      )?.value;
      const phone = telInput?.value;
      const login = emailInput?.value;
      const password = this.querySelector('input[type="password"]')?.value;

      // Montando o objeto para enviar
      const data = {
        name,
        phone,
        login,
        password,
      };

      try {
        const response = await fetch("http://localhost:5000/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
          // Cadastro realizado com sucesso
          window.location.href = "cadastro-confirm.html";
        } else {
          alert(result.error || "Erro ao cadastrar");
        }
      } catch (err) {
        alert("Erro de conexão com o servidor.");
      }
    });
  }

  const pedidosMenu = document.getElementById("pedidos-menu");
  if (pedidosMenu) {
    pedidosMenu.addEventListener("click", function (e) {
      e.preventDefault();
      const userRole = localStorage.getItem("userRole");
      if (userRole === "admin") {
        window.location.href = "../menu/pedidos-adm.html";
      } else if (userRole === "user") {
        window.location.href = "../menu/pedidos-user.html";
      } else {
        window.location.href = "../login/login.html";
      }
    });
  }



  const logoutBtn = document.querySelector(".logout button");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userName");
      window.location.href = "../login/login.html";
    });
  }


});
