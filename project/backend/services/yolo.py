# backend/services/yolo.py

from project.model.model_loader import get_model

_model = None

def get_yolo_model():
    """
    全局单例 YOLO 模型
    """
    global _model
    if _model is None:
        _model = get_model()
    return _model

