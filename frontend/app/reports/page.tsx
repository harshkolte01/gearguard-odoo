'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, userStorage } from '@/lib/auth';
import { useRequestsByTeam, useRequestsByCategory } from '@/lib/hooks/useReports';
import type { User, ReportFilters } from '@/lib/types';
import Navigation from '@/components/dashboard/Navigation';
import ReportFiltersComponent from '@/components/reports/ReportFilters';
import RequestsByTeamChart from '@/components/reports/RequestsByTeamChart';
import RequestsByCategoryChart from '@/components/reports/RequestsByCategoryChart';

export default function ReportsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ReportFilters>({
    startDate: undefined,
    endDate: undefined,
    state: [],
  });

  // Check authentication and role
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const userData = userStorage.get();
    if (userData) {
      // Only admin, manager, and technician can access reports
      if (userData.role === 'portal') {
        router.push('/');
        return;
      }
      setUser(userData);
    }
    setIsLoading(false);
  }, [router]);

  // Fetch report data
  const {
    data: teamData,
    loading: teamLoading,
    error: teamError,
    refetch: refetchTeam,
  } = useRequestsByTeam(filters, !isLoading && user !== null);

  const {
    data: categoryData,
    loading: categoryLoading,
    error: categoryError,
    refetch: refetchCategory,
  } = useRequestsByCategory(filters, !isLoading && user !== null);

  const handleFilterChange = (newFilters: ReportFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      startDate: undefined,
      endDate: undefined,
      state: [],
    });
  };

  const handleLogout = () => {
    const { tokenStorage } = require('@/lib/auth');
    tokenStorage.remove();
    userStorage.remove();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="dashboard-header-content">
            <div className="dashboard-logo">
              <h1>GEARGUARD</h1>
            </div>
          </div>
        </header>
        <Navigation activeTab="reporting" />
        <main className="dashboard-main">
          <div className="reports-loading">
            <div className="loading-spinner"></div>
            <p>Loading reports...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-logo">
            <h1>GEARGUARD</h1>
          </div>
          <div className="dashboard-user-menu">
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-role">{user.role}</span>
            </div>
            <button onClick={handleLogout} className="btn btn-ghost">
              Logout
            </button>
          </div>
        </div>
      </header>

      <Navigation activeTab="reporting" userRole={user.role} />

      <main className="dashboard-main">
        <div className="reports-header">
          <div className="reports-header-content">
            <h2 className="reports-title">Analytics & Reports</h2>
            <p className="reports-subtitle">
              View maintenance request statistics grouped by team and equipment category
            </p>
          </div>
        </div>

        <ReportFiltersComponent
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {(teamError || categoryError) && (
          <div className="alert alert-error" style={{ marginBottom: '2rem' }}>
            <strong>Error loading reports:</strong> {teamError || categoryError}
            <button
              onClick={() => {
                refetchTeam();
                refetchCategory();
              }}
              className="btn btn-ghost"
              style={{ marginLeft: '1rem' }}
            >
              Retry
            </button>
          </div>
        )}

        <div className="reports-grid">
          <div className="report-card">
            <div className="report-header">
              <div className="report-header-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div className="report-header-text">
                <h3 className="report-title">Requests by Team</h3>
                <p className="report-description">
                  Total requests handled by each maintenance team
                </p>
              </div>
            </div>
            <RequestsByTeamChart data={teamData} loading={teamLoading} />
          </div>

          <div className="report-card">
            <div className="report-header">
              <div className="report-header-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </div>
              <div className="report-header-text">
                <h3 className="report-title">Requests by Category</h3>
                <p className="report-description">
                  Distribution of requests across equipment categories
                </p>
              </div>
            </div>
            <RequestsByCategoryChart data={categoryData} loading={categoryLoading} />
          </div>
        </div>
      </main>
    </div>
  );
}

