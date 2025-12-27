# backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from project.backend.api.image import router as image_router
from project.backend.api.video import router as video_router
from project.backend.utils.cleanup import cleanup_old_files

app = FastAPI(title="YOLO Detection API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 静态文件（图片 / 视频结果）
app.mount(
    "/static",
    StaticFiles(directory="./project/backend/static"),
    name="static"
)

# 路由注册
app.include_router(image_router)
app.include_router(video_router)

@app.get("/")
def read_root():
    return {"message": "YOLO detection API running."}

@app.on_event("startup")
def startup_cleanup():
    paths=["./project/backend/static/results/video",
            "./project/backend/static/results/img",
            "./project/backend/temp/uploads"]
    for path in paths:
        cleanup_old_files(
            directory=path,
            max_age_seconds=24 * 3600
        )