'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { tokenStorage, userStorage, isAuthenticated } from '@/lib/auth';
import { useDashboardKPIs, useDashboardRequests, useMyMaintenanceRequests, useRequestFilters } from '@/lib/hooks/useDashboard';
import type { User, RequestFilters } from '@/lib/types';
import KPICards from '@/components/dashboard/KPICards';
import Navigation from '@/components/dashboard/Navigation';
import FilterBar from '@/components/dashboard/FilterBar';
import RequestsTable from '@/components/dashboard/RequestsTable';
import KanbanBoard from '@/components/kanban/KanbanBoard';
import Pagination from '@/components/dashboard/Pagination';
import CreateRequestModal from '@/components/requests/CreateRequestModal';
import EmptyState from '@/components/requests/EmptyState';
import Button from '@/components/ui/Button';
import { SkeletonKPICards, SkeletonDashboard, SkeletonKanbanBoard } from '@/components/ui/Skeleton';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [view, setView] = useState<'table' | 'kanban'>('table');

  const { filters, updateFilter, resetFilters } = useRequestFilters();

  // Fetch different data based on user role
  const isPortalUser = user?.role === 'portal';

  const {
    data: kpisData,
    loading: kpisLoading,
    error: kpisError,
    refetch: refetchKPIs,
  } = useDashboardKPIs(!isPortalUser, true, 60000); // Only fetch KPIs if NOT portal user
  
  // Dashboard requests for admin/manager/technician
  const {
    data: dashboardRequestsData,
    loading: dashboardRequestsLoading,
    error: dashboardRequestsError,
    refetch: refetchDashboardRequests,
  } = useDashboardRequests(
    filters, 
    view === 'kanban' ? 1 : currentPage, 
    view === 'kanban' ? 1000 : limit, // Fetch all for kanban view
    !isPortalUser // Only fetch if not portal user
  );

  // My maintenance requests for portal users
  const {
    data: myRequestsData,
    loading: myRequestsLoading,
    error: myRequestsError,
    refetch: refetchMyRequests,
  } = useMyMaintenanceRequests(
    filters,
    view === 'kanban' ? 1 : currentPage,
    view === 'kanban' ? 1000 : limit, // Fetch all for kanban view
    isPortalUser // Only fetch if portal user
  );

  // Use appropriate data based on role
  const requestsData = isPortalUser ? myRequestsData : dashboardRequestsData;
  const requestsLoading = isPortalUser ? myRequestsLoading : dashboardRequestsLoading;
  const requestsError = isPortalUser ? myRequestsError : dashboardRequestsError;
  const refetchRequests = isPortalUser ? refetchMyRequests : refetchDashboardRequests;

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const userData = userStorage.get();
    if (userData) {
      // Redirect admin to admin dashboard
      if (userData.role === 'admin') {
        router.push('/admin');
        return;
      }
      setUser(userData);
    }
    setIsLoading(false);
  }, [router]);

  // Separate effect for reading URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const equipmentId = params.get('equipment_id');
    const states = params.get('state');
    
    if (equipmentId) {
      updateFilter('equipment_id' as keyof RequestFilters, equipmentId);
    }
    if (states) {
      updateFilter('state' as keyof RequestFilters, states.split(','));
    }
  }, [updateFilter]);

  const handleLogout = () => {
    tokenStorage.remove();
    userStorage.remove();
    router.push('/login');
  };

  const handleFilterChange = (key: any, value: any) => {
    updateFilter(key, value);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    resetFilters();
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1);
  };

  const handleRequestClick = (request: any) => {
    router.push(`/requests/${request.id}`);
  };

  const handleCreateSuccess = () => {
    // Refetch requests after creating new one
    refetchRequests();
    if (!isPortalUser) {
      refetchKPIs();
    }
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
        <Navigation activeTab="dashboard" />
        <SkeletonDashboard includeKPIs={true} />
      </div>
    );
  }

  // Only show critical KPI errors for non-portal users (network errors, server errors)
  // Permission errors are expected and shouldn't block the UI
  if (kpisError && !isPortalUser) {
    return (
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="dashboard-header-content">
            <div className="dashboard-logo">
              <h1>GEARGUARD</h1>
            </div>
            <button onClick={handleLogout} className="btn btn-ghost">
              Logout
            </button>
          </div>
        </header>
        <main className="dashboard-main">
          <div className="alert alert-error">
            <strong>Error loading dashboard:</strong> {kpisError}
            <button onClick={() => refetchKPIs()} className="btn btn-ghost" style={{ marginLeft: '1rem' }}>
              Retry
            </button>
          </div>
        </main>
      </div>
    );
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
              <span className="user-name">{user?.name}</span>
              <span className="user-role">{user?.role}</span>
            </div>
            <button onClick={handleLogout} className="btn btn-ghost">
              Logout
            </button>
          </div>
        </div>
      </header>

      <Navigation activeTab="dashboard" userRole={user?.role} />

      <main className="dashboard-main">
        <div className="dashboard-welcome">
          <div className="dashboard-welcome-content">
            <h2 className="welcome-title">Welcome back, {user?.name?.split(' ')[0]}!</h2>
            <p className="welcome-subtitle">
              {user?.role === 'portal' 
                ? 'Track your maintenance requests and their progress'
                : 'Monitor equipment health and manage maintenance operations'
              }
            </p>
          </div>
          <div className="dashboard-welcome-actions">
            <Button
              variant="primary"
              onClick={() => setIsCreateModalOpen(true)}
              className="create-request-btn"
            >
              + Create Request
            </Button>
          </div>
        </div>

        {/* KPI Cards - Only show for non-portal users */}
        {!isPortalUser && (
          kpisLoading ? (
            <SkeletonKPICards count={3} />
          ) : kpisData ? (
            <KPICards data={kpisData} user={user!} />
          ) : null
        )}

        {/* Requests Section - All users can see their relevant requests */}
        <>
          {/* View Toggle */}
          <div className="view-toggle">
            <button
              className={`view-toggle-btn ${view === 'table' ? 'active' : ''}`}
              onClick={() => setView('table')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />
              </svg>
              Table
            </button>
            <button
              className={`view-toggle-btn ${view === 'kanban' ? 'active' : ''}`}
              onClick={() => setView('kanban')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="9" />
                <rect x="14" y="3" width="7" height="5" />
                <rect x="14" y="12" width="7" height="9" />
                <rect x="3" y="16" width="7" height="5" />
              </svg>
              Kanban
            </button>
          </div>

          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
            userRole={user?.role}
          />

          {requestsError ? (
            <div className="alert alert-error" style={{ marginBottom: '2rem' }}>
              <strong>Error loading requests:</strong> {requestsError}
              <button onClick={() => refetchRequests()} className="btn btn-ghost" style={{ marginLeft: '1rem' }}>
                Retry
              </button>
            </div>
          ) : requestsData?.requests.length === 0 && !requestsLoading ? (
            <EmptyState
              variant={filters.search || filters.state.length > 0 ? 'no-results' : 'no-requests'}
              onAction={
                filters.search || filters.state.length > 0
                  ? handleResetFilters
                  : () => setIsCreateModalOpen(true)
              }
            />
          ) : (
            <>
              {view === 'table' ? (
                <>
                  <RequestsTable
                    requests={requestsData?.requests || []}
                    loading={requestsLoading}
                    onRequestClick={handleRequestClick}
                    userRole={user?.role}
                  />

                  {requestsData?.pagination && requestsData.pagination.total > 0 && (
                    <Pagination
                      pagination={requestsData.pagination}
                      onPageChange={handlePageChange}
                      onLimitChange={handleLimitChange}
                    />
                  )}
                </>
              ) : requestsLoading ? (
                <SkeletonKanbanBoard />
              ) : (
                <KanbanBoard
                  requests={requestsData?.requests || []}
                  loading={requestsLoading}
                  onRequestClick={handleRequestClick}
                  userRole={user?.role}
                  onRefetch={refetchRequests}
                />
              )}
            </>
          )}
        </>
      </main>

      {/* Create Request Modal */}
      <CreateRequestModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* Floating Action Button - Mobile only */}
      <button
        className="floating-action-button"
        onClick={() => setIsCreateModalOpen(true)}
        aria-label="Create Request"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    </div>
  );
}

