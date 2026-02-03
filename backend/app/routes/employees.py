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
        raise HTTPException(status_code=409, detail="Employee with this ID or email already exists")

    emp = models.Employee(**data.dict())
    db.add(emp)
    db.commit()
    db.refresh(emp)
    return {
        "id": str(emp.id),
        "employee_id": emp.employee_id,
        "full_name": emp.full_name,
        "email": emp.email,
        "department": emp.department
    }

@router.get("")
def list_employees(db: Session = Depends(get_db)):
    employees = db.query(models.Employee).all()
    return [
        {
            "id": str(emp.id),
            "employee_id": emp.employee_id,
            "full_name": emp.full_name,
            "email": emp.email,
            "department": emp.department
        }
        for emp in employees
    ]

@router.get("/{employee_id}")
def get_employee(employee_id: str, db: Session = Depends(get_db)):
    emp = db.query(models.Employee).filter(
        models.Employee.employee_id == employee_id
    ).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    return {
        "id": str(emp.id),
        "employee_id": emp.employee_id,
        "full_name": emp.full_name,
        "email": emp.email,
        "department": emp.department
    }

@router.delete("/{employee_id}")
def delete_employee(employee_id: str, db: Session = Depends(get_db)):
    emp = db.query(models.Employee).filter(
        models.Employee.employee_id == employee_id
    ).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    # Delete associated attendance records
    db.query(models.Attendance).filter_by(employee_id=emp.id).delete()
    db.delete(emp)
    db.commit()
    return {"message": "Employee deleted successfully"}
