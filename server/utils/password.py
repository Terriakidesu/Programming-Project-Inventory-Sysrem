from hashlib import sha256
from .singleton import Singleton
from .settings import Settings


class PasswordManager(object):
    __meta__ = Singleton

    def __init__(self):
        ...

    def toSHA256String(self, string: str):
        return sha256(string.encode()).hexdigest()

    def verify_password(self, password: str):
        return self.toSHA256String(password) == Settings.Security.password_hash

Password = PasswordManager()