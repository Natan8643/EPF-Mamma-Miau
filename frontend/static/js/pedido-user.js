async function buscarHistoricoPedidos() {
  try {
    const resposta = await fetch("http://localhost:5000/orders", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    if (!resposta.ok) {
      throw new Error("Erro ao buscar pedidos");
    }
    const dados = await resposta.json();
    const pedidos = dados.orders;

    const historicoConteudo = document.querySelector(".historico-conteudo");
    historicoConteudo.innerHTML = "";

    if (!pedidos || pedidos.length === 0) {
      historicoConteudo.innerHTML = "<p>Nenhum pedido encontrado.</p>";
      return;
    }

    pedidos.forEach((pedido) => {
      const btn = document.createElement("button");
      btn.className = "historico-pedidos";
      btn.innerHTML = `
        <p>Pedido#${pedido.order_id}</p>
        <p>STATUS: ${pedido.status}</p>
        <p>Realizado no dia ${pedido.order_date}</p>
      `;
      btn.addEventListener("click", () => abrirDetalhePedido(pedido.order_id));
      historicoConteudo.appendChild(btn);
    });
  } catch (error) {
    console.error("Erro ao buscar histórico de pedidos:", error);
  }
}

async function abrirDetalhePedido(orderId) {
  try {
    const resposta = await fetch(`http://localhost:5000/order/${orderId}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    if (!resposta.ok) {
      alert("Erro ao buscar detalhes do pedido");
      return;
    }
    const { order } = await resposta.json();

    mostrarSidebarPedido(order);
  } catch (error) {
    alert("Erro ao buscar detalhes do pedido");
  }
}

function mostrarSidebarPedido(order) {
  // Exemplo: usando a div .pedido-atual já existente
  const sidebar = document.querySelector(".pedido-atual");
  sidebar.innerHTML = `
    <h2>Pedido#${order.order_id}</h2>
    <div class="pedido-conteudo">
      ${order.items
        .map(
          (item) => `
        <div class="pedido-itens">
          <img src="${item.img}" alt="">
          <div class="pedido-texto">
            <p>${item.name}</p>
            <p>x${item.quantity}</p>
            <p>R$ ${(item.price * item.quantity).toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}</p>
          </div>
        </div>
      `
        )
        .join("")}
    </div>
    <div class="pedido-rodape">
      <div class="texto-rodape-pedidos">
        <p>total:</p>
        <p>R$ ${order.total_amount.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })}</p>
      </div>
      <button class="botao-pedido botao-fechar-sidebar">Fechar</button>
    </div>
  `;

  sidebar.style.display = "flex";

  // Botão para fechar a sidebar
  sidebar.querySelector(".botao-fechar-sidebar").onclick = () => {
    sidebar.style.display = "none";
  };
}

document.addEventListener("DOMContentLoaded", buscarHistoricoPedidos);
