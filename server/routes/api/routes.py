import time
import json
import logging

from uuid import uuid4
from typing import Annotated

from fastapi import APIRouter, Request, Form, Depends
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.exceptions import HTTPException

from ..auth.dependencies import isAuthenticated
from ...utils import database, generate_md5_hash
from ...utils.database import Products, Orders
from ...utils.database.models import Beverage, Order

api_router = APIRouter(prefix="/api")


@api_router.post("/products/search", response_class=JSONResponse)
async def search_product(request: Request, query: str = Form(...), authenticated=Depends(isAuthenticated)):

    if not authenticated:
        raise HTTPException(status_code=401, detail="Not Allowed")

    if query is None or query.strip() == "":
        return []

    results = Products.search(query)
    return results


@api_router.post("/products/searchID", response_class=JSONResponse)
async def search_product(request: Request, query: str = Form(...), authenticated=Depends(isAuthenticated)):

    if not authenticated:
        raise HTTPException(status_code=401, detail="Not Allowed")

    if query is None or query.strip() == "":
        return []

    results = Products.searchID(query)
    return results


@api_router.get("/products/all", response_class=JSONResponse)
async def fetch_all_products(request: Request, authenticated=Depends(isAuthenticated)):

    if not authenticated:
        raise HTTPException(status_code=401, detail="Not Allowed")

    return Products.fetchAll()


@api_router.get("/products/{product_id}", response_class=JSONResponse)
async def get_product(request: Request, product_id: str, authenticated=Depends(isAuthenticated)):

    if not authenticated:
        raise HTTPException(status_code=401, detail="Not Allowed")

    return Products.getProductByID(product_id)


@api_router.post("/products/save", response_class=JSONResponse)
async def save_product(request: Request, product: Annotated[Beverage, Form()], authenticated=Depends(isAuthenticated)):

    if not authenticated:
        raise HTTPException(status_code=401, detail="Not Allowed")

    if product.id == "":
        product.id = str(uuid4())

    if product.hash == "":
        product.hash = generate_md5_hash(
            product.name.lower().strip() + product.size.replace(" ", "").lower())

        if Products.getProductByHash(product.hash):
            return {
                "success": False,
                "message": "Product Already Exist"
            }

    result = Products.saveProduct(product)

    return {
        "success": result,
        "message": ""
    }


@api_router.post("/products/edit", response_class=JSONResponse)
async def edit_product(request: Request, product: Annotated[Beverage, Form()], authenticated=Depends(isAuthenticated)):
    if not authenticated:
        raise HTTPException(status_code=401, detail="Not Allowed")

    product.hash = generate_md5_hash(
        product.name.lower().strip() + product.size.replace(" ", "").lower())

    result = Products.editProduct(product)

    return {
        "success": result,
        "message": ""
    }


@api_router.post("/products/delete/{product_id}", response_class=JSONResponse)
async def delete_product(request: Request, product_id: str, authenticated=Depends(isAuthenticated)):

    if not authenticated:
        raise HTTPException(status_code=401, detail="Not Allowed")

    try:
        Products.deleteProductByID(product_id)
    except Exception as e:
        return {
            "success": False,
            "message": e
        }

    return {
        "success": True,
        "message": "Delete Successful!"
    }


@api_router.post("/orders/add", response_class=JSONResponse)
async def add_order(request: Request,
                    id: str = Form(...),
                    name: str = Form(...),
                    date: str = Form(...),
                    orders: str = Form(...),  # JSON string of orders
                    total_quantity: int = Form(...),
                    total_price: float = Form(...),
                    authenticated=Depends(isAuthenticated)):

    if not authenticated:
        raise HTTPException(status_code=401, detail="Not Allowed")

    orders = json.loads(orders)

    order_data = {
        "id": id,
        "name": name,
        "date": date,
        "orders": orders,
        "total_quantity": total_quantity,
        "total_price": total_price,
    }

    order = Order(**order_data)

    if order.id == "":
        order.id = str(uuid4())

    result = Orders.saveOrder(order)

    return {
        "success": result,
        "message": "" if result else "Unsuccessful!"
    }


@api_router.post("/orders/edit", response_class=JSONResponse)
async def edit_order(request: Request,
                     id: str = Form(...),
                     name: str = Form(...),
                     date: str = Form(...),
                     orders: str = Form(...),  # JSON string of orders
                     total_quantity: int = Form(...),
                     total_price: float = Form(...),
                     authenticated=Depends(isAuthenticated)):

    if not authenticated:
        raise HTTPException(status_code=401, detail="Not Allowed")

    orders = json.loads(orders)

    order_data = {
        "id": id,
        "name": name,
        "date": date,
        "orders": orders,
        "total_quantity": total_quantity,
        "total_price": total_price,
    }

    order = Order(**order_data)

    result = Orders.editOrder(order)

    return {
        "success": result,
        "message": "" if result else "Unsuccessful!"
    }


@api_router.get("/orders/all", response_class=JSONResponse)
async def fecth_all_orders(request: Request, authenticated=Depends(isAuthenticated)):
    if not authenticated:
        raise HTTPException(status_code=401, detail="Not Allowed")

    return Orders.fetchAll()


@api_router.post("/orders/{order_id}", response_class=JSONResponse)
async def get_order(request: Request, order_id: str, authenticated=Depends(isAuthenticated)):

    if not authenticated:
        raise HTTPException(status_code=401, detail="Not Allowed")

    return Orders.getOrderByID(order_id)


@api_router.post("/orders/delete/{order_id}", response_class=JSONResponse)
async def delete_order(request: Request, order_id: str, authenticated=Depends(isAuthenticated)):

    if not authenticated:
        raise HTTPException(status_code=401, detail="Not Allowed")

    try:
        Orders.deleteOrderByID(order_id)
    except Exception as e:
        return {
            "success": False,
            "message": e
        }

    return {
        "success": True,
        "message": "Delete Successful!"
    }


@api_router.get("/database/status", response_class=StreamingResponse)
async def fetch_db_status(request: Request, authenticated=Depends(isAuthenticated)):

    def db_changed():
        while True:
            yield f"event: databaseStatus\ndata: {json.dumps(database.db_status)}\n\n"

            time.sleep(0.3)

    return StreamingResponse(db_changed(), media_type="text/event-stream")


@api_router.get("/dashboard/stats", response_class=StreamingResponse)
async def fetch_dashboard_stats(request: Request, authenticated=Depends(isAuthenticated)):

    if not authenticated:
        raise HTTPException(status_code=401, detail="Not Allowed")

    def dashboard_stats():

        while True:

            data = {}
            data["products"] = Products.getProductCount()
            data["orders"] = Orders.getOrderCount()
            data["profits"] = Orders.getTotalProfits()

            yield f"event: dashboardStats\ndata: {json.dumps(data)}\n\n"

            time.sleep(1)

    return StreamingResponse(dashboard_stats(), media_type="text/event-stream")
