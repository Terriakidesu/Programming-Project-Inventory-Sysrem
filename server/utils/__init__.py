from .settings import Settings

from hashlib import md5

def generate_md5_hash(string: str):
    return md5(string.encode()).hexdigest()
