import os
import uvicorn
import logging
import threading

from server.utils.database.watcher import watch_database_file


def main():

    port = os.getenv("PORT") or 8000
    uvicorn.run("server.server:app", host="0.0.0.0", port=port)

    logging.getLogger("uvicorn.error")


if __name__ == "__main__":

    threading.Thread(target=watch_database_file, daemon=True).start()

    main()
