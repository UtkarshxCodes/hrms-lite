from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import SessionLocal
from .. import models, schemas

router = APIRouter(prefix="/attendance", tags=["Attendance"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("", status_code=201)
def mark_attendance(data: schemas.AttendanceCreate, db: Session = Depends(get_db)):
    employee = db.query(models.Employee).filter(
        models.Employee.employee_id == data.employee_id
    ).first()

    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    already = db.query(models.Attendance).filter_by(
        employee_id=employee.id,
        date=data.date
    ).first()

    if already:
        raise HTTPException(status_code=409, detail="Attendance already marked")

    att = models.Attendance(
        employee_id=employee.id,
        date=data.date,
        status=data.status
    )
    db.add(att)
    db.commit()
    return att

@router.get("/{employee_id}")
def get_attendance(employee_id: str, db: Session = Depends(get_db)):
    emp = db.query(models.Employee).filter(
        models.Employee.employee_id == employee_id
    ).first()

    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    return db.query(models.Attendance).filter_by(employee_id=emp.id).all()
