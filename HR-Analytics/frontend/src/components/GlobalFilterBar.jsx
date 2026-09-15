import React from 'react';
import { Filter, RotateCcw, Calendar, MapPin, Briefcase, Award } from 'lucide-react';

const GlobalFilterBar = ({ filters, setFilters, onReset }) => {
  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="glass-card p-3 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 font-bold text-teal-400 border-r border-slate-800 pr-3">
          <Filter className="w-3.5 h-3.5" />
          <span>Global Filters</span>
        </div>

        {/* Date Range */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1.5 rounded-xl border border-slate-800">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={filters.dateRange || 'Q3 2026'}
            onChange={(e) => handleChange('dateRange', e.target.value)}
            className="bg-transparent text-slate-200 focus:outline-none"
          >
            <option value="Q3 2026">Q3 2026 (Current)</option>
            <option value="Q2 2026">Q2 2026</option>
            <option value="Q1 2026">Q1 2026</option>
            <option value="FY 2025">FY 2025</option>
          </select>
        </div>

        {/* Department */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1.5 rounded-xl border border-slate-800">
          <select
            value={filters.department || 'All'}
            onChange={(e) => handleChange('department', e.target.value)}
            className="bg-transparent text-slate-200 focus:outline-none"
          >
            <option value="All">All Departments</option>
            <option value="Research & Development">Research & Development</option>
            <option value="Sales">Sales</option>
            <option value="Human Resources">Human Resources</option>
          </select>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1.5 rounded-xl border border-slate-800">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={filters.location || 'All'}
            onChange={(e) => handleChange('location', e.target.value)}
            className="bg-transparent text-slate-200 focus:outline-none"
          >
            <option value="All">All Locations</option>
            <option value="Headquarters">HQ (San Francisco)</option>
            <option value="Tech Hub">Tech Hub (Austin)</option>
            <option value="Remote">Remote</option>
          </select>
        </div>

        {/* Job Role */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1.5 rounded-xl border border-slate-800">
          <Briefcase className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={filters.jobRole || 'All'}
            onChange={(e) => handleChange('jobRole', e.target.value)}
            className="bg-transparent text-slate-200 focus:outline-none"
          >
            <option value="All">All Job Roles</option>
            <option value="Research Scientist">Research Scientist</option>
            <option value="Sales Executive">Sales Executive</option>
            <option value="Laboratory Technician">Laboratory Technician</option>
            <option value="Manager">Manager</option>
          </select>
        </div>

        {/* Experience Tier */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1.5 rounded-xl border border-slate-800">
          <Award className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={filters.experience || 'All'}
            onChange={(e) => handleChange('experience', e.target.value)}
            className="bg-transparent text-slate-200 focus:outline-none"
          >
            <option value="All">All Experience Tiers</option>
            <option value="0-3">0-3 Years (Entry)</option>
            <option value="4-8">4-8 Years (Mid)</option>
            <option value="9+">9+ Years (Senior)</option>
          </select>
        </div>
      </div>

      {/* Reset Filters */}
      <button
        onClick={onReset}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition font-semibold"
      >
        <RotateCcw className="w-3 h-3 text-teal-400" />
        Reset Filters
      </button>
    </div>
  );
};

export default GlobalFilterBar;
