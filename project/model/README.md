# YOLO 模型管理模块

## 目录结构

```
project/model/
├── __init__.py           # 模块初始化文件
├── model_loader.py       # 模型加载器实现
├── weights/              # 模型权重文件目录（自动创建）
│   └── best.pt          # 你的训练模型或预训练模型
└── README.md            # 本文件
```

## 使用方式

### 方式 1：在 FastAPI 应用中使用（推荐）

```python
from project.model import get_model

# 获取模型（第一次加载时初始化，后续调用返回同一实例）
model = get_model()

# 执行推理
results = model(image)

# 访问推理结果
for box in results[0].boxes:
    print(f"类别: {model.names[int(box.cls)]}")
    print(f"置信度: {float(box.conf)}")
    print(f"边界框: {box.xyxy[0].tolist()}")
```

### 方式 2：直接使用 ModelLoader 类

```python
from project.model.model_loader import ModelLoader

# 创建加载器实例
loader = ModelLoader(model_dir="./project/model/weights", model_name="best.pt")

# 加载模型
model = loader.load_model(use_pretrained=True)

# 执行推理
results = loader.predict(image)

# 获取模型信息
info = loader.get_model_info()
print(info)
```

## 模型文件放置

### 选项 A：使用本地训练的模型

1. 将你训练好的模型文件 `best.pt` 放在 `project/model/weights/` 目录下
2. 代码会自动加载该模型

```bash
# 示例命令
cp /path/to/your/best.pt ./project/model/weights/
```

### 选项 B：自动下载预训练模型

如果 `project/model/weights/best.pt` 不存在，模块会自动：
1. 下载 YOLOv8 nano 预训练模型
2. 保存到 `project/model/weights/best.pt`
3. 后续使用该模型进行推理

## 功能特性

### ModelLoader 类

| 方法 | 说明 |
|------|------|
| `load_model()` | 加载模型，支持自动下载预训练模型 |
| `predict()` | 执行模型推理 |
| `get_model_info()` | 获取模型信息（类别数、模型路径等） |

### 全局函数

| 函数 | 说明 |
|------|------|
| `get_model()` | 获取全局模型实例（单例模式，推荐使用） |
| `get_model_loader()` | 获取 ModelLoader 实例 |

## 环境变量配置（可选）

```bash
# 可以通过环境变量控制 YOLO 模型缓存目录
export YOLO_HOME=/custom/path/to/yolo/cache
python -m uvicorn project.backward.app:app --reload
```

## 启动 FastAPI 应用

```bash
# 从项目根目录启动
cd /Users/shen/shen_project/yolo_web_2511

# 方式 1：使用 uvicorn 直接启动
python -m uvicorn project.backward.app:app --reload

# 方式 2：使用 python 模块运行
python -m project.backward.app
```

## 常见问题

### Q: 模型文件太大，不想保存到项目目录？
**A:** 可以在调用时指定自定义目录：
```python
from project.model import get_model
model = get_model(model_dir="/Users/shen/models")
```

### Q: 如何更换模型？
**A:** 替换 `project/model/weights/best.pt` 文件，重新启动应用即可。

### Q: 如何使用不同的预训练模型（如 yolov8m, yolov8l）？
**A:** 修改 `model_loader.py` 中 `load_model()` 方法的模型名称：
```python
pretrained_model = YOLO("yolov8m.pt")  # 改为 medium 版本
```

## 性能优化

- **单例模式**：模型只加载一次，提高应用性能
- **懒加载**：模型在第一次使用时才加载，加快应用启动速度
- **缓存机制**：已加载的模型会缓存在内存中，避免重复加载
