import React, { useEffect, useState } from 'react';
import { getEmployees, deleteEmployee } from '../services/api';

export default function EmployeeList({ refreshSignal }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleting, setDeleting] = useState('');

  const loadEmployees = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getEmployees();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load employees.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, [refreshSignal]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    setDeleting(id);
    setError('');
    setSuccess('');
    try {
      await deleteEmployee(id);
      setSuccess('Employee deleted successfully.');
      setEmployees((prev) => prev.filter((e) => e.employee_id !== id));
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete employee.');
    } finally {
      setDeleting('');
    }
  };

  if (loading) {
    return <div className="card"><p className="loading-text">Loading employees...</p></div>;
  }

  if (error) {
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
    return <div className="card"><p className="empty-text">No employees found. Add one to get started.</p></div>;
  }

  return (
    <div className="card">
      <h2>All Employees ({employees.length})</h2>
      {success && <div className="alert alert-success">{success}</div>}
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.employee_id}>
                <td className="mono">{emp.employee_id}</td>
                <td>{emp.full_name}</td>
                <td>{emp.email}</td>
                <td>{emp.department}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(emp.employee_id)}
                    disabled={deleting === emp.employee_id}
                  >
                    {deleting === emp.employee_id ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
