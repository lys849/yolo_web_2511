# backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from project.backend.api.image import router as image_router
from project.backend.api.video import router as video_router

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


