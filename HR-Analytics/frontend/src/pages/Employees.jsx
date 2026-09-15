import React, { useEffect, useState } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, User, UserPlus, X, CheckCircle2, RefreshCw } from 'lucide-react';
import { fetchEmployees, createEmployeeRecord } from '../services/api';
import RiskBadge from '../components/RiskBadge';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [department, setDepartment] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const initialFormState = {
    EmployeeName: '',
    Age: 30,
    Gender: 'Male',
    Department: 'Research & Development',
    JobRole: 'Research Scientist',
    Education: 3,
    EducationField: 'Life Sciences',
    BusinessTravel: 'Travel_Rarely',
    DistanceFromHome: 5,
    EnvironmentSatisfaction: 3,
    JobInvolvement: 3,
    JobLevel: 2,
    JobSatisfaction: 3,
    MaritalStatus: 'Single',
    MonthlyIncome: 5500,
    NumCompaniesWorked: 2,
    OverTime: 'No',
    PercentSalaryHike: 14,
    PerformanceRating: 3,
    RelationshipSatisfaction: 3,
    StockOptionLevel: 1,
    TotalWorkingYears: 6,
    TrainingTimesLastYear: 3,
    WorkLifeBalance: 3,
    YearsAtCompany: 3,
    YearsInCurrentRole: 2,
    YearsSinceLastPromotion: 1,
    YearsWithCurrManager: 2,
    Attrition: 'No',
  };

  const [formData, setFormData] = useState(initialFormState);

  const loadData = () => {
    setLoading(true);
    fetchEmployees(page, limit, department, search)
      .then((res) => {
        setEmployees(res.employees || []);
        setTotal(res.total || 0);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching employees:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, [page, department]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadData();
  };

  const handleFormChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg('');
    try {
      await createEmployeeRecord(formData);
      setSuccessMsg('Employee record created successfully!');
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccessMsg('');
        setFormData(initialFormState);
        setPage(1);
        loadData();
      }, 1200);
    } catch (err) {
      console.error('Error creating employee record:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="space-y-6">
      {/* Header Search, Filter & Add Employee Button */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by employee name, role, department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900/80 text-sm text-slate-100 placeholder-slate-500 pl-10 pr-4 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-teal-500 transition"
          />
        </form>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Filter className="w-4 h-4 text-teal-400" />
            <span>Department:</span>
            <select
              value={department}
              onChange={(e) => { setDepartment(e.target.value); setPage(1); }}
              className="bg-slate-900/80 text-xs text-slate-200 px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-teal-500"
            >
              <option value="All">All Departments</option>
              <option value="Research & Development">Research & Development</option>
              <option value="Sales">Sales</option>
              <option value="Human Resources">Human Resources</option>
            </select>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-sky-500 hover:from-teal-600 hover:to-sky-600 text-white font-bold text-xs shadow-lg shadow-teal-500/20 transition"
          >
            <UserPlus className="w-4 h-4" />
            Add Employee Record
          </button>
        </div>
      </div>

      {/* Employees Directory Table */}
      <div className="glass-card rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">ID</th>
                <th className="px-5 py-3.5">Employee Name</th>
                <th className="px-5 py-3.5">Job Role</th>
                <th className="px-5 py-3.5">Department</th>
                <th className="px-5 py-3.5">Age</th>
                <th className="px-5 py-3.5">Monthly Salary</th>
                <th className="px-5 py-3.5">Years at Co.</th>
                <th className="px-5 py-3.5">Overtime</th>
                <th className="px-5 py-3.5">Attrition Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-slate-500">
                    Loading records...
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-slate-500">
                    No employee records found.
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.EmployeeNumber} className="hover:bg-slate-800/40 transition">
                    <td className="px-5 py-3.5 font-mono text-teal-400 font-bold">#{emp.EmployeeNumber}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-teal-400 font-bold text-xs shrink-0">
                          {(emp.EmployeeName || emp.JobRole || 'E').substring(0, 1).toUpperCase()}
                        </div>
                        <span className="text-slate-100 font-bold">{emp.EmployeeName || `Employee #${emp.EmployeeNumber}`}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-200">{emp.JobRole}</td>
                    <td className="px-5 py-3.5 text-slate-300">{emp.Department}</td>
                    <td className="px-5 py-3.5">{emp.Age} yrs</td>
                    <td className="px-5 py-3.5 font-semibold text-emerald-400">${emp.MonthlyIncome?.toLocaleString()}</td>
                    <td className="px-5 py-3.5">{emp.YearsAtCompany} yrs</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${emp.OverTime === 'Yes' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>
                        {emp.OverTime}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${emp.Attrition === 'Yes' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                        {emp.Attrition === 'Yes' ? 'Left Company' : 'Active Staff'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-5 py-4 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Showing Page <strong className="text-slate-200">{page}</strong> of <strong className="text-slate-200">{totalPages}</strong> ({total} total employees)
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Employee Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-card w-full max-w-2xl rounded-3xl border border-slate-800 p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">Add New Employee Record</h3>
                  <p className="text-xs text-slate-400">Input employee parameters to add to dataset & database</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {successMsg && (
              <div className="p-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Employee Full Name *</label>
                  <input
                    type="text"
                    name="EmployeeName"
                    placeholder="e.g. Alex Morgan"
                    value={formData.EmployeeName}
                    onChange={handleFormChange}
                    className="w-full bg-slate-900 text-xs text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-teal-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Age</label>
                  <input
                    type="number"
                    name="Age"
                    value={formData.Age}
                    onChange={handleFormChange}
                    className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-800 focus:border-teal-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Gender</label>
                  <select
                    name="Gender"
                    value={formData.Gender}
                    onChange={handleFormChange}
                    className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-800 focus:border-teal-500 focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
                  <select
                    name="Department"
                    value={formData.Department}
                    onChange={handleFormChange}
                    className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-800 focus:border-teal-500 focus:outline-none"
                  >
                    <option value="Research & Development">Research & Development</option>
                    <option value="Sales">Sales</option>
                    <option value="Human Resources">Human Resources</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Job Role</label>
                  <input
                    type="text"
                    name="JobRole"
                    value={formData.JobRole}
                    onChange={handleFormChange}
                    className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-800 focus:border-teal-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Monthly Income ($)</label>
                  <input
                    type="number"
                    name="MonthlyIncome"
                    value={formData.MonthlyIncome}
                    onChange={handleFormChange}
                    className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-800 focus:border-teal-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Overtime Required?</label>
                  <select
                    name="OverTime"
                    value={formData.OverTime}
                    onChange={handleFormChange}
                    className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-800 focus:border-teal-500 focus:outline-none"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Education Field</label>
                  <input
                    type="text"
                    name="EducationField"
                    value={formData.EducationField}
                    onChange={handleFormChange}
                    className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-800 focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Years at Company</label>
                  <input
                    type="number"
                    name="YearsAtCompany"
                    value={formData.YearsAtCompany}
                    onChange={handleFormChange}
                    className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-800 focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Job Satisfaction (1 - 4)</label>
                  <input
                    type="number"
                    min="1"
                    max="4"
                    name="JobSatisfaction"
                    value={formData.JobSatisfaction}
                    onChange={handleFormChange}
                    className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-800 focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Attrition Status</label>
                  <select
                    name="Attrition"
                    value={formData.Attrition}
                    onChange={handleFormChange}
                    className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-800 focus:border-teal-500 focus:outline-none"
                  >
                    <option value="No">Active Staff (No Attrition)</option>
                    <option value="Yes">Left Company (Attrition)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-sky-500 hover:from-teal-600 hover:to-sky-600 text-white font-bold text-xs shadow-lg shadow-teal-500/20 transition flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Saving Employee Record...
                    </>
                  ) : (
                    'Save Record'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
