"""
    Order utils
"""

from .models import Order
from pydantic import ValidationError
from thefuzz import fuzz
from typing import List
import logging

from . import database, query

orders_table = database.table("orders")


def fetchAll() -> List[Order]:
    """
    Fetches all of the available orders in the database.
    """
    orders = []
    for item in orders_table.all():
        try:
            product = Order(**item)
            orders.append(product)
        except Exception as e:
            logging.error(f"Error converting {item} - {e}")

    return orders


def saveOrder(order: Order):
    """
    Saves the order into the database
    """
    if orders_table.get(query.id == order.id):
        return False

    try:
        insert(order)
        return True
    except Exception as e:
        print(e)
        pass

    return False


def editOrder(order_id: str, order: Order):
    """
    Edits the order specified by the order's ID.
    """
    if orders_table.get(query.id == order_id):
        try:
            orders_table.update(order.model_dump(), query.id == order_id)
        except Exception as e:
            print(e)
            return False

        return True

    return False


def insert(data: Order):
    orders_table.insert(data.model_dump())

    logging.info(f"{data} has been inserted.")


def insert_multiple(data: List[Order]):
    items = [item.model_dump() for item in data]
    orders_table.insert_multiple(items)
    logging.info(f"{len(items)} has been inserted.")


def getOrderByID(order_id: str) -> Order:
    return orders_table.get(query.id == order_id)


def deleteOrderByID(order_id: str):
    orders_table.remove(query.id == order_id)


def getOrderCount():
    """
    Returns the available order count.
    """
    return orders_table.count(query.id != "")


def getTotalProfits():
    """
    Calculates the total profits from the orders.
    """
    profits = 0

    for order in fetchAll():
        profits += order.total_price

    return profits
