
from fastapi import FastAPI, Request, Depends
from fastapi.responses import RedirectResponse
from fastapi.exceptions import HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.middleware.sessions import SessionMiddleware

from .utils import Settings
from .routes.auth import auth_router
from .routes.auth.dependencies import isAuthenticated
from .routes.api import api_router
from .utils.account import Account_Manager

app = FastAPI()

app.add_middleware(
    SessionMiddleware,
    secret_key=Settings.Secrets.secret_key,
    max_age=Settings.Cookie.max_age
)

app.include_router(auth_router)
app.include_router(api_router)

app.mount("/public/static", StaticFiles(directory="public/static"), name="static")
templates = Jinja2Templates(directory="public/views")


@app.get("/")
async def root(request: Request):

    if Account_Manager.account_exists:
        if "authenticated" in request.session or request.get("authenticated"):
            return RedirectResponse("/dashboard")
        return RedirectResponse("/login")

    return RedirectResponse("/signup")


@app.get("/dashboard")
async def dashboard(request: Request, authenticated=Depends(isAuthenticated)):

    if not authenticated:
        raise HTTPException(status_code=401, detail="Not Allowed")

    return templates.TemplateResponse("dashboard.html", {"request": request})


@app.get("/inventory")
async def inventory(request: Request, authenticated=Depends(isAuthenticated)):

    if not authenticated:
        raise HTTPException(status_code=401, detail="Not Allowed")

    return templates.TemplateResponse("inventory.html", {"request": request})


@app.get("/orders")
async def inventory(request: Request, authenticated=Depends(isAuthenticated)):

    if not authenticated:
        raise HTTPException(status_code=401, detail="Not Allowed")

    return templates.TemplateResponse("orders.html", {"request": request})


@app.get("/settings")
async def settings(request: Request, authenticated=Depends(isAuthenticated)):
    if not authenticated:
        raise HTTPException(status_code=401, detail="Not Allowed")

    return templates.TemplateResponse("settings.html", {"request": request})


@app.get("/login")
async def loginPage(request: Request):
    if not Account_Manager.account_exists:
        return RedirectResponse("/signup")

    session = request.session

    if "authenticated" not in session or not session["authenticated"]:
        return templates.TemplateResponse("login.html", {"request": request})

    return RedirectResponse("/", status_code=302)


@app.get("/signup")
async def signupPage(request: Request):
    session = request.session

    if Account_Manager.account_exists:
        return RedirectResponse("/login")

    if "authenticated" not in session or not session["authenticated"]:
        return templates.TemplateResponse("signup.html", {"request": request})

    return RedirectResponse("/", status_code=302)


@app.get("/easter-egg")
async def easterEgg(request: Request):
    return templates.TemplateResponse("easter-egg.html", {"request": request})


@app.exception_handler(401)
async def unauthorizedRedirect(request: Request, exception):
    return RedirectResponse("/login")
