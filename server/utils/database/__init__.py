import os

from tinydb import TinyDB, JSONStorage, Query


PATH = "db"
FILENAME = "database.json"
FILEPATH = os.path.join(PATH, FILENAME)

db_status = {
    "changed": False,
    "products": 0,
    "orders": 0,
    "profits": 0
}

os.makedirs(PATH, exist_ok=True)

database = TinyDB(
    FILEPATH,
    storage=JSONStorage,
    indent=4
)

query = Query()
