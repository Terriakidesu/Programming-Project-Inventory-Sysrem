from typing import Annotated

from datetime import datetime, timezone, timedelta

from fastapi import APIRouter, Request, Form, Depends
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.templating import Jinja2Templates

from .models import SessionData
from .dependencies import getCurrentSession

from ...utils import Settings
from ...utils.account import Account_Manager
from ...utils.account.models import Account

templates = Jinja2Templates(directory="public/views")

auth_router = APIRouter(prefix="/auth")


@auth_router.post("/login")
async def auth_login(request: Request, account: Annotated[Account, Form()]):
    """
    Authentication route for logging in.
    """

    # Check if user is already logged in.
    if request.session.get("authenticated"):
        return JSONResponse({
            "success": True,
            "message": "Already Authenticated"
        })

    # Check if username and password is correct
    if not Account_Manager.verify_auth(account):
        return JSONResponse({
            "success": False,
            "message": "Invalid Username or Password."
        })

    now = datetime.now(timezone.utc)

    # Create the neccessary data for the user's session
    request.session["authenticated"] = True
    request.session["created_at"] = now.isoformat()
    request.session["refreshed_at"] = now.isoformat()
    expires_at = now + timedelta(seconds=Settings.Cookie.max_age)
    request.session["expires_at"] = expires_at.isoformat()

    return JSONResponse({
        "success": True,
        "message": "Authentication Successful"
    })


@auth_router.post("/signup")
async def auth_signup(request: Request, account: Annotated[Account, Form()]):
    """
    Authentication route for signing in.
    """

    now = datetime.now(timezone.utc)

    # Create the neccessary data for the user's session
    request.session["authenticated"] = True
    request.session["created_at"] = now.isoformat()
    request.session["refreshed_at"] = now.isoformat()
    expires_at = now + timedelta(seconds=Settings.Cookie.max_age)
    request.session["expires_at"] = expires_at.isoformat()

    try:
        # Save the account
        Account_Manager.save_account(account)
        return {
            "success": True,
            "message": "Singup Success!"
        }
    except Exception:
        pass

    return {
        "success": False,
        "message": "Singup Failed!"
    }


@auth_router.get("/session", response_class=JSONResponse)
async def check_session(request: Request):
    """
    Authentication route for checking the session.
    """

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
async def auth_logout(request: Request, session: SessionData = Depends(getCurrentSession)):
    """
    Authentication route for logging out.
    """

    if session.authenticated:
        # clear the session data
        request.session.clear()

        # redirect to the login page
        return RedirectResponse("/login", status_code=302)
