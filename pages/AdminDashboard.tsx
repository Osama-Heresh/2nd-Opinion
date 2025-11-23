
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { UserRole, CaseStatus } from '../types';
import { Trash2, FileText, CheckCircle, Clock, AlertCircle, Search, Filter, Users, XCircle, UserCheck } from 'lucide-react';

const AdminDashboard = () => {
  const { users, cases, transactions, resetDemo, updateUserStatus, deleteUser, t } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'users'>('overview');
  
  // Overview State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Users Tab State
  const [userSearch, setUserSearch] = useState('');

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

  // Filtered cases for table
  const filteredCases = [...cases]
    .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .filter(c => {
      const matchesSearch = c.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            c.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

  // User Management Filtering
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">{t('admin.title')}</h1>
            <div className="flex gap-4 mt-4">
                <button 
                    onClick={() => setActiveTab('overview')}
                    className={`pb-2 text-sm font-bold border-b-2 transition ${activeTab === 'overview' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                    {t('admin.tab.overview')}
                </button>
                <button 
                    onClick={() => setActiveTab('users')}
                    className={`pb-2 text-sm font-bold border-b-2 transition ${activeTab === 'users' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                    {t('admin.tab.users')}
                </button>
            </div>
        </div>
        <button 
            onClick={resetDemo}
            className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg text-sm font-medium transition"
        >
            <Trash2 className="h-4 w-4" />
            {t('admin.reset')}
        </button>
      </div>
      
      {activeTab === 'overview' ? (
      <>
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-slate-500 text-xs font-bold uppercase">{t('admin.kpi.totalCases')}</h3>
                <p className="text-3xl font-bold text-slate-900 mt-2">{cases.length}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-slate-500 text-xs font-bold uppercase">{t('admin.kpi.activeDoctors')}</h3>
                <p className="text-3xl font-bold text-slate-900 mt-2">{users.filter(u => u.role === UserRole.DOCTOR).length}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-slate-500 text-xs font-bold uppercase">{t('admin.kpi.volume')}</h3>
                <p className="text-3xl font-bold text-green-600 mt-2">${totalRevenue.toFixed(2)}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-slate-500 text-xs font-bold uppercase">{t('admin.kpi.profit')}</h3>
                <p className="text-3xl font-bold text-primary-600 mt-2">${platformProfit.toFixed(2)}</p>
            </div>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-96">
                <h3 className="font-bold text-slate-800 mb-4">{t('admin.chart.specialty')}</h3>
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
                <h3 className="font-bold text-slate-800 mb-4">{t('admin.chart.topDocs')}</h3>
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
                <h3 className="font-bold text-slate-800">{t('admin.table.title')}</h3>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative w-full sm:w-48">
                        <div className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <Filter className="h-4 w-4" />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full pl-9 rtl:pl-4 rtl:pr-9 pr-4 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-primary-500 outline-none appearance-none bg-white cursor-pointer"
                        >
                            <option value="ALL">{t('admin.filter.all')}</option>
                            <option value={CaseStatus.OPEN}>{t('status.open')}</option>
                            <option value={CaseStatus.CLOSED}>{t('status.closed')}</option>
                            <option value={CaseStatus.PENDING_INFO}>{t('status.pendingInfo')}</option>
                        </select>
                    </div>
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input 
                            type="text"
                            placeholder={t('admin.searchPlaceholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 rtl:pl-4 rtl:pr-9 pr-4 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                        <tr>
                            <th className="px-6 py-3">{t('admin.th.caseId')}</th>
                            <th className="px-6 py-3">{t('admin.th.patient')}</th>
                            <th className="px-6 py-3">{t('admin.th.specialty')}</th>
                            <th className="px-6 py-3">{t('admin.th.status')}</th>
                            <th className="px-6 py-3">{t('admin.th.doctor')}</th>
                            <th className="px-6 py-3">{t('admin.th.date')}</th>
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
                                            {c.status === CaseStatus.OPEN ? t('status.open') : 
                                            c.status === CaseStatus.CLOSED ? t('status.closed') : 
                                            c.status === CaseStatus.PENDING_INFO ? t('status.pendingInfo') : c.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {doctor ? doctor.name : <span className="text-slate-400 italic">{t('admin.unassigned')}</span>}
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
                                    {t('admin.noCases')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </>
      ) : (
      <>
        {/* Users Management */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Users className="h-5 w-5 text-slate-500" />
                    {t('admin.tab.users')}
                </h3>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                        type="text"
                        placeholder={t('admin.users.search')}
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                        <tr>
                            <th className="px-6 py-3">User</th>
                            <th className="px-6 py-3">Role</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Joined</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredUsers.map(u => (
                            <tr key={u.id} className="hover:bg-slate-50 transition">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img src={u.avatarUrl || 'https://via.placeholder.com/40'} className="w-8 h-8 rounded-full" alt="" />
                                        <div>
                                            <div className="font-bold text-slate-900">{u.name}</div>
                                            <div className="text-xs text-slate-500">{u.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                        u.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-700' :
                                        u.role === UserRole.DOCTOR ? 'bg-blue-100 text-blue-700' :
                                        'bg-slate-100 text-slate-700'
                                    }`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {u.isApproved ? (
                                        <span className="flex items-center gap-1 text-green-600 font-medium text-xs">
                                            <CheckCircle className="h-3 w-3" /> {t('admin.users.active')}
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-orange-600 font-medium text-xs">
                                            <AlertCircle className="h-3 w-3" /> {t('admin.users.pending')}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-slate-500">
                                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {!u.isApproved && (
                                            <button 
                                                onClick={() => updateUserStatus(u.id, true)}
                                                className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded hover:bg-green-100 border border-green-200 font-bold"
                                            >
                                                {t('admin.users.approve')}
                                            </button>
                                        )}
                                        {u.isApproved && u.role === UserRole.DOCTOR && (
                                             <button 
                                                onClick={() => updateUserStatus(u.id, false)}
                                                className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded hover:bg-orange-100 border border-orange-200 font-bold"
                                            >
                                                Suspend
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => deleteUser(u.id)}
                                            className="text-slate-400 hover:text-red-500 transition p-1"
                                            title={t('admin.users.delete')}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </>
      )}
    </div>
  );
};

export default AdminDashboard;
