let graficoRosca; // variável global para o gráfico

function criarGraficoRosca(data) {
  const ctx = document.getElementById('graficoRosca').getContext('2d');
  if (graficoRosca) {
    graficoRosca.destroy(); // destrói o gráfico anterior se já existir
  }
  graficoRosca = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Sobremesa', 'Entrada', 'Bebidas', 'Prato Principal'],
      datasets: [{
        label: 'Distribuição',
        data: data, // recebe array de porcentagens
        backgroundColor: ['#97BF00', '#92E27A', '#428F60', '#80B155'],
        borderColor: '#ffffff',
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      devicePixelRatio: 2,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed;
              return `${label}: ${value}%`;
            }
          }
        }
      }
    }
  });
}

// Função para buscar os dados do backend e atualizar o gráfico
async function atualizarGraficoRosca() {
  try {
    const resposta = await fetch('http://localhost:5000/profit', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token') // se usar JWT
      }
    });
    const dados = await resposta.json();
    // Ajuste os nomes conforme o retorno do backend
    const porcentagens = [
      dados.profits.dessert_profit,
      dados.profits.starter_dish_profit,
      dados.profits.drinks_profit,
      dados.profits.main_course_profit
    ];
    criarGraficoRosca(porcentagens);
  } catch (err) {
    console.error('Erro ao buscar dados do gráfico:', err);
  }
}

// Chame ao carregar a página
atualizarGraficoRosca();