from sqlalchemy.orm import Session
from models.order import Order

class AdminService:
    def __init__(self, db: Session):
        self.db = db
        self.total_amount = 0
        self.total_expenses = 0
        self.total_balance = 0
        self.total_profits = 0

    def total_balance(self):

        orders = self.db.query(Order).filter_by(OrderStatusID=2).all()

        for order in orders:
            self.total_amount += order.TotalAmount
            self.total_expenses += (order.TotalAmount * 40)/100 #40% do valor total de cada produto(despesas)
            
        self.total_balances = self.total_expenses + self.total_amount
        return {
            "total_amount": float(self.total_amount),
            "total_expenses": float(self.total_expenses),
            "total_balances": float(self.total_balances)
        }
    
    def total_profits(self):

        orders = self.db.query(Order).filter_by(OrderStatusID=2).all()
        
        #for order in order:


        #self.total_profits = self.total_balance - self.total_expenses

        return float(self.total_expenses or 0)
    
    #lucro = saldo_total - despesas
    #Entrada, Massa, Risoto, Pizza, Sobremesa, Bebida
    #criar essa func ai