from bottle import Bottle, request, response
from security.jwt_utils import role_required
from services.order_service import OrderService
from config import SessionLocal

order_routes = Bottle()

class OrderController():
    def __init__(self, app):
        self.app = app
        self.setup_routes()

    def setup_routes(self):

        
        @order_routes.get('/orders')
        @role_required('user')
        def get_my_orders(user_id):

            db = SessionLocal()
            order_service = OrderService(db)
            orders = order_service.get_all_orders(user_id)
            db.close()

            return {"orders": orders}
        
        @order_routes.get('/order/<order_id:int>')
        @role_required('user')
        def get_my_order(user_id, order_id):
            db = SessionLocal()
            order_service = OrderService(db)
            order = order_service.get_order_by_id(user_id=user_id, order_id=order_id)
            db.close()

            return {"order": order}
        
        @order_routes.post('/order')
        @role_required('user')
        def create_order(user_id):
            data = request.json
            items = data.get('items')

            if not items or not isinstance(items, list):
                response.status = 400
                return{"erro":"Lista de itens invalida"}
            
            print([{"ProductID": item["product_id"], "quantity": item["quantity"]} for item in items])

            db = SessionLocal()
            order_service = OrderService(db)

            try:
                order = order_service.create_order(user_id=user_id, items=items)
                return {"message": "Pedido criado", "order_id": order.OrderID}
            except ValueError as ve:
                response.status = 400
                return {"error": str(ve)}
            except Exception as e:
                response.status = 500
                return {"error": "Erro ao criar pedido"}
            finally:
                db.close()
            

            #criar outra rota pra anexar um produto ao mesmo pedido
OrderController(order_routes)

