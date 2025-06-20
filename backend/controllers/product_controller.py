from bottle import Bottle, request, response
from security.jwt_utils import role_required
from services.product_service import ProductService
from config import SessionLocal

product_routes = Bottle()

class ProductController():
    def __init__(self, app):
        self.app = app
        self.setup_routes()

    def setup_routes(self):
        @product_routes.get('/products')
        def get_products():
            
            db = SessionLocal()
            product_service = ProductService(db)
            products = product_service.get_all_products()
            db.close()

            return {"products": products}

        @product_routes.post('/product')
        @role_required('admin')
        def creat_product(user_id):
            data = request.json

            name = data.get('name')
            category = data.get('category')
            price = data.get('price')

            db = SessionLocal()
            product_service = ProductService(db)

            product = product_service.create_product(name=name, category=category, price=price)
            
            if product:
                productId =product.ProductID
                db.close()
                response.status = 201
                return {"message":"Criado com sucesso", "product_id": productId}
            else:
                db.close()
                response.status = 500
                return {"error": "erro ao criar produto"}


ProductController(product_routes)

