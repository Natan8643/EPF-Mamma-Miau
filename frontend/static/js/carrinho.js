document.addEventListener("DOMContentLoaded", function () {
    const botaoCarrinho = document.getElementById("botao-carrinho");
    const carrinho = document.querySelector(".carrinho");

    botaoCarrinho.addEventListener("click", function () {
        carrinho.classList.toggle("ativo");
    });
});