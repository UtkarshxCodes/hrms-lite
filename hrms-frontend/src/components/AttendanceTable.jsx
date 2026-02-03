import React, { useEffect, useState } from 'react';
import { getEmployees, getAttendance, getAttendanceStats } from '../services/api';

export default function AttendanceTable({ refreshSignal }) {
  const [selected, setSelected] = useState('');
  const [employees, setEmployees] = useState([]);
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [empLoading, setEmpLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    const loadEmployees = async () => {
      setEmpLoading(true);
      try {
        const data = await getEmployees();
        setEmployees(Array.isArray(data) ? data : []);
        if (data && data.length > 0) {
          setSelected(data[0].employee_id);
        }
      } catch (err) {
        setError(err.message || 'Failed to load employees.');
      } finally {
        setEmpLoading(false);
      }
    };
    loadEmployees();
  }, []);

  useEffect(() => {
    if (!selected) return;
    const loadAttendance = async () => {
      setLoading(true);
      setError('');
      try {
        const [attendanceData, statsData] = await Promise.all([
          getAttendance(selected),
          getAttendanceStats(selected)
        ]);
        setRecords(Array.isArray(attendanceData) ? attendanceData : []);
        setStats(statsData);
        setFilterDate('');
      } catch (err) {
        setError(err.message || 'Failed to load attendance.');
        setRecords([]);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    loadAttendance();
  }, [selected, refreshSignal]);

  // Filter records by date
  useEffect(() => {
    if (filterDate) {
      setFilteredRecords(records.filter(r => r.date === filterDate));
    } else {
      setFilteredRecords(records);
    }
  }, [records, filterDate]);

  const selectedEmployee = employees.find(e => e.employee_id === selected);

  if (empLoading) {
    return <div className="card"><p className="loading-text">Loading employees...</p></div>;
  }

  if (error && !employees.length) {
    return (
      <div className="card">
        <div className="alert alert-error">
          {error.includes('CORS') || error.includes('404') || error.includes('network') ? (
            <>
              <strong>Connection Error:</strong> Cannot reach backend. Please ensure:
              <ul style={{ marginTop: '0.5rem', marginLeft: '1.5rem' }}>
                <li>Backend server is running</li>
                <li>CORS is enabled on backend</li>
                <li>API URL is correct: https://victorious-courage-production.up.railway.app/</li>
              </ul>
            </>
          ) : (
            error
          )}
        </div>
      </div>
    );
  }

  if (!employees || employees.length === 0) {
    return <div className="card"><p className="empty-text">No employees available.</p></div>;
  }

  return (
    <div className="card">
      <h2>Attendance Records</h2>
      
      <div className="form-group">
        <label htmlFor="employee-select">Select Employee *</label>
        <select
          id="employee-select"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          {employees.map((e) => (
            <option key={e.employee_id} value={e.employee_id}>
              {e.full_name} ({e.employee_id})
            </option>
          ))}
        </select>
      </div>

      {selectedEmployee && stats && (
        <div className="stats-container">
          <div className="stat-box">
            <span className="stat-label">Total Records</span>
            <span className="stat-value">{stats.total_records}</span>
          </div>
          <div className="stat-box stat-present">
            <span className="stat-label">Present</span>
            <span className="stat-value">{stats.present_days}</span>
          </div>
          <div className="stat-box stat-absent">
            <span className="stat-label">Absent</span>
            <span className="stat-value">{stats.absent_days}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Attendance %</span>
            <span className="stat-value">{stats.attendance_percentage.toFixed(2)}%</span>
          </div>
        </div>
      )}

      {records.length > 0 && (
        <div className="form-group">
          <label htmlFor="filter-date">Filter by Date (optional)</label>
          <input
            id="filter-date"
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <p className="loading-text">Loading attendance records...</p>
      ) : filteredRecords.length === 0 ? (
        <p className="empty-text">
          {records.length === 0 ? 'No attendance records found.' : 'No records match the selected filter.'}
        </p>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((rec, i) => (
                <tr key={i} className={`status-${rec.status.toLowerCase()}`}>
                  <td>{new Date(rec.date).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge badge-${rec.status.toLowerCase()}`}>
                      {rec.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
