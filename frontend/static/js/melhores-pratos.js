async function buscarMelhoresPratos() {
  try {
    const resposta = await fetch("http://localhost:5000/best-dishes", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    if (!resposta.ok) {
      throw new Error("Erro ao buscar melhores pratos");
    }
    const dados = await resposta.json();

    dados.best_dishes.forEach((dish) => {
      const pratoDiv = document.getElementById(`prato#${dish.posicao}`);
      if (pratoDiv) {
        const img = pratoDiv.querySelector(".img-melhores");
        if (img) {
          img.src = dish.img;
        }
        const nome = pratoDiv.querySelector(".texto-prato h4");
        if (nome) nome.textContent = dish.nome;
        const valor = pratoDiv.querySelector(".texto-prato p");
        if (valor)
          valor.textContent = `R$ ${dish.total_vendido.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`;
        const contador = pratoDiv.querySelector(".contador");
        if (contador) contador.textContent = dish.quantidade_vendida;
      }
    });
  } catch (error) {
    console.error("Erro ao buscar melhores pratos do backend: ", error);
    return [];
  }
}

buscarMelhoresPratos();
