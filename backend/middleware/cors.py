from bottle import response, request

def apply_cors(app):
    @app.hook('after_request')
    def _add_cors_headers():
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, Authorization'

    # Suporte para pré-vias OPTIONS
    @app.route('/<:re:.*>', method='OPTIONS')
    def _handle_options():
        return
