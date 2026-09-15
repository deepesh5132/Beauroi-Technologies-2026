import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchDashboardSummary = async () => {
  const res = await api.get('/dashboard');
  return res.data;
};

export const fetchKPIs = async () => {
  const res = await api.get('/kpis');
  return res.data;
};

export const fetchEmployees = async (page = 1, limit = 15, department = 'All', search = '') => {
  const res = await api.get('/employees', {
    params: { page, limit, department, search },
  });
  return res.data;
};

export const createEmployeeRecord = async (employeeData) => {
  const res = await api.post('/employees', employeeData);
  return res.data;
};

export const fetchAttritionAnalytics = async () => {
  const res = await api.get('/attrition');
  return res.data;
};

export const fetchDepartments = async () => {
  const res = await api.get('/departments');
  return res.data;
};

export const fetchPerformance = async () => {
  const res = await api.get('/performance');
  return res.data;
};

export const predictAttrition = async (employeePayload) => {
  const res = await api.post('/predict', employeePayload);
  return res.data;
};

export const askHRCopilot = async (query) => {
  const res = await api.post('/copilot', { query });
  return res.data;
};

export const runWhatIfSimulation = async (scenarioData) => {
  const res = await api.post('/simulator', scenarioData);
  return res.data;
};

export const fetchSkillIntelligence = async () => {
  const res = await api.get('/skills');
  return res.data;
};

export const fetchHRAlerts = async () => {
  const res = await api.get('/alerts');
  return res.data;
};

export const fetchFinancialCosts = async () => {
  const res = await api.get('/financials');
  return res.data;
};

export const fetchTalentMatrix = async () => {
  const res = await api.get('/talent-matrix');
  return res.data;
};

export const trainModels = async () => {
  const res = await api.post('/train');
  return res.data;
};

export const downloadExecutiveReport = async () => {
  const res = await api.post('/report', {}, { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'HR_Analytics_Executive_Report.pdf');
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const uploadDatasetCSV = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export default api;
