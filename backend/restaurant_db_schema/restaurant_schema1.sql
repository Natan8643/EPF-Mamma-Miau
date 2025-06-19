
CREATE TABLE "User" (
    "UserID" int   NOT NULL,
    "Name" string   NOT NULL,
    "Login" varchar(100)   NOT NULL,
    "Password" varchar(255)   NOT NULL,
    CONSTRAINT "pk_User" PRIMARY KEY (
        "UserID"
     ),
    CONSTRAINT "uc_User_Login" UNIQUE (
        "Login"
    )
);

CREATE TABLE "Order" (
    "OrderID" int   NOT NULL,
    "UserID" int   NOT NULL,
    "TotalAmount" money   NOT NULL,
    "OrderDate" datetime   NOT NULL,
    "OrderStatusID" int   NOT NULL,
    CONSTRAINT "pk_Order" PRIMARY KEY (
        "OrderID"
     )
);

CREATE TABLE "OrderLine" (
    "OrderLineID" int   NOT NULL,
    "OrderID" int   NOT NULL,
    "ProductID" int   NOT NULL,
    "Quantity" int   NOT NULL,
    CONSTRAINT "pk_OrderLine" PRIMARY KEY (
        "OrderLineID"
     )
);

CREATE TABLE "Product" (
    "ProductID" int   NOT NULL,
    "Name" varchar(200)   NOT NULL,
    "Price" money   NOT NULL,
    CONSTRAINT "pk_Product" PRIMARY KEY (
        "ProductID"
     ),
    CONSTRAINT "uc_Product_Name" UNIQUE (
        "Name"
    )
);

CREATE TABLE "OrderStatus" (
    "OrderStatusID" int   NOT NULL,
    "Name" string   NOT NULL,
    CONSTRAINT "pk_OrderStatus" PRIMARY KEY (
        "OrderStatusID"
     ),
    CONSTRAINT "uc_OrderStatus_Name" UNIQUE (
        "Name"
    )
);

CREATE TABLE "Payment" (
    "PaymentID" int   NOT NULL,
    "OrderID" int   NOT NULL,
    "PaymentMethod" string   NOT NULL,
    "Amount" money   NOT NULL,
    "PaidAt" datetime   NOT NULL,
    CONSTRAINT "pk_Payment" PRIMARY KEY (
        "PaymentID"
     )
);

ALTER TABLE "Order" ADD CONSTRAINT "fk_Order_UserID" FOREIGN KEY("UserID")
REFERENCES "User" ("UserID");

ALTER TABLE "Order" ADD CONSTRAINT "fk_Order_OrderStatusID" FOREIGN KEY("OrderStatusID")
REFERENCES "OrderStatus" ("OrderStatusID");

ALTER TABLE "OrderLine" ADD CONSTRAINT "fk_OrderLine_OrderID" FOREIGN KEY("OrderID")
REFERENCES "Order" ("OrderID");

ALTER TABLE "OrderLine" ADD CONSTRAINT "fk_OrderLine_ProductID" FOREIGN KEY("ProductID")
REFERENCES "Product" ("ProductID");

ALTER TABLE "Payment" ADD CONSTRAINT "fk_Payment_OrderID" FOREIGN KEY("OrderID")
REFERENCES "Order" ("OrderID");

CREATE INDEX "idx_User_Name"
ON "User" ("Name");

