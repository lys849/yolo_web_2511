from ultralytics import YOLO

# Load a model
model = YOLO("yolo11n-cls.pt")  # load a pretrained model (recommended for training)

# Train the model
results = model.train(data="mnist160", epochs=100, imgsz=64)

metrics = model.val() 
metrics.top1  
metrics.top5 