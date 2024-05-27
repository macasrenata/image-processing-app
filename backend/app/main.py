from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from sqlalchemy import create_engine, Column, Integer, String, LargeBinary
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from PIL import Image, ImageEnhance, ImageOps
import io
import os
import base64

DATABASE_URL = "postgresql://postgres:password@localhost/image_processing_db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

app = FastAPI()

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
    return FileResponse(io.BytesIO(db_image.content), media_type="image/jpeg")

@app.post("/process")
async def process_image(image_id: int, operation: str, background_tasks: BackgroundTasks):
    db = SessionLocal()
    db_image = db.query(ImageModel).filter(ImageModel.id == image_id).first()
    if not db_image:
        raise HTTPException(status_code=404, detail="Image not found")
    
    image = Image.open(io.BytesIO(db_image.content))

    def save_processed_image(processed_image):
        buffer = io.BytesIO()
        processed_image.save(buffer, format="JPEG")
        db_image.content = buffer.getvalue()
        db.commit()
        db.refresh(db_image)
        db.close()
        return db_image.content

    if operation == 'rotate_90':
        image = image.rotate(90, expand=True)
    elif operation == 'rotate_180':
        image = image.rotate(180, expand=True)
    elif operation == 'flip_horizontal':
        image = ImageOps.mirror(image)
    elif operation == 'flip_vertical':
        image = ImageOps.flip(image)
    elif operation == 'increase_contrast':
        enhancer = ImageEnhance.Contrast(image)
        image = enhancer.enhance(1.5)
    elif operation == 'decrease_contrast':
        enhancer = ImageEnhance.Contrast(image)
        image = enhancer.enhance(0.5)
    elif operation == 'increase_brightness':
        enhancer = ImageEnhance.Brightness(image)
        image = enhancer.enhance(1.5)
    elif operation == 'decrease_brightness':
        enhancer = ImageEnhance.Brightness(image)
        image = enhancer.enhance(0.5)
    else:
        raise HTTPException(status_code=400, detail="Invalid operation")

    background_tasks.add_task(save_processed_image, image)

    buffer = io.BytesIO()
    image.save(buffer, format="JPEG")
    encoded_image = base64.b64encode(buffer.getvalue()).decode('utf-8')

    return {"data": encoded_image}
