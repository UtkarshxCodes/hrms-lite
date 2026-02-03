import { useState, useEffect } from "react";
import { getDashboardSummary, getEmployees } from "../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsData, employeesData] = await Promise.all([
        getDashboardSummary(),
        getEmployees()
      ]);

      setStats(statsData);
      setEmployeeCount(employeesData.length);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <h2>Dashboard</h2>
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <h2>Dashboard</h2>
        <div className="error-box">
          <strong>Error:</strong> {error}
          <button onClick={fetchDashboardData} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const attendancePercentage = stats?.overall_attendance_percentage || 0;
  const totalAttendance = stats?.total_attendance_records || 0;
  const totalPresent = stats?.total_present || 0;
  const totalAbsent = stats?.total_absent || 0;

  return (
    <div className="container">
      <h2>Dashboard</h2>

      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon employees-icon">👥</div>
          <div className="stat-content">
            <div className="stat-label">Total Employees</div>
            <div className="stat-value">{employeeCount}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon records-icon">📋</div>
          <div className="stat-content">
            <div className="stat-label">Total Records</div>
            <div className="stat-value">{totalAttendance}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon present-icon">✓</div>
          <div className="stat-content">
            <div className="stat-label">Total Present</div>
            <div className="stat-value present">{totalPresent}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon absent-icon">✗</div>
          <div className="stat-content">
            <div className="stat-label">Total Absent</div>
            <div className="stat-value absent">{totalAbsent}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon percentage-icon">%</div>
          <div className="stat-content">
            <div className="stat-label">Attendance Rate</div>
            <div className="stat-value">{attendancePercentage.toFixed(2)}%</div>
          </div>
        </div>
      </div>

      <div className="dashboard-summary">
        <h3>Summary</h3>
        <ul>
          <li>
            <strong>Average Attendance:</strong> {attendancePercentage.toFixed(2)}% of all employees are present
          </li>
          <li>
            <strong>Present Days:</strong> {totalPresent} attendance records marked as present
          </li>
          <li>
            <strong>Absent Days:</strong> {totalAbsent} attendance records marked as absent
          </li>
          <li>
            <strong>Total Records:</strong> {totalAttendance} total attendance records in the system
          </li>
        </ul>
      </div>

      <button onClick={fetchDashboardData} className="btn btn-secondary" style={{marginTop: '20px'}}>
        Refresh Dashboard
      </button>
    </div>
  );
}
