# 后端（project/backend）说明

本 README 说明后端目录中的代码组织、关键路由与服务职责，以及如何本地运行与测试后端服务，便于撰写技术报告或给其他开发者查看。

## 目录概览（重要文件）

- `project/backend/app.py` 或 `project/backward/app.py`：应用启动入口（注意：项目中有两个变体，报告中可说明以实际使用的为准；之前有要求忽略 `backward/app.py` 的特定内容）。
- `project/backend/api/image.py`：图片推理相关路由（接收上传图片，调用模型推理，返回检测 JSON 与静态图片 URL）。
- `project/backend/api/video.py`：视频上传与处理路由（若实现，负责接收视频并触发逐帧推理）。
- `project/backend/services/yolo.py`：模型调用服务，负责将 ultralytics 返回的 `results` 解析为 JSON 友好的结构。
- `project/backend/services/video_process.py`：视频处理逻辑，逐帧调用 yolo 服务并合成输出。
- `project/static/`：静态资源目录（由后端挂载），保存的推理结果图像会放在 `project/static/results/` 下。

## 后端主要职责与调用流程

1. 路由接收文件上传（`UploadFile`），将文件以字节读取到内存（`await file.read()`）。
2. 使用 `PIL.Image.open(io.BytesIO(bytes))` 将图片在内存中解析为 `PIL.Image` 对象。
3. 通过 `project/model` 提供的 `get_model()` 获取模型并执行推理。
4. 将带框的结果保存为图片到 `project/static/results/`，返回 JSON：

```json
{ "detections": [...], "result_img": "/static/results/xxx.jpg" }
```

## 错误处理与响应约定

- 推理或模型加载异常应返回 HTTP 500，并在响应中包含 `error` 字段以便前端与日志定位。
- 输入校验：应检查上传文件类型（image/*、video/*）并在文件类型不匹配时返回 HTTP 400。

## 启动（示例）

```bash
# 从项目根目录运行
python -m uvicorn project.backward.app:app --reload
```

或根据项目实际入口调整模块路径。

## 本地测试示例

```bash
curl -X POST "http://127.0.0.1:8000/predict/" -F "file=@/path/to/test.jpg"
```

期望返回包含 `detections` 与 `result_img` 字段的 JSON。

## 日志与调试建议

- 在开发环境打印或记录模型加载路径、推理耗时与异常堆栈信息以便诊断。
- 对视频处理任务，建议在小样本上先用单帧测试，再扩展到整段视频处理以避免长时间占用计算资源。

## 建议写入报告的要点

- 描述路由接口与请求/响应示例。
- 说明服务拆分（路由层 vs service 层）带来的好处（可测试、可复用）。
- 列出依赖项（`ultralytics`, `fastapi`, `uvicorn`, `pillow` 等）与运行环境（Python 版本、是否需要 GPU）。

---

如需，我可以根据 `project/backend/api/image.py` 与 `project/backend/services/yolo.py` 的具体实现，提取代码片段并把示例填入 README 或报告中。
