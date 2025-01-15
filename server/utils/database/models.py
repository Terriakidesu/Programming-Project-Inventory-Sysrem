from pydantic import BaseModel
from typing import Optional


class Beverage(BaseModel):
    id: str
    hash: str
    name: str
    size: str
    quantity: int
    per_piece_price: float
    wholesale_quantity: int
    wholesale_price: float


class OrderItem(BaseModel):
    product_id: str
    quantity: int
    total_price: float


class Order(BaseModel):
    id: str
    name: str
    date: int
    orders: list[OrderItem]
    total_quantity: int
    total_price: float
