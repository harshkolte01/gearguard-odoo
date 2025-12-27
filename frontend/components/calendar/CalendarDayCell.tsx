'use client';

import type { MaintenanceRequest } from '@/lib/types';
import ScheduledRequestCard from './ScheduledRequestCard';

interface CalendarDayCellProps {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  requests: MaintenanceRequest[];
}

export default function CalendarDayCell({
  date,
  isCurrentMonth,
  isToday,
  requests,
}: CalendarDayCellProps) {
  return (
    <div
      className={`calendar-day-cell ${
        !isCurrentMonth ? 'calendar-day-other-month' : ''
      } ${isToday ? 'calendar-day-today' : ''}`}
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      <div className="calendar-day-number">
        {date}
        {isToday && <span className="calendar-today-dot"></span>}
      </div>

      <div className="calendar-day-requests">
        {requests.length === 0 ? (
          <div className="calendar-empty-day">
            <span className="calendar-empty-text">No scheduled work</span>
          </div>
        ) : (
          <>
            {requests.map((request) => (
              <ScheduledRequestCard key={request.id} request={request} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

