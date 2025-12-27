'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, userStorage } from '@/lib/auth';
import { useCalendarData } from '@/lib/hooks/useCalendar';
import type { User } from '@/lib/types';
import CalendarHeader from '@/components/calendar/CalendarHeader';
import TechnicianFilter from '@/components/calendar/TechnicianFilter';
import MonthlyCalendar from '@/components/calendar/MonthlyCalendar';
import Skeleton from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';

export default function CalendarPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTechnicianId, setSelectedTechnicianId] = useState<string | null>(null);

  const month = currentDate.getMonth() + 1; // 1-12
  const year = currentDate.getFullYear();

  // Fetch calendar data
  const { data: calendarData, loading: calendarLoading, error } = useCalendarData(
    month,
    year,
    selectedTechnicianId || undefined
  );

  // Check authentication and role
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const userData = userStorage.get();
    if (userData) {
      // Portal users cannot access calendar
      if (userData.role === 'portal') {
        router.push('/');
        return;
      }
      setUser(userData);
    }
    setIsLoading(false);
  }, [router]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 2, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleLogout = () => {
    userStorage.remove();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-main">
          <Skeleton height="4rem" className="skeleton-mb" />
          <Skeleton height="600px" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-logo">
            <h1 className="logo-text">GEARGUARD</h1>
          </div>

          <div className="dashboard-header-actions">
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-role">{user.role.toUpperCase()}</span>
            </div>
            <Button variant="ghost" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="dashboard-navigation">
        <div className="nav-tabs">
          <button
            className="nav-tab"
            onClick={() => router.push('/')}
          >
            Dashboard
          </button>
          <button className="nav-tab nav-tab-active">
            Maintenance Calendar
          </button>
          <button
            className="nav-tab"
            onClick={() => router.push('/')}
          >
            Equipment
          </button>
          <button
            className="nav-tab"
            onClick={() => router.push('/')}
          >
            Reporting
          </button>
          <button
            className="nav-tab"
            onClick={() => router.push('/')}
          >
            Teams
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="dashboard-main" style={{ maxWidth: '100%', width: '100%' }}>
        <div className="calendar-page-header">
          <div>
            <h2 className="calendar-page-title">Maintenance Calendar</h2>
            <p className="calendar-page-subtitle">
              {user.role === 'technician'
                ? 'View your scheduled maintenance work'
                : 'Schedule and track maintenance activities'}
            </p>
          </div>

          {/* Technician Filter (only for managers/admins) */}
          <TechnicianFilter
            user={user}
            selectedTechnicianId={selectedTechnicianId}
            onTechnicianChange={setSelectedTechnicianId}
          />
        </div>

        {/* Calendar Header with Navigation */}
        <CalendarHeader
          month={month}
          year={year}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onToday={handleToday}
        />

        {/* Calendar Loading State */}
        {calendarLoading && (
          <div className="calendar-loading">
            <Skeleton height="600px" />
          </div>
        )}

        {/* Calendar Error State */}
        {error && !calendarLoading && (
          <div className="calendar-error">
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <h3 className="empty-state-title">Failed to Load Calendar</h3>
              <p className="empty-state-message">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Calendar Grid */}
        {calendarData && !calendarLoading && !error && (
          <div style={{ width: '100%', overflow: 'auto' }}>
            <MonthlyCalendar calendarData={calendarData} />

            {/* Summary */}
            <div className="calendar-summary">
              <p className="calendar-summary-text">
                {calendarData.totalRequests === 0 ? (
                  'No scheduled maintenance for this month'
                ) : (
                  <>
                    <strong>{calendarData.totalRequests}</strong> maintenance{' '}
                    {calendarData.totalRequests === 1 ? 'request' : 'requests'} scheduled for{' '}
                    {new Date(year, month - 1).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </>
                )}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

