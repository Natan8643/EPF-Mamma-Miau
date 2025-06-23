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

document.querySelector('.form-cadastro').addEventListener('submit', function (e) {
    e.preventDefault();
    if (this.checkValidity()) {
        window.location.href = '../views/cadastro-confirm.html';
    }
})