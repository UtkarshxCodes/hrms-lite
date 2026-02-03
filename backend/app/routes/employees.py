from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import SessionLocal
from .. import models, schemas

router = APIRouter(prefix="/employees", tags=["Employees"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("", status_code=201)
def create_employee(data: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    exists = db.query(models.Employee).filter(
        (models.Employee.email == data.email) |
        (models.Employee.employee_id == data.employee_id)
    ).first()

    if exists:
        raise HTTPException(status_code=409, detail="Employee already exists")

    emp = models.Employee(**data.dict())
    db.add(emp)
    db.commit()
    return emp

@router.get("")
def list_employees(db: Session = Depends(get_db)):
    return db.query(models.Employee).all()

@router.delete("/{id}")
def delete_employee(id: str, db: Session = Depends(get_db)):
    emp = db.query(models.Employee).filter(models.Employee.id == id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    db.delete(emp)
    db.commit()
    return {"message": "Employee deleted"}
