'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, userStorage, tokenStorage } from '@/lib/auth';
import { useTechnicians, useAdminTeams } from '@/lib/hooks/useAdmin';
import type { User, TechnicianDetail } from '@/lib/types';
import Navigation from '@/components/dashboard/Navigation';
import AdminStats from '@/components/admin/AdminStats';
import TechnicianTable from '@/components/admin/TechnicianTable';
import AddTechnicianModal from '@/components/admin/AddTechnicianModal';
import TeamAssignmentModal from '@/components/admin/TeamAssignmentModal';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState<TechnicianDetail | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    technicians,
    stats,
    loading: techLoading,
    error: techError,
    refetch: refetchTechnicians,
    createTechnician,
    updateTechnicianTeams,
  } = useTechnicians(!isLoading);

  const {
    teams,
    loading: teamsLoading,
    error: teamsError,
  } = useAdminTeams(!isLoading);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const userData = userStorage.get();
    if (!userData) {
      router.push('/login');
      return;
    }

    // Only admins can access this page
    if (userData.role !== 'admin') {
      router.push('/');
      return;
    }

    setUser(userData);
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    tokenStorage.remove();
    userStorage.remove();
    router.push('/login');
  };

  const handleAddTechnician = async (data: any) => {
    await createTechnician(data);
    setSuccessMessage(`${data.role === 'manager' ? 'Manager' : 'Technician'} created successfully!`);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const handleAssignTeams = (technician: TechnicianDetail) => {
    setSelectedTechnician(technician);
    setIsTeamModalOpen(true);
  };

  const handleUpdateTeams = async (technicianId: string, teamIds: string[]) => {
    await updateTechnicianTeams(technicianId, teamIds);
    setSuccessMessage('Team assignments updated successfully!');
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const handleViewDetails = (technician: TechnicianDetail) => {
    // For now, just show an alert - could navigate to detail page later
    alert(`Technician Details:\n\nName: ${technician.name}\nEmail: ${technician.email}\nRole: ${technician.role}\nTeams: ${technician.teams.map(t => t.name).join(', ') || 'None'}\nAssigned Requests: ${technician.assignedRequestsCount || 0}`);
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
        <Navigation activeTab="admin" userRole="admin" />
        <main className="dashboard-main">
          <div className="admin-loading">
            <div className="spinner"></div>
            <p>Loading admin dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-container admin-dashboard">
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

      <Navigation activeTab="admin" userRole="admin" />

      <main className="dashboard-main">
        <div className="admin-dashboard-header">
          <div className="admin-dashboard-title">
            <h2>System Administration</h2>
            <p className="admin-dashboard-subtitle">
              Manage technicians, assign teams, and oversee system operations
            </p>
          </div>
          <div className="admin-dashboard-actions">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn btn-primary"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
              Add Technician
            </button>
          </div>
        </div>

        {successMessage && (
          <div className="alert alert-success">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {successMessage}
          </div>
        )}

        {techError && (
          <div className="alert alert-error">
            <strong>Error loading technicians:</strong> {techError}
            <button onClick={() => refetchTechnicians()} className="btn btn-ghost" style={{ marginLeft: '1rem' }}>
              Retry
            </button>
          </div>
        )}

        {teamsError && (
          <div className="alert alert-warning">
            <strong>Warning:</strong> Unable to load teams. Team assignment may be unavailable.
          </div>
        )}

        {/* Statistics Cards */}
        {stats && !techLoading && (
          <AdminStats stats={stats} />
        )}

        {/* Technicians Table */}
        <div className="admin-content-section">
          <div className="admin-section-header">
            <h3>Technicians & Managers</h3>
            <p className="admin-section-subtitle">
              {technicians.length} total users
            </p>
          </div>

          <TechnicianTable
            technicians={technicians}
            loading={techLoading}
            onAssignTeams={handleAssignTeams}
            onViewDetails={handleViewDetails}
          />
        </div>
      </main>

      {/* Add Technician Modal */}
      <AddTechnicianModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddTechnician}
      />

      {/* Team Assignment Modal */}
      <TeamAssignmentModal
        isOpen={isTeamModalOpen}
        technician={selectedTechnician}
        teams={teams}
        onClose={() => {
          setIsTeamModalOpen(false);
          setSelectedTechnician(null);
        }}
        onSubmit={handleUpdateTeams}
      />
    </div>
  );
}


