# HRMS Lite - API Documentation

## Base URL
```
https://victorious-courage-production.up.railway.app/api
```

## Health Check
```
GET /
Response: {"status": "ok", "message": "HRMS Lite API is running"}
```

---

## Employees Endpoints

### 1. Create Employee
```http
POST /employees
Content-Type: application/json

{
  "employee_id": "E001",
  "full_name": "John Doe",
  "email": "john@example.com",
  "department": "IT"
}
```

**Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "employee_id": "E001",
  "full_name": "John Doe",
  "email": "john@example.com",
  "department": "IT"
}
```

**Errors:**
- `409 Conflict`: Employee with this ID or email already exists

---

### 2. Get All Employees
```http
GET /employees
```

**Response (200 OK):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "employee_id": "E001",
    "full_name": "John Doe",
    "email": "john@example.com",
    "department": "IT"
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "employee_id": "E002",
    "full_name": "Jane Smith",
    "email": "jane@example.com",
    "department": "HR"
  }
]
```

---

### 3. Get Specific Employee
```http
GET /employees/{employee_id}
```

**Example:** `GET /employees/E001`

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "employee_id": "E001",
  "full_name": "John Doe",
  "email": "john@example.com",
  "department": "IT"
}
```

**Errors:**
- `404 Not Found`: Employee not found

---

### 4. Delete Employee
```http
DELETE /employees/{employee_id}
```

**Example:** `DELETE /employees/E001`

**Response (200 OK):**
```json
{
  "message": "Employee deleted successfully"
}
```

**Note:** Deleting an employee also removes all their attendance records.

**Errors:**
- `404 Not Found`: Employee not found

---

## Attendance Endpoints

### 1. Mark Attendance
```http
POST /attendance
Content-Type: application/json

{
  "employee_id": "E001",
  "date": "2024-01-15",
  "status": "Present"
}
```

**Response (201 Created):**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "employee_id": "550e8400-e29b-41d4-a716-446655440000",
  "date": "2024-01-15",
  "status": "Present"
}
```

**Valid Status Values:** `"Present"` or `"Absent"`

**Errors:**
- `404 Not Found`: Employee not found
- `409 Conflict`: Attendance already marked for this date

---

### 2. Get Attendance Records
```http
GET /attendance/{employee_id}
GET /attendance/{employee_id}?start_date=2024-01-01&end_date=2024-01-31
```

**Example without filter:**
```
GET /attendance/E001
```

**Example with date range:**
```
GET /attendance/E001?start_date=2024-01-01&end_date=2024-01-31
```

**Query Parameters:**
- `start_date` (optional): Filter records from this date (YYYY-MM-DD)
- `end_date` (optional): Filter records until this date (YYYY-MM-DD)

**Response (200 OK):**
```json
[
  {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "employee_id": "550e8400-e29b-41d4-a716-446655440000",
    "date": "2024-01-15",
    "status": "Present"
  },
  {
    "id": "880e8400-e29b-41d4-a716-446655440003",
    "employee_id": "550e8400-e29b-41d4-a716-446655440000",
    "date": "2024-01-16",
    "status": "Absent"
  }
]
```

**Errors:**
- `404 Not Found`: Employee not found

---

### 3. Get Employee Attendance Statistics
```http
GET /attendance/{employee_id}/stats
```

**Example:** `GET /attendance/E001/stats`

**Response (200 OK):**
```json
{
  "employee_id": "E001",
  "total_records": 20,
  "present_days": 18,
  "absent_days": 2,
  "attendance_percentage": 90.0
}
```

**Note:** Returns 0% if no attendance records exist.

**Errors:**
- `404 Not Found`: Employee not found

---

### 4. Get Dashboard Summary
```http
GET /attendance/stats/dashboard/summary
```

**Response (200 OK):**
```json
{
  "total_employees": 5,
  "total_attendance_records": 100,
  "total_present": 85,
  "total_absent": 15,
  "overall_attendance_percentage": 85.0
}
```

**Note:** Returns 0% if no attendance records exist.

---

## cURL Examples

### Create Employee
```bash
curl -X POST https://victorious-courage-production.up.railway.app/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": "E001",
    "full_name": "John Doe",
    "email": "john@example.com",
    "department": "IT"
  }'
```

### Get All Employees
```bash
curl https://victorious-courage-production.up.railway.app/api/employees
```

### Delete Employee
```bash
curl -X DELETE https://victorious-courage-production.up.railway.app/api/employees/E001
```

### Mark Attendance
```bash
curl -X POST https://victorious-courage-production.up.railway.app/api/attendance \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": "E001",
    "date": "2024-01-15",
    "status": "Present"
  }'
```

### Get Attendance with Date Filter
```bash
curl "https://victorious-courage-production.up.railway.app/api/attendance/E001?start_date=2024-01-01&end_date=2024-01-31"
```

### Get Employee Stats
```bash
curl https://victorious-courage-production.up.railway.app/api/attendance/E001/stats
```

### Get Dashboard Summary
```bash
curl https://victorious-courage-production.up.railway.app/api/attendance/stats/dashboard/summary
```

---

## Error Responses

All error responses follow this format:

```json
{
  "detail": "Error message describing what went wrong"
}
```

### Common Status Codes
- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid input data
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource conflict (e.g., duplicate entry)
- `500 Internal Server Error`: Server error

---

## Data Types & Formats

### Date Format
- Format: `YYYY-MM-DD`
- Example: `2024-01-15`
- Timezone: UTC

### Email Format
- Must be valid email format
- Example: `user@example.com`

### Status Values
- `"Present"` - Employee was present
- `"Absent"` - Employee was absent

---

## Rate Limiting
Currently no rate limiting is enforced. This may be added in future versions.

---

## Authentication
Currently, the API does not require authentication. This should be added for production use.

---

## CORS Configuration
The API allows requests from:
- `http://localhost:5173`
- `http://localhost:3000`
- `http://localhost:8000`
- `http://127.0.0.1:5173`
- `http://127.0.0.1:3000`
- All origins (`*`)

---

## Testing with Postman

1. Import the following base URL: `https://victorious-courage-production.up.railway.app/api`
2. Use the cURL examples above in Postman
3. Set Content-Type to `application/json` for POST requests
4. Check the response status and body

---

## Interactive API Docs

When running locally, visit: `http://localhost:8000/docs` (Swagger UI)

---

## Version History

**v1.0.0** (Current)
- Initial release with all core features
- CORS support enabled
- Bonus features: filtering, statistics, dashboard summary

---

## Future Enhancements

- Authentication & authorization
- Rate limiting
- Request validation
- API versioning
- Caching
- Bulk operations
- Export to CSV/PDF
- Advanced filtering
