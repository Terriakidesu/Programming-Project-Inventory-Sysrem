from fastapi import APIRouter, Request, Form, Depends
from fastapi.responses import JSONResponse

from ...utils import database

beverage_router = APIRouter(prefix="/beverages")


@beverage_router.post("/search", response_class=JSONResponse)
async def search(request: Request, name: str = Form(...)):
    if name is None or name.strip() == "":
        return []

    results = database.search(name)
    return results


@beverage_router.get("/all", response_class=JSONResponse)
async def fetch_all_beverages(request: Request):
    return database.fetchAll()
