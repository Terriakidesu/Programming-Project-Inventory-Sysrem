
import os
from cryptography.fernet import Fernet
import json

from ..singleton import Singleton

from .models import Account
from .exceptions import NoAccountFound


class AccountManager:
    """
    Singleton object for managing the account
    """
    __meta__ = Singleton

    PATH = ".secrets/"
    KEY_FILENAME = "secret.key"
    ACCOUNT_FILENAME = "account.enc"

    def __init__(self):
        # Create a directory for storing the related files
        os.makedirs(self.PATH, exist_ok=True)

        self.load_key()
        self.fernet = Fernet(self.key)

    def load_key(self):
        """
        Loads the key for decryption/encryption
        """
        if os.path.isfile(self.key_filepath):
            with open(self.key_filepath, "rb") as f:
                self.key = f.read()
            return

        self.generate_key()

    def generate_key(self):
        """
        Generate a new key if there's not one yet.
        """
        with open(self.key_filepath, "wb") as f:
            self.key = Fernet.generate_key()
            f.write(self.key)

    def encrypt_account(self, account: Account):
        """
        Encrypts the account
        """
        data = account.model_dump_json()
        return self.fernet.encrypt(data.encode())

    def decrypt_account(self, encrypted_account: bytes):
        """
        Decrypts the account
        """
        data = self.fernet.decrypt(encrypted_account).decode()
        json_data = json.loads(data)
        return Account(**json_data)

    def load_account(self):
        """
        Loads the account.

        Returns an error if it doesn't exist.
        """
        if os.path.isfile(self.account_filepath):
            with open(self.account_filepath, "rb") as f:
                encrypted_account = f.read()
                return self.decrypt_account(encrypted_account)

        raise NoAccountFound("Account Doesn't Exist")

    def save_account(self, account: Account):
        """
        Writes the account into a file.
        """
        with open(self.account_filepath, "wb") as f:
            encrypted_account = self.encrypt_account(account)
            f.write(encrypted_account)

    def verify_auth(self, account: Account):
        """
        Check if the account's username and password is the same as the saved account
        """
        existring_account = self.load_account()
        return existring_account.username == account.username and existring_account.password == account.password

    @property
    def key_filepath(self):
        return os.path.join(self.PATH, self.KEY_FILENAME)

    @property
    def account_filepath(self):
        return os.path.join(self.PATH, self.ACCOUNT_FILENAME)

    @property
    def account_exists(self):
        try:
            self.load_account()
            return True
        except NoAccountFound:
            return False


Account_Manager = AccountManager()
