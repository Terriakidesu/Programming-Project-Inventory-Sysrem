from .settings import Settings

from hashlib import md5


def generate_md5_hash(string: str):
    """
    Generate an unique hash based from the input string
    """
    return md5(string.encode()).hexdigest()
