from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import date
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
        raise HTTPException(status_code=409, detail="Attendance already marked for this date")

    att = models.Attendance(
        employee_id=employee.id,
        date=data.date,
        status=data.status
    )
    db.add(att)
    db.commit()
    return att

@router.get("/{employee_id}")
def get_attendance(
    employee_id: str,
    start_date: date = Query(None),
    end_date: date = Query(None),
    db: Session = Depends(get_db)
):
    """Get attendance for employee, optionally filtered by date range"""
    emp = db.query(models.Employee).filter(
        models.Employee.employee_id == employee_id
    ).first()

    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    query = db.query(models.Attendance).filter_by(employee_id=emp.id)

    # Apply date filters if provided
    if start_date:
        query = query.filter(models.Attendance.date >= start_date)
    if end_date:
        query = query.filter(models.Attendance.date <= end_date)

    records = query.order_by(models.Attendance.date.desc()).all()
    return records

@router.get("/{employee_id}/stats")
def get_attendance_stats(employee_id: str, db: Session = Depends(get_db)):
    """Get attendance statistics for an employee"""
    emp = db.query(models.Employee).filter(
        models.Employee.employee_id == employee_id
    ).first()

    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    total = db.query(models.Attendance).filter_by(employee_id=emp.id).count()
    present = db.query(models.Attendance).filter_by(
        employee_id=emp.id, status="Present"
    ).count()
    absent = db.query(models.Attendance).filter_by(
        employee_id=emp.id, status="Absent"
    ).count()

    return {
        "employee_id": employee_id,
        "total_records": total,
        "present_days": present,
        "absent_days": absent,
        "attendance_percentage": round((present / total * 100), 2) if total > 0 else 0
    }

@router.get("/stats/dashboard/summary")
def get_dashboard_summary(db: Session = Depends(get_db)):
    """Get overall dashboard summary"""
    total_employees = db.query(models.Employee).count()
    total_records = db.query(models.Attendance).count()
    total_present = db.query(models.Attendance).filter_by(status="Present").count()
    total_absent = db.query(models.Attendance).filter_by(status="Absent").count()

    return {
        "total_employees": total_employees,
        "total_attendance_records": total_records,
        "total_present": total_present,
        "total_absent": total_absent,
        "overall_attendance_percentage": round((total_present / total_records * 100), 2) if total_records > 0 else 0
    }
