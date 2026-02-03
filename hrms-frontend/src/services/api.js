import axios from "axios";

const API = axios.create({
  baseURL: "https://victorious-courage-production.up.railway.app/", // Railway URL
});

export const getEmployees = async () => {
  const res = await API.get("/employees");
  return res.data;
};

export const addEmployee = async (data) => {
  const res = await API.post("/employees", data);
  return res.data;
};

export const deleteEmployee = async (id) => {
  const res = await API.delete(`/employees/${id}`);
  return res.data;
};

export const markAttendance = async (data) => {
  const res = await API.post("/attendance", data);
  return res.data;
};

export const getAttendance = async (employeeId, startDate = null, endDate = null) => {
  const params = {};
  if (startDate) params.start_date = startDate;
  if (endDate) params.end_date = endDate;
  
  const res = await API.get(`/attendance/${employeeId}`, { params });
  return res.data;
};

export const getAttendanceStats = async (employeeId) => {
  const res = await API.get(`/attendance/${employeeId}/stats`);
  return res.data;
};

export const getDashboardSummary = async () => {
  const res = await API.get(`/attendance/stats/dashboard/summary`);
  return res.data;
};
