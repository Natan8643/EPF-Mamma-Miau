from sqlalchemy import Column, Integer, String, Numeric, ForeignKey
from sqlalchemy.orm import relationship
from config import Base

class Product(Base):
    __tablename__ = 'product'

    ProductID = Column(Integer, primary_key=True)
    Category = Column(Integer, ForeignKey('category.categoryID'), nullable=False)
    Name = Column(String(200), nullable=False)
    Price = Column(Numeric(19, 4), nullable=False)

    category = relationship("Category", back_populates="products")
