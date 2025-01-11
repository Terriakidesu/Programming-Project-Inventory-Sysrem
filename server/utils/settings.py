import os
import configparser

from pydantic import BaseModel

from .singleton import Singleton

CONFIG_PATH = "config.ini"

DEFAULT_CONFIG = """
[Cookie]
max_age=60

[Security]
; Default Password: Administrator
password_hash=e7d3e769f3f593dadcb8634cc5b09fc90dd3a61c4a06a79cb0923662fe6fae6b

[Secrets]
secret_key=ReplaceMeOnProduction
""".strip()


class CookieSettings(BaseModel):
    max_age: int


class SecuritySettings(BaseModel):
    password_hash: str


class SecretsSettings(BaseModel):
    secret_key: str


class ConfigSettings(object):
    __metaclass__ = Singleton

    def __init__(self):
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
        self.Security: SecuritySettings = SecuritySettings(
            **self.config["Security"])
        self.Secrets: SecretsSettings = SecretsSettings(
            **self.config["Secrets"])


Settings = ConfigSettings()
