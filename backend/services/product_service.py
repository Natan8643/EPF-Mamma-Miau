from sqlalchemy.orm import Session
from models.product import Product
from models.category import Category
class ProductService:
    def __init__(self, db: Session):
        self.db = db

    def get_all_products(self):
        products = self.db.query(Product).join(Product.category).all()

        grouped = {}

        for product in products:
            category_name = product.category.name

            if category_name not in grouped:
                grouped[category_name] = []

            grouped[category_name].append({
                "id": product.ProductID,
                "nome": product.Name,
                "preco": str(product.Price),
                "img": product.ImageLink
            })

        result = [{"categoria": k, "itens": v} for k, v in grouped.items()]

        return {"products": result}

    def create_product(self, name:str, category:str, price:str, imageLink:str):
        new_product = Product(Name=name, Category=category, Price=price, ImageLink=imageLink)

        self.db.add(new_product)
        self.db.commit()
        self.db.refresh(new_product)
        return new_product