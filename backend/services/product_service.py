from sqlalchemy.orm import Session
from models.product import Product

class ProductService:
    def __init__(self, db: Session):
        self.db = db

    def get_all_products(self):
        products = self.db.query(Product).all()
        return [self.serialize_product(product) for product in products]

    def serialize_product(self, product):
        return {
            "ProductID": product.ProductID,
            "Name": product.Name,
            "Category": product.Category,
            "Price": str(product.Price),
        }

    def create_product(self, name:str, category:str, price:str):
        new_product = Product(Name=name, Category=category, Price=price)

        self.db.add(new_product)
        self.db.commit()
        self.db.refresh(new_product)
        return new_product