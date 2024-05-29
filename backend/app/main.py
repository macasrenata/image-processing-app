from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy import create_engine, Column, Integer, String, LargeBinary
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import io
import os
import base64
import cv2
import numpy as np

DATABASE_URL = "postgresql://postgres:password@localhost/image_processing_db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

app = FastAPI()

# CORS middleware configuration
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ImageModel(Base):
    __tablename__ = "images"
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    content = Column(LargeBinary)

Base.metadata.create_all(bind=engine)

@app.post("/upload/")
async def upload_image(file: UploadFile = File(...)):
    contents = await file.read()
    db = SessionLocal()
    db_image = ImageModel(filename=file.filename, content=contents)
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    db.close()
    return {"filename": file.filename, "id": db_image.id}

@app.get("/image/{image_id}")
def get_image(image_id: int):
    db = SessionLocal()
    db_image = db.query(ImageModel).filter(ImageModel.id == image_id).first()
    db.close()
    if db_image is None:
        raise HTTPException(status_code=404, detail="Image not found")
    # return FileResponse(io.BytesIO(db_image.content), media_type="image/jpeg")
    return FileResponse(io.BytesIO(db_image.content).getvalue(), media_type="image/jpeg")


@app.post("/process")
async def process_image(image_id: int, operation: str, background_tasks: BackgroundTasks):
    db = SessionLocal()
    db_image = db.query(ImageModel).filter(ImageModel.id == image_id).first()
    if not db_image:
        raise HTTPException(status_code=404, detail="Image not found")
    
    image_np = np.frombuffer(db_image.content, np.uint8)
    image = cv2.imdecode(image_np, cv2.IMREAD_COLOR)

    def save_processed_image(processed_image):
        _, buffer = cv2.imencode('.jpg', processed_image)
        db_image.content = buffer.tobytes()
        db.commit()
        db.refresh(db_image)
        db.close()
        return db_image.content

    if operation == 'rotate_90':
        image = cv2.rotate(image, cv2.ROTATE_90_CLOCKWISE)
    elif operation == 'rotate_180':
        image = cv2.rotate(image, cv2.ROTATE_180)
    elif operation == 'flip_horizontal':
        image = cv2.flip(image, 1)
    elif operation == 'flip_vertical':
        image = cv2.flip(image, 0)
    elif operation == 'increase_contrast':
        lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
        cl = clahe.apply(l)
        limg = cv2.merge((cl,a,b))
        image = cv2.cvtColor(limg, cv2.COLOR_LAB2BGR)
    elif operation == 'decrease_contrast':
        alpha = 0.5  # Simple contrast control
        image = cv2.convertScaleAbs(image, alpha=alpha, beta=0)
    elif operation == 'increase_brightness':
        beta = 50  # Simple brightness control
        image = cv2.convertScaleAbs(image, beta=beta)
    elif operation == 'decrease_brightness':
        beta = -50  # Simple brightness control
        image = cv2.convertScaleAbs(image, beta=beta)
    else:
        raise HTTPException(status_code=400, detail="Invalid operation")

    background_tasks.add_task(save_processed_image, image)

    _, buffer = cv2.imencode('.jpg', image)
    encoded_image = base64.b64encode(buffer).decode('utf-8')

    return {"data": encoded_image}

