from sqlalchemy import Column, Integer, String
from config import Base


class Category(Base):
    __tablename__ = 'category'

    categoryID = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)
