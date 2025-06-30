// Simula uma "requisição" ao backend
function buscarCardapioDoBackend() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const dados = [
        // Entradas
        { nome: "Bruschetta", preco: "R$ 18,00", imagem: "https://picsum.photos/200/150?random=1", categoria: "entrada" },
        { nome: "Caprese", preco: "R$ 22,00", imagem: "https://picsum.photos/200/150?random=2", categoria: "entrada" },
        { nome: "Anéis de Cebola", preco: "R$ 16,00", imagem: "https://picsum.photos/200/150?random=3", categoria: "entrada" },
        { nome: "Mini Croquete", preco: "R$ 20,00", imagem: "https://picsum.photos/200/150?random=19", categoria: "entrada" },
        { nome: "Pão de Alho", preco: "R$ 14,00", imagem: "https://picsum.photos/200/150?random=20", categoria: "entrada" },

        // Massas
        { nome: "Fettuccine Alfredo", preco: "R$ 38,00", imagem: "https://picsum.photos/200/150?random=4", categoria: "massa" },
        { nome: "Spaghetti à Bolonhesa", preco: "R$ 36,00", imagem: "https://picsum.photos/200/150?random=5", categoria: "massa" },
        { nome: "Penne ao Pesto", preco: "R$ 34,00", imagem: "https://picsum.photos/200/150?random=6", categoria: "massa" },

        // Risotos
        { nome: "Risoto de Cogumelos", preco: "R$ 42,00", imagem: "https://picsum.photos/200/150?random=7", categoria: "risoto" },
        { nome: "Risoto de Camarão", preco: "R$ 48,00", imagem: "https://picsum.photos/200/150?random=8", categoria: "risoto" },
        { nome: "Risoto de Limão Siciliano", preco: "R$ 40,00", imagem: "https://picsum.photos/200/150?random=9", categoria: "risoto" },

        // Pizzas
        { nome: "Margherita", preco: "R$ 45,00", imagem: "https://picsum.photos/200/150?random=10", categoria: "pizza" },
        { nome: "Pepperoni", preco: "R$ 48,00", imagem: "https://picsum.photos/200/150?random=11", categoria: "pizza" },
        { nome: "Quatro Queijos", preco: "R$ 47,00", imagem: "https://picsum.photos/200/150?random=12", categoria: "pizza" },

        // Sobremesas
        { nome: "Tiramisu", preco: "R$ 22,00", imagem: "https://picsum.photos/200/150?random=13", categoria: "sobremesa" },
        { nome: "Pudim", preco: "R$ 18,00", imagem: "https://picsum.photos/200/150?random=14", categoria: "sobremesa" },
        { nome: "Mousse de Chocolate", preco: "R$ 20,00", imagem: "https://picsum.photos/200/150?random=15", categoria: "sobremesa" },

        // Bebidas
        { nome: "Suco Natural", preco: "R$ 10,00", imagem: "https://picsum.photos/200/150?random=16", categoria: "bebida" },
        { nome: "Refrigerante", preco: "R$ 8,00", imagem: "https://picsum.photos/200/150?random=17", categoria: "bebida" },
        { nome: "Água com Gás", preco: "R$ 6,00", imagem: "https://picsum.photos/200/150?random=18", categoria: "bebida" }
      ];
      resolve(dados);
    }, 800); // simula 800ms de atraso
  });
}

// Cria o HTML de um item do cardápio
function criarItemCardapio(item) {
  const card = document.createElement("div");
  card.classList.add("cardapio-item");

  card.innerHTML = `
    <img src="${item.imagem}" alt="${item.nome}" class="item-img">
    <div class="item-info">
      <h3>${item.nome}</h3>
      <span>${item.preco}</span>
    </div>
    <button class="item-add">+</button>
  `;

  return card;
}

// Popula os itens nas seções do HTML
function popularCardapio(cardapio) {
  cardapio.forEach(item => {
    const container = document.getElementById(`${item.categoria}s`); // ex: entradas, massas...
    if (container) {
      container.appendChild(criarItemCardapio(item));
    } else {
      console.warn(`Categoria não encontrada: ${item.categoria}`);
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
