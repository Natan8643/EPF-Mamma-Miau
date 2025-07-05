import { API_URL, LocalStorageKeys } from "./const.js";

document.addEventListener("DOMContentLoaded", function () {
  const botaoCarrinho = document.getElementById("botao-carrinho");
  const carrinho = document.querySelector(".carrinho");

  botaoCarrinho.addEventListener("click", function () {
    carrinho.classList.toggle("ativo");
  });
});

async function buscarCarrinho() {
  try {
    const resposta = await fetch("http://localhost:5000/orders/shopping-cart", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    if (!resposta.ok) {
      throw new Error("Erro ao buscar carrinho");
    }
    const cart = await resposta.json();

    if (cart) {
      localStorage.setItem(LocalStorageKeys.ORDER, JSON.stringify(cart.order));
    }

    popularCarrinho(cart.order); // Passe só o objeto order
  } catch (error) {
    console.error("Erro ao buscar carrinho: ", error);
    return [];
  }
}

function criarItemCarrinho(item) {
  const card = document.createElement("div");
  card.classList.add("produto");

  card.innerHTML = `
    <img class="produto-img" src="${item.img}" alt="">
    <p>${item.name}</p>
    <p>x${item.quantity}</p>
    <p>R$ ${item.price.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}</p>
    <button class="lixeira">
        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 32 32">
            <path
                d="M 15 4 C 14.476563 4 13.941406 4.183594 13.5625 4.5625 C 13.183594 4.941406 13 5.476563 13 6 L 13 7 L 7 7 L 7 9 L 8 9 L 8 25 C 8 26.644531 9.355469 28 11 28 L 23 28 C 24.644531 28 26 26.644531 26 25 L 26 9 L 27 9 L 27 7 L 21 7 L 21 6 C 21 5.476563 20.816406 4.941406 20.4375 4.5625 C 20.058594 4.183594 19.523438 4 19 4 Z M 15 6 L 19 6 L 19 7 L 15 7 Z M 10 9 L 24 9 L 24 25 C 24 25.554688 23.554688 26 23 26 L 11 26 C 10.445313 26 10 25.554688 10 25 Z M 12 12 L 12 23 L 14 23 L 14 12 Z M 16 12 L 16 23 L 18 23 L 18 12 Z M 20 12 L 20 23 L 22 23 L 22 12 Z"
                fill="currentColor" />
        </svg>
    </button>
  `;

  return card;
}

function popularCarrinho(order) {
  const container = document.querySelector(".carrinho-itens");
  const botaoCarrinhoImg = document.querySelector("#botao-carrinho img");
  container.innerHTML = ""; // Limpa antes de popular

  if (!order || !order.itens || order.itens.length === 0) {
    container.innerHTML = `<p class="vazio">Carrinho vazio</p>`;
    botaoCarrinhoImg.src = "../../static/img/interface/cloche-padrao.png";
    document.querySelector(".texto-rodape p:last-child").textContent =
      "R$ 0,00";
    return;
  } else {
    botaoCarrinhoImg.src = "../../static/img/interface/cloche-atento.png"; // Troca para cloche cheio
  }

  order.itens.forEach((item) => {
    container.appendChild(criarItemCarrinho(item));
  });

  // Atualiza o total
  document.querySelector(
    ".texto-rodape p:last-child"
  ).textContent = `R$ ${order.total_amount.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function finishedOrder() {
  const btn = document.getElementById("cart-button");

  btn.addEventListener("click", async (event) => {});
}

buscarCarrinho();

const orderBtn = document.getElementById("cart-button");

orderBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  const order = JSON.parse(localStorage.getItem(LocalStorageKeys.ORDER));

  if (!order || !order.itens || order.itens.length === 0) {
    alert("Carrinho vazio");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/pagamento/${order.order_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao finalizar pedido");
    }

    localStorage.removeItem(LocalStorageKeys.ORDER);
    window.location.href = "./cardapio.html";
  } catch (error) {
    console.error("Erro ao finalizar pedido: ", error);
    alert("Erro ao realizar o pedido. Tente novamente.");
  }
});
