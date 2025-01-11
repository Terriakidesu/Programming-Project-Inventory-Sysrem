from pydantic import BaseModel
from typing import Optional


class Beverage(BaseModel):
    name: str
    ml: str
    quantity: int
    per_piece_price: float
    wholesale_quantity: str
    wholesale_price: float
