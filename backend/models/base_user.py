class BaseUser:
    def __init__(self, name: str, email: str):
        self.name = name
        self.email = email

    def notify_order_created(self, message: str):
        raise NotImplementedError("subclasses devem implementar")
