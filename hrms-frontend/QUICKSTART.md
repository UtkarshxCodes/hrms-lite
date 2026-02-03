# 🚀 Quick Start Guide - HRMS Lite Frontend

## Setup (30 seconds)

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser
# Navigate to http://localhost:5173
```

## What You'll See

✅ **Employees Page** - Add, view, and manage employees  
✅ **Attendance Page** - Mark attendance and view history  
✅ **Professional UI** - Clean admin panel design  
✅ **Responsive** - Works on desktop, tablet, mobile  

## Features Available

### Employee Management
- Add new employees (ID, Name, Email, Department)
- View all employees in table
- Delete with confirmation
- Email validation
- Error messages for duplicates

### Attendance Management
- Mark attendance (Present/Absent)
- View attendance history
- **Filter by date** (Bonus)
- **View statistics** (Bonus) - Present/Absent count
- **Status badges** (Bonus) - Color-coded

## Backend Connection

✅ Backend is already configured  
✅ Connected to live Railway deployment  
✅ All endpoints ready to use  

## File Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── services/           # API integration
├── App.jsx             # Main app with routing
├── App.css             # Professional styling
└── main.jsx            # Entry point
```

## Testing the App

1. **Add an Employee**
   - Fill in ID, Name, Email, Department
   - Click "Add Employee"
   - See it in the list below

2. **Mark Attendance**
   - Go to Attendance page
   - Select employee from dropdown
   - Select date
   - Select Present/Absent
   - Click "Mark Attendance"

3. **View Statistics**
   - Select an employee
   - See total, present, absent counts
   - Filter by date to narrow down

4. **Delete Employee**
   - Click Delete button in employee list
   - Confirm deletion

## Mobile Friendly

- Responsive grid layout
- Adapts to all screen sizes
- Touch-friendly buttons
- Readable text on mobile

## Production Deployment

### Vercel (Recommended)
```bash
# 1. Push to GitHub
git push

# 2. Go to vercel.com
# 3. Click "New Project"
# 4. Select your repository
# 5. Deploy!
```

### Netlify
```bash
# 1. npm run build
# 2. Upload 'dist' folder to Netlify
# Or connect GitHub for auto-deploy
```

## Troubleshooting

### Blank Screen
- Check browser console (F12)
- Backend might not be running
- Try hard refresh (Ctrl+Shift+R)

### "Failed to load employees"
- Check backend URL in src/services/api.js
- Ensure backend is running
- Check CORS settings

### Form not submitting
- Check all required fields are filled
- Check browser console for errors
- Verify email format (xxx@xxx.xxx)

## Available Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Code Quality

- ✅ Functional components only
- ✅ React hooks (useState, useEffect)
- ✅ Error handling on all API calls
- ✅ No mock data
- ✅ Clean, readable code
- ✅ Modular design
- ✅ Production-ready

## Support

If something doesn't work:
1. Check browser console for errors (F12)
2. Verify backend is running
3. Check network tab to see API calls
4. Review README.md for more details

---

**Status**: ✅ Ready to Use  
**Version**: 1.0.0  
**Last Updated**: February 3, 2026
