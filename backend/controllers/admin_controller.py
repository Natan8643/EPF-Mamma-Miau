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
            total = admin_service.total_balance()
            db.close()

            return {"totalAmount": total}

AdminController(admin_routes)
