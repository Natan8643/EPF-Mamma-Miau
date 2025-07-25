from sqlalchemy.orm import Session
from models.order import Order
from models.product import Product
from models.order_line import OrderLine
from datetime import datetime
import pytz
from models.user import User
from services.user_notification_service import UserNotificationService
from sqlalchemy import or_

class OrderService:
    def __init__(self, db: Session):
        self.db = db

    def get_all_orders(self, user_id):
        orders = self.db.query(Order).filter(
        Order.UserID == user_id,
        or_(Order.OrderStatusID == 2, Order.OrderStatusID == 3)
        ).all()
        
        return [self.serialize_orders(order) for order in orders]

    def serialize_orders(self, order):
        return {
            "order_id": order.OrderID,
            "total_amount": float(order.TotalAmount),
            "order_date": order.OrderDate.astimezone(pytz.timezone("America/Sao_Paulo")).strftime('%d/%m/%Y %H:%M'),
            "status": order.order_status.name,
        }

    def get_order_by_id(self, order_id, user_id):
        order = self.db.query(Order).filter_by(OrderID=order_id, UserID=user_id).first()
        if not order:
            raise ValueError("Pedido não encontrado")

        return {
            "order_id": order.OrderID,
            "total_amount": float(order.TotalAmount),
            "order_date": order.OrderDate.strftime('%d/%m/%Y %H:%M'),
            "status": order.order_status.name if order.order_status else None,
            "items": [
                {
                    "product_id": line.product.ProductID,
                    "name": line.product.Name,
                    "price": float(line.product.Price),
                    "quantity": line.Quantity,
                    "img": line.product.ImageLink
                }
                for line in order.lines
            ]
        }

    def create_order(self, user_id, itens: list):

        """
        {
    	"items": [
	    	{"product_id": 4, "quantity": 2},
		    {"product_id": 6, "quantity": 2}
	]
}
        """

        if not itens:
            raise ValueError("O pedido precisa de pelo menos um item")
        
        product_ids =[item['product_id'] for item in itens]
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
        for item in itens:
            product = product_to_map[item['product_id']] #product_to_map[1] = {1: <Product ProductID=1, Name="Pizza", Price=30>} 
            total_amount += product.Price * item['quantity']

        order = Order(
            UserID=user_id,
            TotalAmount=total_amount,
            OrderDate=datetime.now(pytz.timezone("America/Sao_Paulo")),
            OrderStatusID=1
        )

        print(f'{order.OrderDate}')
        for item in itens:
            line = OrderLine(
                ProductID=item['product_id'],
                Quantity=item['quantity']
            )
            order.lines.append(line)
        
        self.db.add(order)
        self.db.commit()
        self.db.refresh(order)

        return order
    
    def add_product_to_order(self, user_id: int, order_id: int, product_id: int, quantity: int):
        order = self.db.query(Order).filter_by(OrderID=order_id, UserID=user_id, OrderStatusID=1).first()
        if not order:
            raise ValueError("Pedido não encontrado")

        if order.OrderStatusID != 1:
            raise ValueError("Não é possível modificar um pedido que não está pendente")

        product = self.db.query(Product).filter_by(ProductID=product_id).first()
        if not product:
            raise ValueError("Produto inválido")

        # Procura se já existe o produto no pedido
        existing_line = next((line for line in order.lines if line.ProductID == product_id), None)
        if existing_line:
            # Apenas soma a quantidade
            existing_line.Quantity += 1
            order.TotalAmount += product.Price
        else:
            # Cria nova linha e adiciona
            new_line = OrderLine(ProductID=product_id, Quantity=quantity)
            order.lines.append(new_line)
            order.TotalAmount += product.Price * quantity

        self.db.commit()
        self.db.refresh(order)
        return order    
    
    def get_opened_order(self, user_id):
        order = self.db.query(Order).filter_by(UserID=user_id, OrderStatusID=1).first()
        
        if not order:
            return None

        return {
            "order_id": order.OrderID,
            "total_amount": float(order.TotalAmount),
            "order_date": order.OrderDate.strftime('%d/%m/%Y %H:%M'),
            "status": order.order_status.name if order.order_status else None,
            "itens": [
                {
                    "product_id": line.product.ProductID,
                    "name": line.product.Name,
                    "price": float(line.product.Price)*line.Quantity,
                    "quantity": line.Quantity,
                    "img": line.product.ImageLink
                }
                for line in order.lines
            ]
        }
    
    def update_order_status(self,user_id:int, order_id: int, new_status_id: int):
        order = self.db.query(Order).filter(Order.OrderID == order_id).first()

        
        if not order:
            raise ValueError("Pedido não encontrado")
        
        order.OrderStatusID = new_status_id
        user = self.db.query(User).filter(User.UserID == user_id).first()
        if not user:
            raise ValueError("Usuário não encontrado")
        
        notifier = UserNotificationService(name=user.Name, email=user.Login)
        
        try:
            sid = notifier.notify_order_created(order.OrderID)
        except Exception as e:
            print(f"Erro ao enviar notificação: {e}")

        self.db.commit()
        self.db.refresh(order)
        return order

    def delete_item(self, user_id, order_id, product_id):
        order = self.db.query(Order).filter(Order.OrderID == order_id, Order.UserID == user_id).first()
        if not order:
            raise ValueError("Pedido não encontrado")

        line = next((l for l in order.lines if l.ProductID == product_id), None)
        if not line:
            raise ValueError("Produto não encontrado no pedido")

        line.Quantity -= 1
        current_quantity = line.Quantity

        if line.Quantity <= 0:
            self.db.delete(line)
            current_quantity = 0

        product = self.db.query(Product).filter(Product.ProductID == product_id).first()
        if product:
            order.TotalAmount -= product.Price
            if order.TotalAmount < 0:
                order.TotalAmount = 0

        self.db.commit()
        self.db.refresh(order)
    
    # Retorne um dicionário explícito
        return {
            'order': order,
            'quantity': current_quantity,
            'OrderLineID': line.OrderLineID if line else None
        }
