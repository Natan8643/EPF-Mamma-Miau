from sqlalchemy.orm import Session
from models.order import Order
from models.product import Product
from models.order_line import OrderLine
from datetime import datetime

class OrderService:
    def __init__(self, db: Session):
        self.db = db

    def get_all_orders(self, user_id):
        orders = self.db.query(Order).filter_by(UserID=user_id).all()

        return [self.serialize_product(order) for order in orders]

    def serialize_product(self, order):
        return {
            "order_id": order.OrderID,
            "total_amount": float(order.TotalAmount),
            "order_date": order.OrderDate.strftime('%d/%m/%Y %H:%M'),
            "status": order.OrderStatusID,
        }

    def create_order(self, user_id, items: list):

        """
        items = [
            {"product_id": 1, "quantity": 2},
            {"product_id": 5, "quantity": 1},
        ]
        """

        if not items:
            raise ValueError("O pedido precisa de pelo menos um item")
        
        product_ids =[item['product_id'] for item in items]
        products = self.db.query(Product).filter(Product.ProductID.in_(product_ids)).all() #filtro dos ids de produtos

        if len(products) != len(product_ids): 
            raise ValueError("Um ou mais produtos invalidos") 

        total_amount = 0
        product_to_map = {p.ProductID: p for p in products}
        
        """
            {
                1: <Product ProductID=1, Name="Pizza", Price=30>,
                5: <Product ProductID=5, Name="Refrigerante", Price=5>
            }
        """
        for item in items:
            product = product_to_map[item['product_id']] #product_to_map[1] = {1: <Product ProductID=1, Name="Pizza", Price=30>} 
            total_amount += product.Price * item['quantity']

        order = Order(UserID=user_id, TotalAmount=total_amount, OrderDate=datetime.utcnow(), OrderStatusID=1)

        for item in items:
            line = OrderLine(
                ProductID=item['product_id'],
                Quantity=item['quantity']
            )
            order.lines.append(line)
        
        self.db.add(order)
        self.db.commit()
        self.db.refresh(order)

        return order