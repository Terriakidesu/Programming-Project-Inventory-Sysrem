import os
import configparser

from dotenv import load_dotenv
from pydantic import BaseModel

from .singleton import Singleton

CONFIG_PATH = "config.ini"

DEFAULT_CONFIG = """
[Cookie]
max_age=60
""".strip()


class CookieSettings(BaseModel):
    max_age: int


class SecretsSettings(BaseModel):
    secret_key: str


class ConfigSettings(object):
    __metaclass__ = Singleton

    def __init__(self):
        load_dotenv()

        self.checkConfig()
        self.config = configparser.ConfigParser()
        self.readConfig()

    def checkConfig(self):
        if not os.path.isfile(CONFIG_PATH):
            with open(CONFIG_PATH, "w") as f:
                f.write(DEFAULT_CONFIG)

    def readConfig(self):
        self.config.read(CONFIG_PATH)

        self.Cookie: CookieSettings = CookieSettings(
            **self.config["Cookie"])

        self.Secrets: SecretsSettings = SecretsSettings(
            secret_key=os.getenv("secret_key"))


Settings = ConfigSettings()
