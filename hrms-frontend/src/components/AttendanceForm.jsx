import React, { useState, useEffect } from 'react';
import { getEmployees, markAttendance } from '../services/api';

const initialState = {
  employee_id: '',
  date: '',
  status: 'Present',
};

export default function AttendanceForm({ onSuccess }) {
  const [form, setForm] = useState(initialState);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [empLoading, setEmpLoading] = useState(true);

  useEffect(() => {
    const loadEmployees = async () => {
      setEmpLoading(true);
      try {
        const data = await getEmployees();
        setEmployees(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Failed to load employees.');
      } finally {
        setEmpLoading(false);
      }
    };
    loadEmployees();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const validate = () => {
    if (!form.employee_id || !form.date || !form.status) {
      setError('All fields are required.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await markAttendance({
        employee_id: form.employee_id,
        date: form.date,
        status: form.status,
      });
      setSuccess('Attendance marked successfully!');
      setForm(initialState);
      setTimeout(() => setSuccess(''), 3000);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to mark attendance.');
    } finally {
      setLoading(false);
    }
  };

  if (empLoading) {
    return <div className="card"><p className="loading-text">Loading employees...</p></div>;
  }

  if (error && !employees.length) {
    return <div className="card"><div className="alert alert-error">{error}</div></div>;
  }

  if (!employees || employees.length === 0) {
    return <div className="card"><p className="empty-text">No employees available. Add employees first.</p></div>;
  }

  return (
    <div className="card">
      <h2>Mark Attendance</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="employee_id">Employee *</label>
          <select
            id="employee_id"
            name="employee_id"
            value={form.employee_id}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">Select an employee</option>
            {employees.map((e) => (
              <option key={e.employee_id} value={e.employee_id}>
                {e.full_name} ({e.employee_id})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="date">Date *</label>
          <input
            id="date"
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status *</label>
          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Marking Attendance...' : 'Mark Attendance'}
        </button>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
      </form>
    </div>
  );
}
