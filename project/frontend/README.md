# React + TypeScript + Vite
# 前端（project/frontend）说明

本 README 说明前端代码在本项目中如何与后端交互、关键组件职责以及如何在本地运行和调试。

目录概览（重要文件）：

- `project/frontend/package.json`：前端依赖与脚本（`npm run dev` 启动开发服务器）。
- `project/frontend/src/api/client.js`：封装与后端通信的接口，用于发送 `/predict/` 请求并处理返回。
- `project/frontend/src/components/UploadArea.jsx`：图片/视频上传组件，负责构造 `FormData` 并触发上传。
- `project/frontend/src/components/ResultView.jsx`：展示检测结果（检测列表、结果图像）。
- `project/frontend/src/pages/ImageDetect.jsx`：页面级组件，组合上传与结果展示。

主要工作流（简述，适合写入报告）：

1. 用户在 UI 中选择图片或视频。
2. `UploadArea` 将文件放入 `FormData`，调用 `client.js` 中的 POST 接口发送到 `/predict/`（或 `/predict/video`）。
3. 后端返回 JSON，包含 `detections`（类别、置信度、bbox）和 `result_img`（静态 URL，例如 `/static/results/xxx.jpg`）。
4. `ResultView` 渲染检测列表并把 `result_img` 作为 `<img>` 的 `src` 显示。

运行与调试

```bash
cd project/frontend
npm install
npm run dev
```

注意事项

- 开发时请确保后端服务已启动并可被前端访问（同机开发默认 `http://localhost:8000`）。
- 若前端配置了 `window.SERVER_IP` 或类似全局变量，请确保其指向后端基础 URL（例如 `http://127.0.0.1:8000`）。
- 前端组件依赖 `result_img` 返回 `/static/...` 路径；后端必须挂载静态目录（例如 FastAPI 的 `app.mount('/static', StaticFiles(...))`）。

建议在报告中引用的前端内容

- 上传和展示流程图（一张图表示交互步骤）。
- 关键组件的代码片段（`UploadArea` 如何构造 `FormData`、`client.js` 中如何处理响应）。

若需要，我可以额外提取 `UploadArea.jsx` 与 `ResultView.jsx` 的关键代码片段并嵌入到报告中。
