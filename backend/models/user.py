from sqlalchemy import Column, Integer, String, VARCHAR
from config import Base
from models.base_user import BaseUser

class User(BaseUser, Base):
    __tablename__ = 'user'

    UserID = Column(Integer, primary_key=True)
    Name = Column(String, index=True)
    Login = Column(VARCHAR(100), unique=True)
    Password = Column(VARCHAR(255))
    Phone = Column(VARCHAR(20))
    Role = Column(String, default='user')

    def __init__(self, nome, telefone, login, password, role='user'):
        super().__init__(nome, telefone)
        self.Name = nome
        self.Phone = telefone
        self.Login = login
        self.Password = password
        self.Role = role