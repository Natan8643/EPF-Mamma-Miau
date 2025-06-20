from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from config import Base

class OrderLine(Base):
    __tablename__ = 'orderline'

    OrderLineID = Column(Integer, primary_key=True)
    OrderID = Column(Integer, ForeignKey('order.OrderID'), nullable=False)
    ProductID = Column(Integer, ForeignKey('product.ProductID'), nullable=False)
    Quantity = Column(Integer, nullable=False)

    # Relacionamentos
    #order = relationship('Order', back_populates='lines')
    product = relationship('Product', backref='order_lines')