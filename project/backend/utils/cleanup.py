import os
import time

def cleanup_old_files(
    directory: str,
    max_age_seconds: int
):
    now = time.time()

    for filename in os.listdir(directory):
        path = os.path.join(directory, filename)
        if not os.path.isfile(path):
            continue

        mtime = os.path.getmtime(path)
        if now - mtime > max_age_seconds:
            os.remove(path)
