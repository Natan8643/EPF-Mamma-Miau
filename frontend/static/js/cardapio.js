import { LocalStorageKeys } from "./const.js";
import { buscarCarrinho } from "./carrinho.js";
// Simula uma "requisição" ao backend
async function buscarCardapioDoBackend() {
  try {
    const resposta = await fetch("http://localhost:5000/products");
    if (!resposta.ok) {
      throw new Error("Erro ao buscar produtos");
    }
    const dados = await resposta.json();
    // Supondo que o backend retorna { products: [...] }
    return dados.products;
  } catch (error) {
    console.error("Erro ao buscar cardápio do backend:", error);
    return [];
  }
}

let pedidoAtual = null; // Armazena o pedido aberto (order_id)
export let itensPedido = {}; // { product_id: quantidade }

export function setItensPedido(obj) {
  itensPedido = obj;
}

async function buscarPedidoAberto() {
  const token = localStorage.getItem("token");
  try {
    const resp = await fetch("http://localhost:5000/orders/shopping-cart", {
      headers: { Authorization: "Bearer " + token },
    });
    if (resp.ok) {
      const data = await resp.json();
      pedidoAtual = data.order ? data.order.order_id : null;
      if (data.order && data.order.itens) {
        data.order.itens.forEach((item) => {
          itensPedido[item.product_id] = item.quantity;
          console.log(itensPedido);
        });
      }
    }
    console.log("depois" + itensPedido);
  } catch (e) {
    pedidoAtual = null;
  }
}

async function adicionarAoCarrinho(productId) {
  // Sempre começa com 1 quando for adição nova
  const novaQuantidade = (itensPedido[productId] || 0) + 1;

  try {
    const token = localStorage.getItem(LocalStorageKeys.TOKEN);
    const order = JSON.parse(localStorage.getItem(LocalStorageKeys.ORDER));

    if (!order) {
      const resp = await fetch("http://localhost:5000/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          itens: [{ product_id: productId, quantity: 1 }], // Sempre 1 para novo
        }),
      });

      if (resp.ok) {
        const data = await resp.json();
        pedidoAtual = data.order_id;
        itensPedido[productId] = 1; // Reseta para 1
      }
    } else {
      const resp = await fetch(
        `http://localhost:5000/order/${order.order_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            product_id: productId,
            quantity: novaQuantidade,
          }),
        }
      );

      if (resp.ok) {
        itensPedido[productId] = novaQuantidade;
      }
    }
    await buscarCarrinho();
  } catch (error) {
    console.log(error);
  }
}

// Adiciona evento aos botões após popular o cardápio
function ativarBotoesAdd() {
  const userRole = localStorage.getItem("userRole");

  // Verifica se não está logado ou é admin
  if (!userRole || userRole !== "user") {
    document.querySelectorAll(".item-add").forEach((btn) => {
      btn.disabled = true;
      btn.title = "Apenas usuários podem fazer pedidos";
      btn.style.opacity = "0.5";
      btn.style.cursor = "not-allowed";
    });
    return;
  }

  // Se for user, ativa os botões normalmente
  document.querySelectorAll(".item-add").forEach((btn) => {
    btn.disabled = false;
    btn.addEventListener("click", function () {
      const card = btn.closest(".cardapio-item");
      const productId = Number(card.dataset.productId);
      adicionarAoCarrinho(productId);
      console.log("Produto adicionado ao pedido!");
    });
  });
}

// Cria o HTML de um item do cardápio
function criarItemCardapio(item) {
  const card = document.createElement("div");
  card.classList.add("cardapio-item");
  card.dataset.productId = item.id; // <-- Adiciona o id do produto

  const precoFormatado = Number(item.preco).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  card.innerHTML = `
    <img src="${item.img || "../../static/img/interface/pata.png"}" alt="${
    item.nome
  }" class="item-img">
    <div class="item-info">
      <h3>${item.nome}</h3>
      <span>R$ ${precoFormatado}</span>
    </div>
    <button class="item-add">+</button>
  `;

  return card;
}

function popularCardapio(cardapio) {
  cardapio.forEach((categoria) => {
    //const containerId = categoriaParaId[categoria.categoria];
    const container = document.getElementById(`${categoria.categoria}`);
    if (container) {
      categoria.itens.forEach((item) => {
        container.appendChild(criarItemCardapio(item));
      });
    } else {
      console.warn(`Categoria não encontrada: ${categoria.categoria}`);
    }
  });
}

// Quando a página carregar
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const dados = await buscarCardapioDoBackend();

    popularCardapio(dados);
    ativarBotoesAdd();
  } catch (error) {
    console.error("Erro ao carregar cardápio:", error);
  }
});

// Ao clicar em "Pedir"
async function pedir() {
  if (!pedidoAtual) return alert("Nenhum pedido aberto!");
  const token = localStorage.getItem("token");
  const resp = await fetch(`http://localhost:5000/pagamento/${pedidoAtual}`, {
    method: "PUT",
    headers: { Authorization: "Bearer " + token },
  });
  if (resp.ok) {
    alert("Pedido finalizado!");
    pedidoAtual = null;
    itensPedido = {};
  } else {
    alert("Erro ao finalizar pedido");
  }
}
