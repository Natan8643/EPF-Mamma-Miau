from passlib.hash import bcrypt
import jwt
import datetime
from models.user import User
from sqlalchemy.orm import Session
from config import SECRET_KEY

class UserService:
    def __init__(self, db: Session):
        self.db = db

    def is_user_exists(self, login: str) -> bool:
        return self.db.query(User).filter(User.Login == login).first() is not None

    def create_user(self,name:str, login: str, password: str, phone: str, role: str = 'user'):
        if self.is_user_exists(login):
            return None

        hashed_password = bcrypt.hash(password)
        user = User(Name = name, Login=login, Password=hashed_password, Phone=phone, Role=role)

        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def validate_login(self, login: str, password: str):
        user = self.db.query(User).filter_by(Login=login).first()
        if not user:
            return None

        if not bcrypt.verify(password, user.Password):
            return None

        payload = {
            "user_id": user.UserID,
            "role": user.Role,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
        return token
