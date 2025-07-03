from sqlalchemy import Column, Integer, ForeignKey, DateTime, Numeric
from sqlalchemy.orm import relationship
from config import Base


class Order(Base):
    __tablename__ = 'order'

    OrderID = Column(Integer, primary_key=True)
    UserID = Column(Integer, ForeignKey('user.UserID'), nullable=False)
    TotalAmount = Column(Numeric(19, 4))
    OrderDate = Column(DateTime, nullable=False)
    OrderStatusID = Column(Integer, ForeignKey('orderstatus.orderstatusid'), nullable=True)

    # Relacionamentos
    user = relationship('User', backref='orders')
    order_status = relationship('OrderStatus', backref='orders')
    lines = relationship('OrderLine', backref='lines')

    #backref -> atalho bidirecional(pelo orderLine precisamos acessar oder, e pelo order precisamos acessar orderLine)
    #entao com backref ele ja cria direto o relacionamento

    #back_populates -> é explicito, se fazemos de uma lado tem que ser feito no outro
