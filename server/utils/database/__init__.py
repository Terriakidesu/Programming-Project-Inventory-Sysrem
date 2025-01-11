import logging
import os 

from typing import List
from thefuzz import fuzz
from tinydb import TinyDB, JSONStorage, Query
from pydantic import ValidationError

from .models import Beverage

os.makedirs("db", exist_ok=True)

database = TinyDB("db/database.json",
                  storage=JSONStorage)

Beverages = Query()
beverage_table = database.table("beverages")


def search(name: str) -> List[Beverage]:
    product_queries = beverage_table.search(
        Beverages.name.test(lambda n: fuzz.partial_ratio(n, name) >= 80))

    products_tmp: List[Beverage] = []

    for product_query in product_queries:
        try:
            product = Beverage(**product_query)
            products_tmp.append(product)
        except ValidationError as e:
            logging.error(f"Error converting {product_query} - {e}")

    return products_tmp


def fetchAll() -> List[Beverage]:
    beverages = []
    for item in beverage_table.all():
        try:
            product = Beverage(**item)
            beverages.append(product)
        except Exception as e:
            logging.error(f"Error converting {item} - {e}")

    return beverages


def insert(data: Beverage):
    beverage_table.insert(data.model_dump())

    logging.info(f"{data} has been inserted.")


def insert_multiple(data: List[Beverage]):
    items = [item.model_dump() for item in data]
    beverage_table.insert_multiple(items)
    logging.info(f"{len(items)} has been inserted.")
