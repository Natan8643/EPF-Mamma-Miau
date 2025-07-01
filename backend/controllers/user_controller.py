from bottle import Bottle, request, response
from security.jwt_utils import role_required
from services.user_service import UserService
from config import SessionLocal

user_routes = Bottle()

class UserController():
    def __init__(self, app):
        self.app = app
        self.setup_routes()
    
    def setup_routes(self):
        
        @user_routes.post('/register')    
        def register():
            data = request.json
            login = data.get('login')
            phone = data.get('phone')
            name = data.get('name')
            password = data.get('password')
            role = data.get('role', 'user')

            print(f'{login} e {password}')

            if not login or not password:
                response.status = 400
                return {"error": "login e password são obrigatórios"}
            
            db = SessionLocal()
            user_service = UserService(db)
            user = user_service.create_user(name=name, login=login, password=password, role=role, phone=phone)
            
            if user:
                userId =user.UserID
                db.close()
                response.status = 201
                return {"message":"Criado com sucesso", "user_id": userId}
            else:
                db.close()
                response.status = 500
                return {"error": "erro ao criar usuario"}
        
        @user_routes.post('/login')
        def login():
            data = request.json
            login = data.get('login')
            password = data.get('password')

            if not login or not password:
                response.status = 400
                return {"error": "Login e senha são obrigatórios"}

            db = SessionLocal()
            user_service = UserService(db)
            validate = user_service.validate_login(login, password)
            db.close()
            
            if validate:
                return {
                    "token": validate["token"],
                    "user": {
                        "id": validate["user"].UserID,
                        "name": validate["user"].Name,
                        "role": validate["user"].Role
                    }
                }

            response.status = 401
            return {"error": "Credenciais inválidas"}
        

        @user_routes.get('/user')
        @role_required('user')
        def hello(user_id):
            return {"message": f"Rota de user"}
        
        @user_routes.get('/admin')
        @role_required('admin')
        def hello_admin(user_id):
            return {"message": f"Rota de admin"}
        
        @user_routes.get('/teste')
        def hello_mundo():
            return {"message": f"hello world"}

UserController(user_routes)

