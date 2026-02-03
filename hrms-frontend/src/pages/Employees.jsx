import React, { useState } from 'react';
import EmployeeForm from '../components/EmployeeForm';
import EmployeeList from '../components/EmployeeList';

export default function Employees() {
  const [refresh, setRefresh] = useState(0);

  const handleSuccess = () => setRefresh((r) => r + 1);

  return (
    <div className="page">
      <h1>Employee Management</h1>
      <p className="page-subtitle">Add, view, and manage all employees</p>
      <div className="page-layout">
        <EmployeeForm onSuccess={handleSuccess} />
        <EmployeeList refreshSignal={refresh} />
      </div>
    </div>
  );
}
