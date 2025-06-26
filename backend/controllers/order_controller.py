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
        #so pode adicionar se estiver com status pendente
        #so pode adicionar se ainda n estiver no pedido (passar pro orderLine?)
        @order_routes.put('/order/<order_id:int>')
        @role_required('user')
        def add_product_to_order(user_id, order_id):
            data = request.json
            
            product_id = data.get('product_id')
            quantity = data.get('quantity')

            if not product_id or not quantity:
                response.status = 400
                return {"error": "Produto e quantidade são obrigatórios"}

            db = SessionLocal()

            try:
                order_service = OrderService(db)
                updated_order = order_service.add_product_to_order(user_id, order_id, product_id, quantity)
                return {"message": "Produto adicionado ao pedido", "order_id": updated_order.OrderID}
            except ValueError as e:
                response.status = 400
                return {"error": str(e)}
            finally:
                db.close()

        @order_routes.get('/orders/shopping-cart')
        @role_required('user') 
        def get_my_opened_order(user_id):
            db = SessionLocal()
            order_service = OrderService(db)
            order = order_service.get_opened_order(user_id)
            db.close()

            return {"order": order}
        
        @order_routes.put('/user/pagamento/<order_id:int>')
        @role_required('user')
        def change_status(user_id, order_id):

            try:
                db = SessionLocal()
                order_service = OrderService(db)
                updated_order = order_service.update_order_status(order_id, 2)
                return {'message': 'Status atualizado', 'order': updated_order.OrderID}
            
            except ValueError as e:
                response.status = 404
                return {'error': str(e)}
            finally:
                db.close()

OrderController(order_routes)

