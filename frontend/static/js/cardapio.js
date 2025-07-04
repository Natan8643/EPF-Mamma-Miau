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
let itensPedido = {}; // { product_id: quantidade }

// Armazena os itens do pedido temporariamente
// let itensPedido = [];

// Função para adicionar item ao pedido
// function adicionarAoPedido(productId) {
//   // Verifica se já existe o produto no pedido
//   const existente = itensPedido.find((item) => item.product_id === productId);
//   if (existente) {
//     existente.quantity += 1;
//   } else {
//     itensPedido.push({ product_id: productId, quantity: 1 });
//   }
// }

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
        });
      }
    }
  } catch (e) {
    pedidoAtual = null;
  }
}

async function adicionarAoCarrinho(productId) {
  itensPedido[productId] = (itensPedido[productId] || 0) + 1;

  const token = localStorage.getItem("token");
  if (!pedidoAtual) {
    // Cria novo pedido com esse produto
    const resp = await fetch("http://localhost:5000/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        itens: [{ product_id: productId, quantity: itensPedido[productId] }],
      }),
    });
    if (resp.ok) {
      const data = await resp.json();
      pedidoAtual = data.order_id;
    }
  } else {
    // Adiciona produto ao pedido aberto
    const resp = await fetch(`http://localhost:5000/order/${pedidoAtual}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        product_id: productId,
        quantity: itensPedido[productId],
      }),
    });
    // Não precisa tratar resposta aqui, só incrementa localmente
  }
}

// Adiciona evento aos botões após popular o cardápio
function ativarBotoesAdd() {
  document.querySelectorAll(".item-add").forEach((btn) => {
    btn.addEventListener("click", function () {
      // Pega o id do produto do elemento pai (ajuste conforme seu HTML)
      const card = btn.closest(".cardapio-item");
      const productId = Number(card.dataset.productId); // Defina data-product-id no HTML!
      adicionarAoCarrinho(productId);
      alert("Produto adicionado ao pedido!");
    });
  });
}

// Cria o HTML de um item do cardápio
function criarItemCardapio(item) {
  const card = document.createElement("div");
  card.classList.add("cardapio-item");
  card.dataset.productId = item.id; // <-- Adiciona o id do produto

  card.innerHTML = `
    <img src="${item.img || "../../static/img/interface/pata.png"}" alt="${
    item.nome
  }" class="item-img">
    <div class="item-info">
      <h3>${item.nome}</h3>
      <span>${item.preco}</span>
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

// Exemplo: vincule ao botão "Pedir" do carrinho
document.addEventListener("DOMContentLoaded", () => {
  const botaoPedir = document.querySelector(".botao-pedir");
  if (botaoPedir) {
    botaoPedir.addEventListener("click", pedir);
  }
});
