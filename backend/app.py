from bottle import Bottle
from config import Config, engine, Base
import models
from middleware.cors import apply_cors

class App:
    def __init__(self):
        self.bottle = Bottle()
        self.config = Config()

        apply_cors(self.bottle)


    def setup_database(self):
        Base.metadata.create_all(engine)


    def setup_routes(self):
        from controllers import init_controllers

        print('🚀 Inicializa rotas!')
        init_controllers(self.bottle)


    def run(self):
        self.setup_database()
        self.setup_routes()
        self.bottle.run(
            host=self.config.HOST,
            port=self.config.PORT,
            debug=self.config.DEBUG,
            reloader=self.config.RELOADER
        )


def create_app():
    return App()
