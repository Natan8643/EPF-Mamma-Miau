from sqlalchemy.orm import Session
from models.order import Order

class AdminService:
    def __init__(self, db: Session):
        self.db = db


    def total_balance(self):
        total_amount = 0
        
        orders = self.db.query(Order).filter_by(OrderStatusID=2).all()

        for order in orders:
            total_amount += order.TotalAmount

        return str(total_amount or 0)