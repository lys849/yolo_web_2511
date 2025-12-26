"""
YOLO 模型加载和管理模块
提供统一的模型加载接口和推理功能
"""

import os
from pathlib import Path
from typing import Optional, Dict, List
from ultralytics import YOLO


class ModelLoader:
    """YOLO 模型加载器和管理类"""

    def __init__(self, model_dir: Optional[str] = None, model_name: str = "best.pt"):
        """
        初始化模型加载器

        Args:
            model_dir: 模型存储目录，默认为当前模块所在目录的 'weights'
            model_name: 模型文件名，默认为 'best.pt'
        """
        if model_dir is None:
            # 默认模型目录：project/model/weights/
            model_dir = os.path.join(os.path.dirname(__file__), "weights")

        self.model_dir = Path(model_dir)
        self.model_name = model_name
        self.model_path = self.model_dir / model_name
        self.model = None

        # 确保模型目录存在
        self.model_dir.mkdir(parents=True, exist_ok=True)

    def load_model(self, use_pretrained: bool = True) -> YOLO:
        """
        加载 YOLO 模型

        Args:
            use_pretrained: 若本地模型不存在，是否下载预训练模型

        Returns:
            YOLO 模型对象

        Raises:
            FileNotFoundError: 若模型不存在且 use_pretrained=False
        """
        if self.model is not None:
            return self.model

        # 检查本地模型是否存在
        if self.model_path.exists():
            print(f"✓ 加载本地模型: {self.model_path}")
            self.model = YOLO(str(self.model_path))
            return self.model

        # 模型不存在
        if not use_pretrained:
            raise FileNotFoundError(
                f"模型文件不存在: {self.model_path}\n"
                f"请将模型文件放在: {self.model_dir}/ 目录下"
            )

        # 下载预训练模型
        print(f"⬇ 本地模型不存在，下载预训练模型...")
        pretrained_model = YOLO("yolo11n.pt")
        pretrained_model.save(str(self.model_path))
        print(f"✓ 预训练模型已保存到: {self.model_path}")

        self.model = pretrained_model
        return self.model

    def predict(self, image_input, **kwargs):
        """
        执行模型推理

        Args:
            image_input: 图片输入（文件路径、PIL Image 或 numpy array）
            **kwargs: 传递给模型的其他参数

        Returns:
            YOLO 推理结果
        """
        if self.model is None:
            self.load_model()

        return self.model(image_input, **kwargs)

    def get_model_info(self) -> Dict:
        """获取模型信息"""
        if self.model is None:
            self.load_model()

        return {
            "model_path": str(self.model_path),
            "model_exists": self.model_path.exists(),
            "model_size": (
                self.model_path.stat().st_size if self.model_path.exists() else 0
            ),
            "class_names": self.model.names,
            "num_classes": len(self.model.names),
        }


# 全局模型加载器实例（单例模式，避免重复加载）
_model_loader: Optional[ModelLoader] = None


def get_model(model_dir: Optional[str] = None, model_name: str = "best.pt") -> YOLO:
    """
    获取全局模型实例（推荐使用此函数）

    Args:
        model_dir: 模型存储目录
        model_name: 模型文件名

    Returns:
        YOLO 模型对象
    """
    global _model_loader

    if _model_loader is None:
        _model_loader = ModelLoader(model_dir, model_name)

    return _model_loader.load_model()


def get_model_loader(
    model_dir: Optional[str] = None, model_name: str = "best.pt"
) -> ModelLoader:
    """
    获取模型加载器实例

    Args:
        model_dir: 模型存储目录
        model_name: 模型文件名

    Returns:
        ModelLoader 实例
    """
    global _model_loader

    if _model_loader is None:
        _model_loader = ModelLoader(model_dir, model_name)

    return _model_loader
