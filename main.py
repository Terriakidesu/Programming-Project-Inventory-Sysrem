import os
import uvicorn
import logging

if __name__ == "__main__":

    port = os.getenv("PORT") or 8000
    uvicorn.run("server.server:app", host="0.0.0.0", port=port, reload=True)

    logging.getLogger("uvicorn.error")
