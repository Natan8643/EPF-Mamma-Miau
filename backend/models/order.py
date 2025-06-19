from sqlalchemy import Column, Integer, ForeignKey, DateTime, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Order(Base):
    __tablename__ = 'order'

    OrderID = Column(Integer, primary_key=True)
    UserID = Column(Integer, ForeignKey('user.UserID'), nullable=False)
    TotalAmount = Column(Numeric(19, 4))
    OrderDate = Column(DateTime, nullable=False)
    OrderStatusID = Column(Integer, ForeignKey('orderstatus.OrderStatusID'), nullable=False)

    # Relacionamentos
    user = relationship('User', backref='orders')
    order_status = relationship('OrderStatus', backref='orders')
