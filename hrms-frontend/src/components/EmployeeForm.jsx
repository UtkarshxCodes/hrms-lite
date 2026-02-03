import React, { useState } from 'react';
import { addEmployee } from '../services/api';

const initialState = {
  employee_id: '',
  full_name: '',
  email: '',
  department: '',
};

export default function EmployeeForm({ onSuccess }) {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const validate = () => {
    if (!form.employee_id.trim() || !form.full_name.trim() || !form.email.trim() || !form.department.trim()) {
      setError('All fields are required.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError('Please enter a valid email address.');
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
      await addEmployee({
        employee_id: form.employee_id.trim(),
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        department: form.department.trim(),
      });
      setSuccess('Employee added successfully!');
      setForm(initialState);
      setTimeout(() => setSuccess(''), 3000);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to add employee. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Add New Employee</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="employee_id">Employee ID *</label>
          <input
            id="employee_id"
            name="employee_id"
            type="text"
            value={form.employee_id}
            onChange={handleChange}
            disabled={loading}
            placeholder="e.g., EMP001"
          />
        </div>

        <div className="form-group">
          <label htmlFor="full_name">Full Name *</label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            value={form.full_name}
            onChange={handleChange}
            disabled={loading}
            placeholder="e.g., John Doe"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            disabled={loading}
            placeholder="e.g., john@example.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="department">Department *</label>
          <input
            id="department"
            name="department"
            type="text"
            value={form.department}
            onChange={handleChange}
            disabled={loading}
            placeholder="e.g., Engineering"
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Adding Employee...' : 'Add Employee'}
        </button>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
      </form>
    </div>
  );
}
