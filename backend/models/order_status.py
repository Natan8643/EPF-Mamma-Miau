from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class OrderStatus(Base):
    __tablename__ = 'orderstatus'

    OrderStatusID = Column(Integer, primary_key=True)
    Name = Column(String, unique=True, nullable=False)
