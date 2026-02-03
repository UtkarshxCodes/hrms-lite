import React, { useState } from 'react';
import AttendanceForm from '../components/AttendanceForm';
import AttendanceTable from '../components/AttendanceTable';

export default function Attendance() {
  const [refresh, setRefresh] = useState(0);

  const handleSuccess = () => setRefresh((r) => r + 1);

  return (
    <div className="page">
      <h1>Attendance Management</h1>
      <p className="page-subtitle">Mark and track employee attendance</p>
      <div className="page-layout">
        <AttendanceForm onSuccess={handleSuccess} />
        <AttendanceTable refreshSignal={refresh} />
      </div>
    </div>
  );
}
