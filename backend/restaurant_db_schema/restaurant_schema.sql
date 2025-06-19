-- Schema de banco de dados para gerenciamento de restaurante

-- Tabela de usuários
CREATE TABLE [User] (
    UserID INT PRIMARY KEY,
    Name VARCHAR(255),
    Login VARCHAR(100) UNIQUE,
    Password VARCHAR(255), -- Armazena hash da senha
    INDEX idx_name (Name)
);

-- Tabela de status de pedidos
CREATE TABLE OrderStatus (
    OrderStatusID INT PRIMARY KEY,
    Name VARCHAR(100) UNIQUE
);

-- Tabela de pedidos
CREATE TABLE [Order] (
    OrderID INT PRIMARY KEY,
    UserID INT,
    TotalAmount MONEY,
    OrderDate DATETIME,
    OrderStatusID INT,
    FOREIGN KEY (UserID) REFERENCES [User](UserID),
    FOREIGN KEY (OrderStatusID) REFERENCES OrderStatus(OrderStatusID)
);

-- Tabela de produtos
CREATE TABLE Product (
    ProductID INT PRIMARY KEY,
    Name VARCHAR(200) UNIQUE,
    Price MONEY
);

-- Tabela de itens do pedido (OrderLine)
CREATE TABLE OrderLine (
    OrderLineID INT PRIMARY KEY,
    OrderID INT,
    ProductID INT,
    Quantity INT,
    FOREIGN KEY (OrderID) REFERENCES [Order](OrderID),
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID)
);

-- Tabela de pagamentos
CREATE TABLE Payment (
    PaymentID INT PRIMARY KEY,
    OrderID INT,
    PaymentMethod VARCHAR(100),
    Amount MONEY,
    PaidAt DATETIME,
    FOREIGN KEY (OrderID) REFERENCES [Order](OrderID)
);
