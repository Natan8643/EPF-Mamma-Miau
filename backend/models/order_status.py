from sqlalchemy import Column, Integer, String
from config import Base


class OrderStatus(Base):
    __tablename__ = 'orderstatus'

    orderstatusid = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)
