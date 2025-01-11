from pydantic import BaseModel
from datetime import datetime


class SessionData(BaseModel):
    authenticated: bool
    created_at: datetime
    refreshed_at: datetime
    expires_at: datetime
