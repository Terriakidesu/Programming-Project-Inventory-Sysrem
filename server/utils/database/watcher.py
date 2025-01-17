import time
import logging

from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

from . import db_status, PATH


class FileChangeHandler(FileSystemEventHandler):
    """
    Watches the file for changes
    """

    def on_modified(self, event):
        db_status["changed"] = True

        return super().on_modified(event)


def watch_database_file():
    """
    Creates a watcher for the database file
    """
    event_handler = FileChangeHandler()

    observer = Observer()

    observer.schedule(event_handler, path=PATH, recursive=False)
    observer.start()

    logging.info("Observer started")

    try:
        while True:
            time.sleep(1)

            db_status["changed"] = False

    except KeyboardInterrupt:
        observer.stop()
    observer.join()
