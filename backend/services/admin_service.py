from sqlalchemy.orm import Session
from models.order import Order
from models.order_line import OrderLine
from models.product import Product
class AdminService:
    def __init__(self, db: Session):
        self.db = db
        self.__total_amount = 0
        self.__total_expenses = 0
        self.__total_profits = 0
        self.__total_starter_dish = 0
        self.__total_main_course = 0
        self.__total_drinks = 0
        self.__total_dessert = 0

    def balance(self):
        orders = self.db.query(Order).filter_by(OrderStatusID=2).all()

        for order in orders:
            self.__total_amount += order.TotalAmount
            self.__total_expenses += (order.TotalAmount * 40) / 100  # 40% despesas
        
        self.__total_profits = self.__total_amount - self.__total_expenses

        return {
            "total_amount": float(self.__total_amount),
            "total_expenses": float(self.__total_expenses),
            "total_profit": float(self.__total_profits)
        }

    def profits(self):
        self.balance()
        order_lines = (
            self.db.query(OrderLine)
            .join(Order, Order.OrderID == OrderLine.OrderID)
            .join(Product, Product.ProductID == OrderLine.ProductID)
            .filter(Order.OrderStatusID == 2)
            .all()
        )

        categoria_totais = {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
        }

        for line in order_lines:
            categoria = line.product.Category #acessa categoria pelo pipeline do produto em orderLine
            valor_total = float(line.Quantity) * float(line.product.Price)
            categoria_totais[categoria] += valor_total #soma de acordo com a cat(como ta dentro do for entao ele ja vai direto na ordem definida)

        total_main_course = (
            categoria_totais[2] + categoria_totais[3] + categoria_totais[4]
        )

        self.__total_starter_dish = categoria_totais[1] * 0.6
        self.__total_main_course = total_main_course * 0.6
        self.__total_dessert = categoria_totais[5] * 0.6
        self.__total_drinks = categoria_totais[6] * 0.6

        if self.__total_profits == 0:
            porcent_starter_dish = 0
            porcent_main_course = 0
            porcent_dessert = 0
            porcent_drinks = 0
        else:
            porcent_starter_dish = self.__total_starter_dish * 100 / float(self.__total_profits)
            porcent_main_course = self.__total_main_course * 100 / float(self.__total_profits)
            porcent_dessert = self.__total_dessert * 100 / float(self.__total_profits)
            porcent_drinks = self.__total_drinks * 100 / float(self.__total_profits)
        

        return {
            "starter_dish_profit": porcent_starter_dish,
            "main_course_profit": porcent_main_course,
            "dessert_profit": porcent_dessert,
            "drinks_profit": porcent_drinks
        }

    def update_order_status(self, order_id: int, new_status_id: int):
        order = self.db.query(Order).filter(Order.OrderID == order_id).first()
        if not order:
            raise ValueError("Pedido não encontrado")
        
        order.OrderStatusID = new_status_id
        self.db.commit()
        self.db.refresh(order)
        return order
    
    def opened_orders(self):
        orders = self.db.query(Order).filter_by(OrderStatusID = 1).all()
        
        return [
        {
            "order_id": order.OrderID,
            "user": order.user.Name
        }
        for order in orders
    ]
