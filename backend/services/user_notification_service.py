from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from models.base_user import BaseUser
from config import SENDGRID_API_KEY, FROM_EMAIL

class UserNotificationService(BaseUser):
    def __init__(self, name, email):
        super().__init__(name, email)

    def notify_order_created(self, order_id):
        message = Mail(
            from_email=FROM_EMAIL,
            to_emails=self.email,
            subject=f'Pedido {order_id} criado!',
            html_content=f'<strong>Olá {self.name}, seu pedido {order_id} acaba de ser criado!!!</strong>'
        )
        try:
            sg = SendGridAPIClient(SENDGRID_API_KEY)
            response = sg.send(message)
            return response.status_code
        except Exception as e:
            print(f"Erro ao enviar email: {e}")
            return None
