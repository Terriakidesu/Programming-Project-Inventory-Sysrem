
from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.middleware.sessions import SessionMiddleware

from .utils import Settings
from .utils.database import search
from .routes.auth import auth_router
from .routes.beverages import beverage_router

app = FastAPI()

app.add_middleware(
    SessionMiddleware,
    secret_key=Settings.Secrets.secret_key,
    max_age=Settings.Cookie.max_age
)

app.include_router(auth_router)
app.include_router(beverage_router)

app.mount("/public/static", StaticFiles(directory="public/static"), name="static")
templates = Jinja2Templates(directory="public/views")


@app.get("/")
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.exception_handler(401)
async def unauthorizedRedirect(request: Request, exception):
    return RedirectResponse("/login")
