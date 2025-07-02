from sqlalchemy import Column, Integer, String
from config import Base
from sqlalchemy.orm import relationship


class Category(Base):
    __tablename__ = 'category'

    categoryID = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)
    products = relationship("Product", back_populates="category")

