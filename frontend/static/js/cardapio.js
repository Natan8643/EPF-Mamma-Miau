// Simula uma "requisição" ao backend
async function buscarCardapioDoBackend() {
  try {
    const resposta = await fetch('http://localhost:5000/products');
    if (!resposta.ok) {
      throw new Error('Erro ao buscar produtos');
    }
    const dados = await resposta.json();
    // Supondo que o backend retorna { products: [...] }
    return dados.products;
  } catch (error) {
    console.error('Erro ao buscar cardápio do backend:', error);
    return [];
  }
}

// Cria o HTML de um item do cardápio
function criarItemCardapio(item) {
  const card = document.createElement("div");
  card.classList.add("cardapio-item");

  card.innerHTML = `
    <div class="item-info">
      <h3>${item.nome}</h3>
      <span>${item.preco}</span>
    </div>
    <button class="item-add">+</button>
  `;

  return card;
}

// Popula os itens nas seções do HTML
const categoriaParaId = {
  "Entrada": "entradas",
  "Massa": "massas",
  "Risoto": "risotos",
  "Pizza": "pizzas",
  "Sobremesa": "sobremesas",
  "Bebida": "bebidas"
};

function popularCardapio(cardapio) {
  cardapio.forEach(categoria => {
    const containerId = categoriaParaId[categoria.categoria];
    const container = document.getElementById(containerId);
    if (container) {
      categoria.itens.forEach(item => {
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
  } catch (error) {
    console.error("Erro ao carregar cardápio:", error);
  }
});
