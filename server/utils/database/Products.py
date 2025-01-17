"""
Product utilities
"""

from typing import Annotated

from .models import Beverage
from pydantic import ValidationError
from thefuzz import fuzz
from typing import List
import logging

from . import database, query


beverage_table = database.table("beverages")


def search(name: str) -> List[Beverage]:
    """
    Search for a product using it's name (case insensitive).
    """

    product_queries = beverage_table.search(
        query.name.test(lambda n: fuzz.partial_ratio(n.lower(), name.lower()) >= 80))

    products_tmp: List[Beverage] = []

    for product_query in product_queries:
        try:
            product = Beverage(**product_query)
            products_tmp.append(product)
        except ValidationError as e:
            logging.error(f"Error converting {product_query} - {e}")

    return products_tmp


def searchID(name: str) -> List[str]:
    """
    Search for a product using it's name (case insensitive).

    Returns a list of product IDs.

    """
    product_queries = beverage_table.search(
        query.name.test(lambda n: fuzz.partial_ratio(n.lower(), name.lower()) >= 80))

    products_tmp: List[Beverage] = []

    for product_query in product_queries:
        try:
            product = Beverage(**product_query)
            products_tmp.append(product.id)
        except ValidationError as e:
            logging.error(f"Error converting {product_query} - {e}")

    return products_tmp


def fetchAll() -> List[Beverage]:
    """
    Fetches all of the available products from the database.
    """

    beverages = []
    for item in beverage_table.all():
        try:
            product = Beverage(**item)
            beverages.append(product)
        except Exception as e:
            logging.error(f"Error converting {item} - {e}")

    return beverages


def saveProduct(product: Beverage):
    """
    Saves the product into the database.
    """
    if beverage_table.get(query.id == product.id):
        # If a product already exists return false.
        return False

    try:
        insert(product)
        return True
    except Exception:
        pass

    return False


def editProduct(product_id: str, new_product_data: Beverage):
    """
    Edit the product
    """

    if beverage_table.get(query.id == product_id):

        try:
            beverage_table.update(
                new_product_data.model_dump(), query.id == product_id)
            return True
        except Exception:
            return False

    return False


def insert(data: Beverage):
    beverage_table.insert(data.model_dump())

    logging.info(f"{data} has been inserted.")


def insert_multiple(data: List[Beverage]):
    items = [item.model_dump() for item in data]
    beverage_table.insert_multiple(items)
    logging.info(f"{len(items)} has been inserted.")


def getProductByID(product_id: str) -> Beverage:
    return beverage_table.get(query.id == product_id)


def getProductByHash(product_hash: str) -> Beverage:
    return beverage_table.get(query.hash == product_hash)


def deleteProductByID(product_id: str):
    beverage_table.remove(query.id == product_id)


def getProductCount():
    return beverage_table.count(query.id != "")
