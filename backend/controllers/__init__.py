from bottle import Bottle
from controllers.user_controller import user_routes
from controllers.product_controller import product_routes
def init_controllers(app: Bottle):
    app.merge(user_routes)
    app.merge(product_routes)