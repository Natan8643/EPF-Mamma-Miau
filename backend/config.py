import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()
#SQLALCHEMY_DATABASE_URL = 


class Config:
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    # Configurações do servidor
    HOST = 'localhost'
    PORT = 5000
    DEBUG = True
    RELOADER = True

    # Paths
    TEMPLATE_PATH = os.path.join(BASE_DIR, 'views')
    STATIC_PATH = os.path.join(BASE_DIR, 'static')
    DATA_PATH = os.path.join(BASE_DIR, 'data')

    # Outras configurações

SQLALCHEMY_DATABASE_URL = "postgresql://postgres:200274@localhost/mamma-miau"
SECRET_KEY = 'python-api'
#SQLALCHEMY_DATABASE_URL = 

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


FROM_EMAIL = "kelytonlucas3@gmail.com"
ORDER_CREATED_TEMPLATE_ID = "d-0c8e7b3a3ccd4e089811a2b80b28c607"
