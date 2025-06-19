from sqlalchemy import Column, Integer, String, VARCHAR, Index, UniqueConstraint
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = 'user'

    UserID = Column(Integer, primary_key=True)
    Name = Column(String, index=True)
    Login = Column(VARCHAR(100), unique=True)
    Password = Column(VARCHAR(255))
    Phone = Column(VARCHAR(20))
