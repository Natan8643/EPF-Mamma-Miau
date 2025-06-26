from sqlalchemy.orm import Session
from models.order import Order

class AdminService:
    def __init__(self, db: Session):
        self.db = db
        self.__total_amount = 0
        self.__total_expenses = 0
        self.__total_profits = 0
        self.__total_balances = 0
        self.__total_starter_dish = 0
        self.__total_main_course = 0
        self.__total_drinks = 0
        self.__total_dessert = 0

    def balance(self):
        orders = self.db.query(Order).filter_by(OrderStatusID=2).all()

        for order in orders:
            self.__total_amount += order.TotalAmount
            self.__total_expenses += (order.TotalAmount * 40) / 100  # 40% despesas
        
        self.__total_balances = self.__total_expenses + self.__total_amount
        self.__total_profits = self.__total_amount - self.__total_expenses

        return {
            "total_amount": float(self.__total_amount),
            "total_expenses": float(self.__total_expenses),
            "total_balances": float(self.__total_balances),
            "total_profit": float(self.__total_profits)
        }

    def profits(self):
        orders = self.db.query(Order).all()

        total_entrada = sum(order.TotalAmount for order in orders if order.categoryID == 1)
        total_massa = sum(order.TotalAmount for order in orders if order.categoryID == 2)
        total_risoto = sum(order.TotalAmount for order in orders if order.categoryID == 3)
        total_pizza = sum(order.TotalAmount for order in orders if order.categoryID == 4)
        total_sobremesa = sum(order.TotalAmount for order in orders if order.categoryID == 5)
        total_bebida = sum(order.TotalAmount for order in orders if order.categoryID == 6)

        total_main_course = total_massa + total_risoto + total_pizza

        # 40% são despesas, 60% é lucro
        self.__total_starter_dish = total_entrada * 0.6
        self.__total_main_course = total_main_course * 0.6
        self.__total_dessert = total_sobremesa * 0.6
        self.__total_drinks = total_bebida * 0.6

        return {
            "starter_dish_profit": float(self.__total_starter_dish),
            "main_course_profit": float(self.__total_main_course),
            "dessert_profit": float(self.__total_dessert),
            "drinks_profit": float(self.__total_drinks)
        }
