from sqlalchemy.orm import Session
from models.order import Order
from models.product import Product
from models.order_line import OrderLine
from datetime import datetime
from models.user import User
from services.user_notification_service import UserNotificationService

class OrderService:
    def __init__(self, db: Session):
        self.db = db

    def get_all_orders(self, user_id):
        orders = self.db.query(Order).filter_by(UserID=user_id).all()

        return [self.serialize_orders(order) for order in orders]

    def serialize_orders(self, order):
        return {
            "order_id": order.OrderID,
            "total_amount": float(order.TotalAmount),
            "order_date": order.OrderDate.strftime('%d/%m/%Y %H:%M'),
            "status": order.OrderStatusID,
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
                }
                for line in order.lines
            ]
        }

    def create_order(self, user_id, items: list):

        """
        {
    	"items": [
	    	{"product_id": 4, "quantity": 2},
		    {"product_id": 6, "quantity": 2}
	]
}
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

        #--chama serviço de sms
        user = self.db.query(User).filter(User.UserID == user_id).first()
        if not user:
            raise ValueError("Usuário não encontrado")
        
        notifier = UserNotificationService(name=user.Name, email=user.Login)
        
        try:
            sid = notifier.notify_order_created(order.OrderID)
        except Exception as e:
            print(f"Erro ao enviar notificação: {e}")
        return order
    
    def add_product_to_order(self, user_id: int, order_id: int, product_id: int, quantity: int):
        order = self.db.query(Order).filter_by(OrderID=order_id, UserID=user_id, OrderStatusID=1).first()
        if not order:
            raise ValueError("Pedido não encontrado")

        if order.OrderStatusID != 1:
            raise ValueError("Não é possível modificar um pedido que não está pendente")

    
        existing_line = next((line for line in order.lines if line.ProductID == product_id), None)
        if existing_line: #Verifica se o produto já foi adicionado
            raise ValueError("Este produto já está no pedido")

        product = self.db.query(Product).filter_by(ProductID=product_id).first()
        if not product:
            raise ValueError("Produto inválido")

        new_line = OrderLine(ProductID=product_id, Quantity=quantity)
        order.lines.append(new_line) #Cria nova linha e adiciona

        order.TotalAmount += product.Price * quantity

        self.db.commit()
        self.db.refresh(order)
        return order    
    
    def get_opened_order(self, user_id):
        order = self.db.query(Order).filter_by(UserID=user_id, OrderStatusID=1).first()
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
                }
                for line in order.lines
            ]
        }
    
    def update_order_status(self, order_id: int, new_status_id: int):
        order = self.db.query(Order).filter(Order.OrderID == order_id).first()
        if not order:
            raise ValueError("Pedido não encontrado")
        
        order.OrderStatusID = new_status_id
        self.db.commit()
        self.db.refresh(order)
        return order

