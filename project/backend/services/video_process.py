# backend/services/video_process.py

import cv2
import os
import uuid

from project.backend.services.yolo import get_yolo_model
from project.model.model_loader import get_model

def process_video(
    input_path: str,
    output_dir: str,
    task_id: str,
    task_store: dict
):
    """
    后台视频检测任务
    """
    try:
        model = get_yolo_model()
        # model = get_model()

        cap = cv2.VideoCapture(input_path)
        if not cap.isOpened():
            raise RuntimeError("Cannot open video file")

        fps = cap.get(cv2.CAP_PROP_FPS)
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

        os.makedirs(output_dir, exist_ok=True)
        output_filename = f"{uuid.uuid4().hex}.mp4"
        output_path = os.path.join(output_dir, output_filename)

        fourcc = cv2.VideoWriter_fourcc(*"avc1")
        writer = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

        font_scale = min(width, height) * 0.001 
        thickness = max(int(font_scale * 2), 1)

        while True:
            ret, frame = cap.read()
            if not ret:
                break

            results = model(frame)

            # for box in results[0].boxes:
            #     x1, y1, x2, y2 = map(int, box.xyxy[0])
            #     label = f"{model.names[int(box.cls)]} {float(box.conf):.2f}"

            #     # 2. 画框
            #     cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), thickness)

            #     # 3. 动态调整文字位置 (防止文字超出画面顶部)
            #     text_y = y1 - 10 if y1 - 10 > 10 else y1 + 20

            #     # 4. 绘制文字
            #     cv2.putText(
            #         frame,
            #         label,
            #         (x1, text_y),
            #         cv2.FONT_HERSHEY_SIMPLEX,
            #         font_scale,    # 动态大小
            #         (0, 255, 0),
            #         thickness,     # 动态粗细
            #     )
            
            # results[0].plot() 会返回一个画好了框和标签的 numpy 数组 (BGR)
            # line_width 参数可以控制框的粗细，字体会自动随之缩放
            annotated_frame = results[0].plot(line_width=3)

            writer.write(annotated_frame)

        cap.release()
        writer.release()

        task_store[task_id]["status"] = "done"
        task_store[task_id]["result"] = f"/static/results/video/{output_filename}"

    except Exception as e:
        task_store[task_id]["status"] = "error"
        task_store[task_id]["error"] = str(e)