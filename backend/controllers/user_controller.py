from bottle import Bottle, request, route, response
from security.jwt_utils import role_required


class UserController():
    def __init__(self, app):
        self.app = app
        self.setup_routes()


    
    def setup_routes(self):
        
        @route('/register', method='POST')    
        def register():
            data = request.json
            login = data.get('login')
            phone = data.get('phone')
            password = data.get('password')
            role = data.get('role', 'user')

            if login or not password:
                response.status = 400
                return {"error": "login e password são obrigatórios"}
            
            user = creat_user(login=login, password=password, role=role, phone=phone)
            if user:
                response.status = 201
                return {"message":"Criado com sucesso", "user_id": user.id}
            else:
                response.status = 500
                return {"error": "erro ao criar usuario"}
        
        @route('/login', method='POST')
        def login():
            data = request.json
            login = data.get('login')
            password = data.get('password')

            token = validate_login(login=login, password=password)

            if token:
                return {"token", token}
            response.status = 401

            return {"error": "Credenciais invalidas"}
        

        @route('/user')
        @role_required('user')
        def hello():
            return {"message": f"Rota de user"}
        
        @route('/adim')
        @role_required('admin')
        def hello_admin():
            return {"message": f"Rota de admin"}
