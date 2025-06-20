from sqlalchemy import Column, Integer, String
from config import Base


class OrderStatus(Base):
    __tablename__ = 'orderstatus'

    OrderStatusID = Column(Integer, primary_key=True)
    Name = Column(String, unique=True, nullable=False)
