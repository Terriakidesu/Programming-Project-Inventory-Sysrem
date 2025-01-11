from datetime import datetime, timezone, timedelta

from fastapi import APIRouter, Request, Form, Depends
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.exceptions import HTTPException
from fastapi.templating import Jinja2Templates

from .models import SessionData
from ...utils import Settings, Password

templates = Jinja2Templates(directory="public/views")

auth_router = APIRouter()


def getCurrentSession(request: Request):
    session = request.session

    if "authenticated" not in session or not session["authenticated"]:
        raise HTTPException(status_code=401, detail="Unauthorized")

    refreshed_at = session.get("refreshed_at")
    expires_at = session.get("expires_at")
    if not expires_at:
        raise HTTPException(status_code=401, detail="Session expired")

    session_end_time = datetime.fromisoformat(expires_at)
    session_refresh_at = datetime.fromisoformat(refreshed_at)

    now = datetime.now(timezone.utc)

    if now >= session_end_time:
        request.session.clear()
        raise HTTPException(status_code=401, detail="Session expired")
    else:
        request.session["refreshed_at"] = now.isoformat()
        extended_time = now + \
            timedelta(seconds=Settings.Cookie.max_age)
        request.session["expires_at"] = extended_time.isoformat()

    return SessionData(**request.session)


# @auth_router.get("/")
# async def home(request: Request, session: SessionData = Depends(getCurrentSession)):
#     return templates.TemplateResponse("index.html", {"request": request})


@auth_router.get("/login")
async def login(request: Request):
    session = request.session
    if "authenticated" not in session or not session["authenticated"]:
        return templates.TemplateResponse("login.html", {"request": request, "authenticated": request.session.get("authenticated", False)})

    return RedirectResponse("/", status_code=302)


@auth_router.post("/auth")
async def auth(request: Request, password: str = Form(...)):

    if request.session.get("authenticated"):
        return JSONResponse({
            "success": True,
            "message": "Already Authenticated"
        })

    if not Password.verify_password(password):
        return JSONResponse({
            "success": False,
            "message": "Invalid Password"
        })

    now = datetime.now(timezone.utc)

    request.session["authenticated"] = True
    request.session["created_at"] = now.isoformat()
    request.session["refreshed_at"] = now.isoformat()
    expires_at = now + timedelta(seconds=Settings.Cookie.max_age)
    request.session["expires_at"] = expires_at.isoformat()

    return JSONResponse({
        "success": True,
        "message": "Authentication Successful"
    })


@auth_router.get("/session", response_class=JSONResponse)
async def checkSession(request: Request):

    if not request.session.get("authenticated"):
        return {
            "authenticated": False
        }

    data = request.session.copy()

    expires_at = datetime.fromisoformat(data["expires_at"])
    now = datetime.now(timezone.utc)

    data["time_left"] = expires_at - now

    return data


@auth_router.post("/logout")
async def logout(request: Request, session: SessionData = Depends(getCurrentSession)):

    if session.authenticated:
        request.session.clear()

        return RedirectResponse("/login", status_code=302)
