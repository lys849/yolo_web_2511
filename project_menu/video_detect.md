[ Browser ]
    |
    |  POST /predict/video
    |  multipart/form-data
    v
[ FastAPI ]
    |
    |  OpenCV / ffmpeg 解码
    |  YOLO 推理 + 画框
    |  编码为 mp4
    v
[ static/results/*.mp4 ]
    |
    v
[ Browser <video src=...> ]

前端设计：
VideoDetect 页面
├── 标题
├── 上传视频
├── 推理中提示（loading）
├── 推理完成 → <video controls />
└── 返回首页 / 切换模式

idle
  │  用户选择视频 + 点击开始
  ▼
uploading
  │  上传成功
  ▼
processing
  │  推理完成
  ▼
done

任何阶段
  │  发生异常
  ▼
error


后端设计
API：POST /predict/video
return：
{
  "result_video": "/static/results/xxxx.mp4"
}

backend/
├── main.py                # FastAPI 启动
├── api/
│   ├── image.py           # 图片推理接口
│   └── video.py           # 视频推理接口（新增）
├── services/
│   ├── yolo.py            # 模型加载（共享）
│   ├── video_process.py   # 视频处理逻辑
├── static/
│   └── results/
│       ├── xxx.jpg
│       └── xxx.mp4
└── temp/
    └── uploads/
