from fastapi import APIRouter, Request, Form, Depends
from fastapi.responses import JSONResponse

from ...utils import database

api_router = APIRouter(prefix="/api")


@api_router.post("/products/search", response_class=JSONResponse)
async def search(request: Request, name: str = Form(...)):
    if name is None or name.strip() == "":
        return []

    results = database.search(name)
    return results


@api_router.get("/products/all", response_class=JSONResponse)
async def fetch_all_beverages(request: Request):
    return database.fetchAll()
