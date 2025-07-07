# Mamma Miau - Sistema de Pedidos Online

Este projeto é um sistema web completo para restaurantes, desenvolvido como base didática para ensino de **Programação Orientada a Objetos (POO)** e arquitetura web moderna, utilizando **Python**, **Bottle**, **SQLAlchemy** e **PostgreSQL** no backend, e **HTML/CSS/JS** puro no frontend.

---

## 🗂 Estrutura de Pastas

```bash
EPF-Mamma-Miau/
├── backend/
│   ├── app.py                # Ponto de entrada do backend
│   ├── config.py             # Configurações do projeto
│   ├── main.py               # Inicialização da aplicação
│   ├── requirements.txt      # Dependências do backend
│   ├── controllers/          # Rotas e lógica de controle
│   ├── models/               # Definição das entidades (ORM)
│   ├── services/             # Lógica de negócio e persistência
│   ├── data/                 # Dados locais (opcional)
│   └── .vscode/              # Configurações do VS Code
├── frontend/
│   ├── static/               # CSS, JS e imagens
│   └── views/                # Arquivos HTML
├── docker-compose.yml        # Configuração do banco de dados PostgreSQL
├── README.md                 # Este arquivo
```

---

## 📁 Descrição das Pastas

### `backend/`

- **app.py / main.py**: Inicialização do servidor Bottle.
- **config.py**: Configurações globais do projeto.
- **controllers/**: Rotas da aplicação (ex: `order_controller.py`, `user_controller.py`).
- **models/**: Classes ORM (ex: `User`, `Order`, `Product`).
- **services/**: Lógica de negócio, manipulação de dados e integrações.
- **data/**: Arquivos de dados locais (opcional).

### `frontend/`

- **static/**:
  - `css/`: Estilos (ex: `main.css`, `reset.css`)
  - `js/`: Scripts (ex: `cardapio.js`, `carrinho.js`)
  - `img/`: Imagens do sistema
- **views/**:
  - `menu/`: Páginas HTML do sistema (ex: `cardapio.html`, `pedidos-user.html`)

### `docker-compose.yml`

- Sobe um container PostgreSQL para persistência dos dados.

---

## ▶️ Como Executar

1. **Suba o banco de dados (opcional, se for usar PostgreSQL):**

```bash
docker-compose up -d
```

2. **Crie e ative o ambiente virtual:**

```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

3. **Instale as dependências:**

```bash
pip install -r backend/requirements.txt
```

4. **Rode o backend:**

```bash
cd backend
python main.py
```

5. **Abra o frontend:**

Abra o arquivo HTML em `frontend/views/menu/index.html` no navegador .

---

## 💡 Funcionalidades

- Cadastro e login de usuários
- Visualização de cardápio
- Adição e remoção de itens no carrinho
- Finalização de pedidos
- Histórico de pedidos do usuário
- Painel administrativo para gerenciamento de pedidos e lucros
- Integração com banco de dados PostgreSQL via SQLAlchemy
- Interface responsiva e moderna

---

## ✍️ Personalização

Para adicionar novos modelos ou funcionalidades:

1. Crie a classe no diretório **models/**.
2. Implemente o service correspondente em **services/**.
3. Crie ou edite o controller em **controllers/**.
4. Adicione ou edite as views HTML em **frontend/views/**.
5. Adapte os scripts JS em **frontend/static/js/** conforme necessário.

---

## 🧠 Autor e Licença

Feito por:

[Natan França](https://github.com/Natan8643)

[Kelyton de Lucas](https://github.com/KelytonSantos)

Você pode reutilizar, modificar e compartilhar livremente.
