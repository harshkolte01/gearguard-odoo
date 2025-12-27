'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { tokenStorage, userStorage, isAuthenticated } from '@/lib/auth';
import { useTeams } from '@/lib/hooks/useTeams';
import type { User } from '@/lib/types';
import Navigation from '@/components/dashboard/Navigation';
import Button from '@/components/ui/Button';

export default function TeamsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { teams, loading: teamsLoading, error: teamsError, refetch } = useTeams();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const userData = userStorage.get();
    if (userData) {
      // Block portal users from accessing teams page
      if (userData.role === 'portal') {
        router.push('/');
        return;
      }
      setUser(userData);
    }
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
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
        <Navigation activeTab="teams" />
        <main className="dashboard-main">
          <div className="loading-state">Loading...</div>
        </main>
      </div>
    );
  }

  const getRoleMessage = () => {
    if (user?.role === 'admin' || user?.role === 'manager') {
      return 'View and manage all maintenance teams in your organization';
    }
    return 'View your assigned maintenance teams and team members';
  };

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

      <Navigation activeTab="teams" />

      <main className="dashboard-main">
        <div className="dashboard-welcome">
          <h2 className="welcome-title">Teams</h2>
          <p className="welcome-subtitle">{getRoleMessage()}</p>
        </div>

        {teamsError ? (
          <div className="alert alert-error" style={{ marginBottom: '2rem' }}>
            <strong>Error loading teams:</strong> {teamsError}
            <button onClick={() => refetch()} className="btn btn-ghost" style={{ marginLeft: '1rem' }}>
              Retry
            </button>
          </div>
        ) : teamsLoading ? (
          <div className="teams-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="team-card skeleton-card">
                <div className="skeleton-title"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-text"></div>
              </div>
            ))}
          </div>
        ) : teams.length === 0 ? (
          <div className="empty-state">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <h3 className="empty-state-title">No Teams Found</h3>
            <p className="empty-state-text">
              {user?.role === 'technician' 
                ? 'You are not assigned to any teams yet. Please contact your administrator.'
                : 'No teams have been created yet.'}
            </p>
          </div>
        ) : (
          <div className="teams-grid">
            {teams.map((team) => (
              <div key={team.id} className="team-card">
                <div className="team-card-header">
                  <h3 className="team-card-title">{team.name}</h3>
                  <span className="team-member-badge">
                    {team.members?.length || 0} {team.members?.length === 1 ? 'member' : 'members'}
                  </span>
                </div>
                
                <div className="team-members-list">
                  {team.members && team.members.length > 0 ? (
                    team.members.map((member) => (
                      <div key={member.id} className="team-member-item">
                        <div className="member-avatar">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="member-info">
                          <div className="member-name">{member.name}</div>
                          <div className="member-details">
                            <span className="member-role">{member.role}</span>
                            <span className="member-separator">•</span>
                            <span className="member-email">{member.email}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="team-no-members">No members assigned</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <style jsx>{`
        .teams-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 1.5rem;
          animation: fadeInUp var(--transition-slow) 0.2s backwards;
        }

        .team-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          padding: 2rem;
          transition: all var(--transition-base);
        }

        .team-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .skeleton-card {
          padding: 2rem;
          min-height: 200px;
        }

        .skeleton-title {
          height: 24px;
          width: 60%;
          background: linear-gradient(90deg, #e0e0dc 25%, #f0f0ec 50%, #e0e0dc 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          margin-bottom: 1rem;
        }

        .skeleton-text {
          height: 16px;
          width: 80%;
          background: linear-gradient(90deg, #e0e0dc 25%, #f0f0ec 50%, #e0e0dc 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          margin-bottom: 0.75rem;
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .team-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .team-card-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.01em;
        }

        .team-member-badge {
          display: inline-block;
          padding: 0.375rem 0.75rem;
          background: var(--bg-primary);
          color: var(--text-secondary);
          font-size: 0.875rem;
          font-weight: 600;
          border-radius: 4px;
          border: 1px solid var(--border-subtle);
        }

        .team-members-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .team-member-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem;
          background: var(--bg-primary);
          border-radius: 4px;
          transition: background var(--transition-fast);
        }

        .team-member-item:hover {
          background: var(--border-subtle);
        }

        .member-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--accent-rust);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1rem;
          flex-shrink: 0;
        }

        .member-info {
          flex: 1;
          min-width: 0;
        }

        .member-name {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }

        .member-details {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .member-role {
          text-transform: capitalize;
          color: var(--accent-rust);
          font-weight: 600;
        }

        .member-separator {
          color: var(--text-tertiary);
        }

        .member-email {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .team-no-members {
          text-align: center;
          padding: 2rem;
          color: var(--text-tertiary);
          font-style: italic;
        }

        .alert {
          padding: 1rem 1.5rem;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .alert-error {
          background: #fee;
          border: 1px solid #fcc;
          color: var(--error);
        }

        .loading-state {
          text-align: center;
          padding: 4rem 2rem;
          color: var(--text-secondary);
          font-size: 1.125rem;
        }

        @media (max-width: 968px) {
          .teams-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .team-card {
            padding: 1.5rem;
          }

          .team-card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }

          .member-email {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}


