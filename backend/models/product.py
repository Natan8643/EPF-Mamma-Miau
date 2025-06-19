from sqlalchemy import Column, Integer, String, Numeric, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Product(Base):
    __tablename__ = 'product'

    ProductID = Column(Integer, primary_key=True)
    Name = Column(String(200), unique=True, nullable=False)
    Price = Column(Numeric(19, 4), nullable=False)