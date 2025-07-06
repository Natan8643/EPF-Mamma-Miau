async function buscarPedidosAbertos() {
  try {
    const resposta = await fetch("http://localhost:5000/admin/opened-orders", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    if (!resposta.ok) {
      throw new Error("Erro ao buscar pedidos em andamento");
    }
    const dados = await resposta.json();

    const container = document.querySelector(".andamento");
    container.innerHTML = `
      <h2>Pedidos em andamento</h2>
      <div id="andamento-list"></div>
    `;
    const lista = container.querySelector("#andamento-list");

    if (dados.opened_orders.length === 0) {
      lista.innerHTML = `<p class= "nenhum-pedido adm">Nenhum pedido foi realizado.</p>`;
      return;
    }

    dados.opened_orders.forEach((pedido) => {
      const div = document.createElement("div");
      div.className = "andamento-itens";
      div.innerHTML = `
        <div class="andamento-texto">
          <p>Pedido #${pedido.order_id}</p>
          <p>Usuário: ${pedido.user}</p>
        </div>
        <button class="andamento-botao" data-order-id="${pedido.order_id}">finalizar pedido</button>
      `;
      lista.appendChild(div);
    });

    // Adiciona evento para finalizar pedido
    document.querySelectorAll(".andamento-botao").forEach((btn) => {
      btn.addEventListener("click", async function () {
        const orderId = this.dataset.orderId;
        await finalizarPedido(orderId);
        buscarPedidosAbertos(); // Atualiza a lista após finalizar
      });
    });
  } catch (error) {
    console.error("Erro ao buscar pedidos em andamento: ", error);
  }
}

async function finalizarPedido(orderId) {
  try {
    const resposta = await fetch(
      `http://localhost:5000/admin/status/${orderId}`,
      {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    if (resposta.ok) {
      console.log("Pedido finalizado!");
    } else {
      console.log("Erro ao finalizar pedido.");
    }
  } catch (error) {
    console.log("Erro ao finalizar pedido.");
  }
}

document.addEventListener("DOMContentLoaded", buscarPedidosAbertos);
