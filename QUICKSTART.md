# HRMS Lite - Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Start the Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```
✅ Backend will run on `http://localhost:8000`

### Step 2: Start the Frontend
```bash
cd hrms-frontend
npm install
npm run dev
```
✅ Frontend will run on `http://localhost:5173`

### Step 3: Open in Browser
Visit `http://localhost:5173` and start using the app!

---

## 🎯 What You Can Do

### Dashboard
- See total employees
- View total attendance records
- Check present/absent statistics
- Monitor overall attendance percentage

### Employees Page
- ➕ Add new employees (with email validation)
- 📋 View all employees
- 🗑️ Delete employees

### Attendance Page
- ✅ Mark attendance for employees
- 📊 View attendance records
- 📅 Filter by date
- 📈 See employee statistics

---

## 🔗 Important URLs

- **Frontend**: http://localhost:5173
- **Backend API**: https://victorious-courage-production.up.railway.app/api
- **Backend Docs**: http://localhost:8000/docs (when running locally)

---

## ⚠️ Troubleshooting

### "Cannot reach backend" error?
1. Make sure backend is running on port 8000
2. Check that CORS is enabled in `backend/app/main.py`
3. Verify API URL in `hrms-frontend/src/services/api.js`

### "Module not found" error?
1. Run `npm install` in hrms-frontend directory
2. Run `pip install -r requirements.txt` in backend directory

### Blank white screen?
1. Check browser console (F12) for errors
2. Make sure React Router is set up in main.jsx
3. Clear browser cache and reload

---

## 📚 File Structure

```
hrms-lite/
├── backend/
│   ├── app/
│   │   ├── main.py              (FastAPI app setup)
│   │   ├── models.py            (Database models)
│   │   ├── schemas.py           (Pydantic schemas)
│   │   ├── database.py          (Database connection)
│   │   └── routes/
│   │       ├── employees.py     (Employee endpoints)
│   │       └── attendance.py    (Attendance endpoints)
│   └── requirements.txt
│
├── hrms-frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── EmployeeForm.jsx
│   │   │   ├── EmployeeList.jsx
│   │   │   ├── AttendanceForm.jsx
│   │   │   └── AttendanceTable.jsx
│   │   ├── pages/
│   │   │   ├── Employees.jsx
│   │   │   └── Attendance.jsx
│   │   ├── services/
│   │   │   └── api.js          (API client)
│   │   ├── App.jsx             (Main routing)
│   │   ├── main.jsx            (Entry point)
│   │   ├── App.css             (Styling)
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🎨 Design Highlights

- ✨ Modern gradient cards
- 🎯 Intuitive user interface
- 📱 Fully responsive layout
- 🎭 Professional color scheme
- ⚡ Fast performance with Vite
- 🔄 Real-time data updates

---

## 📊 Database Schema

### Employees Table
```
id (UUID)
employee_id (String, unique)
full_name (String)
email (String, unique)
department (String)
```

### Attendance Table
```
id (UUID)
employee_id (UUID, Foreign Key)
date (Date)
status (Enum: Present, Absent)
```

---

## 🔌 API Usage Examples

### Add Employee
```bash
curl -X POST http://localhost:8000/api/employees \
  -H "Content-Type: application/json" \
  -d '{"employee_id":"E001","full_name":"John Doe","email":"john@example.com","department":"IT"}'
```

### Get All Employees
```bash
curl http://localhost:8000/api/employees
```

### Mark Attendance
```bash
curl -X POST http://localhost:8000/api/attendance \
  -H "Content-Type: application/json" \
  -d '{"employee_id":"E001","date":"2024-01-15","status":"Present"}'
```

### Get Employee Attendance with Stats
```bash
curl http://localhost:8000/api/attendance/E001/stats
```

### Get Dashboard Summary
```bash
curl http://localhost:8000/api/attendance/stats/dashboard/summary
```

---

## 💡 Tips & Tricks

1. Use browser DevTools (F12) to inspect network requests
2. Check `/api/docs` (Swagger) for all available endpoints
3. Backend auto-reloads with `--reload` flag
4. Frontend hot-reloads automatically with Vite
5. Test with different dates to see filtering work

---

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
npm run build
# Upload dist/ folder to Vercel or Netlify
```

### Backend Deployment (Railway)
Already deployed at: `https://victorious-courage-production.up.railway.app`

---

## 📞 Need Help?

- Check error messages in browser console
- Look at backend terminal logs
- Review API response in Network tab
- Ensure all dependencies are installed

---

**Happy using HRMS Lite! 🎉**
