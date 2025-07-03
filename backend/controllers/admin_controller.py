from bottle import Bottle, request, response
from security.jwt_utils import role_required
from services.admin_service import AdminService 
from config import SessionLocal

admin_routes = Bottle()

class AdminController():
    def __init__(self, app):
        self.app = app
        self.setup_routes()

    def setup_routes(self):

        @admin_routes.get('/balance')
        @role_required('admin')
        def get_balance(user_id):
            db = SessionLocal()
            admin_service = AdminService(db)
            totals = admin_service.balance()
            db.close()

            return {"balance": totals}
        
        @admin_routes.get('/profit')
        @role_required('admin')
        def get_profit(user_id):
            db = SessionLocal()
            admin_service = AdminService(db)
            profits = admin_service.profits()
            db.close()

            return {"profits": profits}

         #criar rota pra atualizar status do pedido
        @admin_routes.put('/admin/status/<order_id:int>')
        @role_required('admin')
        def change_status(user_id, order_id):

            try:
                db = SessionLocal()
                admin_service = AdminService(db)
                updated_order = admin_service.update_order_status(order_id, 3)
                return {'message': 'Status atualizado', 'order': updated_order.OrderID}
            
            except ValueError as e:
                response.status = 404
                return {'error': str(e)}
            finally:
                db.close()

        @admin_routes.get('/admin/opened-orders')
        @role_required('admin')
        def get_selected_orders(user_id):
            db = SessionLocal()
            admin_service = AdminService(db)
            opened_orders = admin_service.opened_orders()

            return {"opened_orders": opened_orders}

        @admin_routes.get('/best-dishes')
        @role_required('admin')
        def get_best_dishes(user_id):
            db = SessionLocal()
            admin_service = AdminService(db)
            dishes = admin_service.best_dishes()
            return dishes
        

AdminController(admin_routes)
"""{
	"items":[
		{"product_id": 4, "quantity": 1},
		{"product_id": 5, "quantity": 5},
		{"product_id": 1, "quantity": 2},
		{"product_id": 3, "quantity": 2},
		{"product_id": 6, "quantity": 10}
	]
}"""