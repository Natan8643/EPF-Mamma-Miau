
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


ALTER TABLE "Order" ADD CONSTRAINT "fk_Order_UserID" FOREIGN KEY("UserID")
REFERENCES "User" ("UserID");

ALTER TABLE "Order" ADD CONSTRAINT "fk_Order_OrderStatusID" FOREIGN KEY("OrderStatusID")
REFERENCES "OrderStatus" ("OrderStatusID");

ALTER TABLE "OrderLine" ADD CONSTRAINT "fk_OrderLine_OrderID" FOREIGN KEY("OrderID")
REFERENCES "Order" ("OrderID");

ALTER TABLE "OrderLine" ADD CONSTRAINT "fk_OrderLine_ProductID" FOREIGN KEY("ProductID")
REFERENCES "Product" ("ProductID");

CREATE INDEX "idx_User_Name"
ON "User" ("Name");

