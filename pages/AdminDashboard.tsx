import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { UserRole, CaseStatus } from '../types';
import { Trash2, FileText, CheckCircle, Clock, AlertCircle, Search, Filter } from 'lucide-react';

const AdminDashboard = () => {
  const { users, cases, transactions, resetDemo } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const totalRevenue = transactions
    .filter(t => t.type === 'CASE_FEE')
    .reduce((acc, curr) => acc + Math.abs(curr.amount), 0);
  
  const platformProfit = totalRevenue * 0.3;

  // Chart Data Preparation
  const casesBySpecialty = cases.reduce((acc, curr) => {
    acc[curr.specialty] = (acc[curr.specialty] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.keys(casesBySpecialty).map(key => ({
    name: key,
    value: casesBySpecialty[key]
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ff6b6b'];

  // Doctor Performance
  const doctorData = users
    .filter(u => u.role === UserRole.DOCTOR)
    .map(d => ({
        name: d.name.split(' ').pop(), // Last name
        cases: d.casesClosed || 0,
        rating: d.rating || 0
    }))
    .sort((a,b) => b.cases - a.cases);

  // Sorted and Filtered cases for table
  const filteredCases = [...cases]
    .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .filter(c => {
      const matchesSearch = c.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            c.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Admin Overview</h1>
        <button 
            onClick={resetDemo}
            className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg text-sm font-medium transition"
        >
            <Trash2 className="h-4 w-4" />
            Reset Demo Data
        </button>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-slate-500 text-xs font-bold uppercase">Total Cases</h3>
              <p className="text-3xl font-bold text-slate-900 mt-2">{cases.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-slate-500 text-xs font-bold uppercase">Active Doctors</h3>
              <p className="text-3xl font-bold text-slate-900 mt-2">{users.filter(u => u.role === UserRole.DOCTOR).length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-slate-500 text-xs font-bold uppercase">Total Volume</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">${totalRevenue.toFixed(2)}</p>
          </div>
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-slate-500 text-xs font-bold uppercase">Net Profit (30%)</h3>
              <p className="text-3xl font-bold text-primary-600 mt-2">${platformProfit.toFixed(2)}</p>
          </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-96">
              <h3 className="font-bold text-slate-800 mb-4">Cases by Specialty</h3>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
              </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-96">
              <h3 className="font-bold text-slate-800 mb-4">Top Doctors (Cases Closed)</h3>
               <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={doctorData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="cases" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
          </div>
      </div>

      {/* Recent Cases Log */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h3 className="font-bold text-slate-800">Recent Case Submissions</h3>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                   <div className="relative w-full sm:w-48">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                          <Filter className="h-4 w-4" />
                      </div>
                      <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-primary-500 outline-none appearance-none bg-white cursor-pointer"
                      >
                          <option value="ALL">All Statuses</option>
                          <option value={CaseStatus.OPEN}>Open</option>
                          <option value={CaseStatus.CLOSED}>Closed</option>
                          <option value={CaseStatus.PENDING_INFO}>Pending Info</option>
                      </select>
                  </div>
                  <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input 
                          type="text"
                          placeholder="Search patient or ID..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                      />
                  </div>
              </div>
          </div>
          <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 font-medium">
                      <tr>
                          <th className="px-6 py-3">Case ID</th>
                          <th className="px-6 py-3">Patient</th>
                          <th className="px-6 py-3">Specialty</th>
                          <th className="px-6 py-3">Status</th>
                          <th className="px-6 py-3">Doctor</th>
                          <th className="px-6 py-3">Date</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      {filteredCases.map(c => {
                          const doctor = users.find(u => u.id === c.assignedDoctorId || u.id === c.opinion?.doctorId);
                          return (
                            <tr key={c.id} className="hover:bg-slate-50 transition">
                                <td className="px-6 py-4 font-mono text-xs text-slate-400">#{c.id.slice(-6)}</td>
                                <td className="px-6 py-4 font-medium text-slate-900">{c.patientName}</td>
                                <td className="px-6 py-4">
                                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">
                                        {c.specialty}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                     <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                                        c.status === CaseStatus.OPEN ? 'bg-blue-100 text-blue-700' :
                                        c.status === CaseStatus.CLOSED ? 'bg-green-100 text-green-700' :
                                        'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {c.status === CaseStatus.OPEN && <Clock className="h-3 w-3" />}
                                        {c.status === CaseStatus.CLOSED && <CheckCircle className="h-3 w-3" />}
                                        {c.status === CaseStatus.PENDING_INFO && <AlertCircle className="h-3 w-3" />}
                                        {c.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-600">
                                    {doctor ? doctor.name : <span className="text-slate-400 italic">Unassigned</span>}
                                </td>
                                <td className="px-6 py-4 text-slate-500">
                                    {new Date(c.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                          )
                      })}
                      {filteredCases.length === 0 && (
                          <tr>
                              <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                  No cases found matching filters.
                              </td>
                          </tr>
                      )}
                  </tbody>
              </table>
          </div>
      </div>
    </div>
  );
};

export default AdminDashboard;