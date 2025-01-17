"""

Functions for FastAPI's `Depends()`

"""

from datetime import datetime, timezone, timedelta

from fastapi import Request
from fastapi.exceptions import HTTPException

from .models import SessionData
from ...utils import Settings


def sessionRefresh(request: Request):
    """
    Refreshes the session timeout
    """

    expires_at = request.session.get("expires_at")
    if not expires_at:
        return False

    session_end_time = datetime.fromisoformat(expires_at)

    now = datetime.now(timezone.utc)

    if now >= session_end_time:
        request.session.clear()
        return False
    else:
        request.session["refreshed_at"] = now.isoformat()
        extended_time = now + \
            timedelta(seconds=Settings.Cookie.max_age)
        request.session["expires_at"] = extended_time.isoformat()

    return True


def getCurrentSession(request: Request):
    """
    Gets the current user's session
    """

    session = request.session

    if "authenticated" not in session or not session["authenticated"]:
        raise HTTPException(status_code=401, detail="Unauthorized")

    if not sessionRefresh(request):
        raise HTTPException(status_code=401, detail="Unauthorized")

    return SessionData(**request.session)


def isAuthenticated(request: Request) -> bool:
    """
    Checks if user is authenticated.
    """
    session = request.session

    if "authenticated" not in session or not session["authenticated"]:
        return False

    return sessionRefresh(request)


def isAuthenticatedNoRefresh(request: Request) -> bool:
    """
    Checks if user is authenticated but it doesn't refresh the session timeout.
    """
    session = request.session

    if "authenticated" not in session or not session["authenticated"]:
        return False

    return True
