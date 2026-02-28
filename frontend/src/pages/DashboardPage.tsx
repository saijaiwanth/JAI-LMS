import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import AppLayout from '../components/layout/AppLayout';
import * as dashboardService from '../services/dashboardService';
import * as leaveService from '../services/leaveService';
import { useAuth } from '../contexts/AuthContext';
import LeaveDetailsModal from '../components/LeaveDetailsModal';
import { format } from 'date-fns';
import './DashboardPage.css';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    Legend,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const formatStat = (num: number) => {
    if (isNaN(num)) return '00';
    return num < 10 ? `0${num}` : `${num}`;
};

// Colors for the donut chart
// not_applicable, in_progress, closed, differed, review, testing, fixed
const STATUS_COLORS: Record<string, string> = {
    not_applicable: '#9ca3af', // Gray
    in_progress: '#3c6ff2',    // Blue
    closed: '#1f2937',         // Dark Gray
    differed: '#f97316',       // Orange
    review: '#8b5cf6',         // Violet
    testing: '#ec4899',        // Pink
    fixed: '#10b981'           // Emerald
};
const DEFAULT_COLORS = ['#3c6ff2', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6b7280'];

const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch stats
    const { data: statsData } = useQuery('dashboardStats', dashboardService.getStats, {
        refetchOnWindowFocus: false,
        staleTime: 30000
    });

    // Fetch analytics
    const { data: analyticsData, isLoading: isAnalyticsLoading } = useQuery('dashboardAnalytics', dashboardService.getAnalytics, {
        refetchOnWindowFocus: false,
        staleTime: 30000
    });

    const stats = statsData?.breakdown || {};
    const weeklyTime = analyticsData?.weeklyTime || [];
    const workStatus = analyticsData?.workStatus || [];
    const leavesToday = analyticsData?.leavesToday || [];
    const upcomingLeaves = analyticsData?.upcomingLeaves || [];

    // Parse counts to numbers (backend sends strings for BigInt)
    const wt = weeklyTime[0] || {};
    const approvedCount = Number(wt.approved || 0);
    const submittedCount = Number(wt.submitted || 0);
    const lateCount = Number(wt.late || 0);
    const rejectedCount = Number(wt.rejected || 0);
    const notSubmittedCount = Number(wt.not_submitted || 0);

    const weeklyTimeChartData = [
        { name: 'Approved', value: approvedCount, color: '#10b981' },
        { name: 'Submitted', value: submittedCount, color: '#f59e0b' },
        { name: 'Late', value: lateCount, color: '#8b5cf6' },
        { name: 'Rejected', value: rejectedCount, color: '#ef4444' },
        { name: 'Not Submitted', value: notSubmittedCount, color: '#9ca3af' }
    ];

    const weeklyTimeLegendData = [
        { name: 'Approved', value: approvedCount, color: '#10b981' },
        { name: 'Submitted', value: submittedCount, color: '#f59e0b' },
        { name: 'Late', value: lateCount, color: '#8b5cf6' },
        { name: 'Rejected', value: rejectedCount, color: '#ef4444' },
        { name: 'Not Submitted', value: notSubmittedCount, color: '#9ca3af' }
    ];

    const handleStatClick = (role?: string) => {
        if (role) {
            navigate(`/employee-management?role=${role}`);
        } else {
            navigate('/employee-management');
        }
    };

    const handleLeaveClick = async (leave: any) => {
        try {
            const data = await leaveService.getLeaveRequest(leave.id);
            setSelectedRequest(data);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Failed to fetch leave details:', error);
        }
    };

    if (user?.role !== 'super_admin' && user?.role !== 'hr') {
        return null;
    }

    return (
        <AppLayout>
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <div>
                        <h1 className="page-title">Organization Dashboard</h1>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="leave-balances-section compact">
                    <div className="balance-cards-container">
                        <div className="balance-card" onClick={() => handleStatClick()}>
                            <span className="balance-label">Total Strength</span>
                            <span className="balance-value">{formatStat(statsData?.total || 0)}</span>
                        </div>
                        <div className="balance-separator"></div>
                        <div className="balance-card" onClick={() => handleStatClick('super_admin')}>
                            <span className="balance-label">Super Admins</span>
                            <span className="balance-value">{formatStat(stats.super_admin || 0)}</span>
                        </div>
                        <div className="balance-separator"></div>
                        <div className="balance-card" onClick={() => handleStatClick('hr')}>
                            <span className="balance-label">HR</span>
                            <span className="balance-value">{formatStat(stats.hr || 0)}</span>
                        </div>
                        <div className="balance-separator"></div>
                        <div className="balance-card" onClick={() => handleStatClick('manager')}>
                            <span className="balance-label">Managers</span>
                            <span className="balance-value">{formatStat(stats.manager || 0)}</span>
                        </div>
                        <div className="balance-separator"></div>
                        <div className="balance-card" onClick={() => handleStatClick('employee')}>
                            <span className="balance-label">Employees</span>
                            <span className="balance-value">{formatStat(stats.employee || 0)}</span>
                        </div>
                        <div className="balance-separator"></div>
                        <div className="balance-card" onClick={() => handleStatClick('intern')}>
                            <span className="balance-label">Interns</span>
                            <span className="balance-value">{formatStat(stats.intern || 0)}</span>
                        </div>
                    </div>
                </div>

                {/* Analytics Grid */}
                <div className="analytics-grid">
                    {/* 1. Employees On Leave Today */}
                    <div className="analytics-card">
                        <h3 className="card-title">
                            Absentees
                            <span className="count-badge">{leavesToday.length}</span>
                        </h3>
                        <div className="leave-list-container">
                            {isAnalyticsLoading ? (
                                <div className="loading-shimmer"></div>
                            ) : leavesToday.length > 0 ? (
                                <div className="leave-list">
                                    {leavesToday.map((leave: any) => (
                                        <div
                                            key={leave.id}
                                            className="leave-item clickable"
                                            onClick={() => handleLeaveClick(leave)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div className="employee-info">
                                                <div className="profile-img-container">
                                                    {leave.profile_photo_url ? (
                                                        <img src={leave.profile_photo_url} alt={leave.name} className="employee-img" />
                                                    ) : (
                                                        <div className="employee-initials">
                                                            {leave.name.split(' ').map((n: string) => n[0]).join('')}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="employee-details">
                                                    <span className="emp-name">{leave.name}</span>
                                                    <span className="emp-id">{leave.emp_id}</span>
                                                </div>
                                            </div>
                                            <div className="leave-badge">
                                                <span className={`badge ${leave.day_type}`}>
                                                    {leave.day_type.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="no-data-msg" style={{ flexDirection: 'column', gap: '12px' }}>
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                        <line x1="16" y1="2" x2="16" y2="6"></line>
                                        <line x1="8" y1="2" x2="8" y2="6"></line>
                                        <line x1="3" y1="10" x2="21" y2="10"></line>
                                        <path d="M9 16l2 2 4-4"></path>
                                    </svg>
                                    <span style={{ color: '#6b7280', fontSize: '14px', fontWeight: 500 }}>No employees on leave today</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 2. Previous Week Status */}
                    <div className="analytics-card">
                        <h3 className="card-title">
                            Previous Week Status

                        </h3>
                        <div className="chart-content-wrapper">
                            {isAnalyticsLoading ? (
                                <div className="loading-shimmer"></div>
                            ) : (
                                <>
                                    <div className="chart-display-area">
                                        <ResponsiveContainer width={250} height={250}>
                                            <PieChart>
                                                <Pie
                                                    data={weeklyTimeChartData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {weeklyTimeChartData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <RechartsTooltip
                                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                    formatter={(value: any, name: any) => [value, name]}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="legend-wrapper">
                                        {weeklyTimeLegendData.map((item, idx) => (
                                            <div key={idx} className="legend-item">
                                                <span className="legend-color-dot" style={{ backgroundColor: item.color }}></span>
                                                <span className="legend-text">{item.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* 3. Approved Work Status */}
                    <div className="analytics-card">
                        <h3 className="card-title">Approved Work Status</h3>
                        <div className="chart-content-wrapper">
                            {isAnalyticsLoading ? (
                                <div className="loading-shimmer"></div>
                            ) : (
                                <>
                                    <div className="chart-display-area">
                                        <ResponsiveContainer width={250} height={250}>
                                            <PieChart>
                                                <Pie
                                                    data={workStatus}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="count"
                                                    nameKey="work_status"
                                                >
                                                    {workStatus.map((entry: any, index: number) => (
                                                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.work_status] || DEFAULT_COLORS[index % DEFAULT_COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <RechartsTooltip
                                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                    formatter={(value: any, name: any) => [value, name.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())]}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="legend-wrapper">
                                        {workStatus.map((item: any, index: number) => (
                                            <div key={index} className="legend-item">
                                                <span className="legend-color-dot" style={{ backgroundColor: STATUS_COLORS[item.work_status] || DEFAULT_COLORS[index % DEFAULT_COLORS.length] }}></span>
                                                <span className="legend-text">{item.work_status.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Second Analytics Row */}
                <div className="analytics-grid" style={{ marginTop: '24px' }}>
                    {/* 4. Upcoming Leaves */}
                    <div className="analytics-card" style={{ gridColumn: 'span 3' }}>
                        <h3 className="card-title">
                            Upcoming Leaves
                            <span className="count-badge">{upcomingLeaves.length}</span>
                        </h3>
                        <div className="leave-list-container" style={{ maxHeight: '400px' }}>
                            {isAnalyticsLoading ? (
                                <div className="loading-shimmer"></div>
                            ) : upcomingLeaves.length > 0 ? (
                                <div className="leave-list horizontal">
                                    {upcomingLeaves.map((leave: any) => (
                                        <div
                                            key={leave.id}
                                            className="leave-item clickable"
                                            onClick={() => handleLeaveClick(leave)}
                                            style={{
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                padding: '12px',
                                                border: '1px solid #f1f5f9'
                                            }}
                                        >
                                            <div className="employee-info">
                                                <div className="profile-img-container">
                                                    {leave.profile_photo_url ? (
                                                        <img src={leave.profile_photo_url} alt={leave.name} className="employee-img" />
                                                    ) : (
                                                        <div className="employee-initials">
                                                            {leave.name.split(' ').map((n: string) => n[0]).join('')}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="employee-details">
                                                    <span className="emp-name">{leave.name}</span>
                                                    <span className="emp-id">{leave.emp_id}</span>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                                                <span className="leave-dates" style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
                                                    {format(new Date(leave.start_date), 'dd MMM')} - {format(new Date(leave.end_date), 'dd MMM')}
                                                </span>
                                                <div className="leave-badge">
                                                    <span className={`badge ${leave.leave_type}`}>
                                                        {leave.leave_type.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="no-data-msg" style={{ flexDirection: 'column', gap: '12px', height: '150px' }}>
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                    <span style={{ color: '#6b7280', fontSize: '14px', fontWeight: 500 }}>No upcoming leaves scheduled</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {selectedRequest && (
                    <LeaveDetailsModal
                        isOpen={isModalOpen}
                        onClose={() => {
                            setIsModalOpen(false);
                            setSelectedRequest(null);
                        }}
                        leaveRequest={selectedRequest}
                        userRole={user?.role || ''}
                        onApprove={() => { }}
                        onReject={() => { }}
                    />
                )}
            </div>
        </AppLayout>
    );
};

export default DashboardPage;
