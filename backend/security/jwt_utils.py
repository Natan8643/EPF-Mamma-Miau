import jwt
import datetime
from bottle import request, HTTPResponse
from functools import wraps
from config import SECRET_KEY

def generate_token(user_id, role):
    payload = {
        'user_id': user_id,
        'role': role,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=2)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def decode_token(token):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def role_required(required_role):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            auth_header = request.headers.get('Authorization')
            if not auth_header or not auth_header.startswith('Bearer '):
                return HTTPResponse(status=401, body={'error': 'Token não fornecido'})

            token = auth_header.split(" ")[1]
            data = decode_token(token)

            if not data:
                return HTTPResponse(status=401, body={'error': 'Token inválido ou expirado'})

            if data.get("role") != required_role:
                return HTTPResponse(status=403, body={'error': f"Acesso restrito a {required_role}"})

            return f(user_id=data['user_id'], *args, **kwargs)
        return decorated
    return decorator

