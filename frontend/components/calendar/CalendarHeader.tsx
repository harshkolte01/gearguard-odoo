'use client';

import Button from '@/components/ui/Button';

interface CalendarHeaderProps {
  month: number;
  year: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function CalendarHeader({
  month,
  year,
  onPrevMonth,
  onNextMonth,
  onToday,
}: CalendarHeaderProps) {
  return (
    <div className="calendar-header">
      <div className="calendar-header-title">
        <h2 className="calendar-month-year">
          {MONTH_NAMES[month - 1]} {year}
        </h2>
      </div>

      <div className="calendar-header-controls">
        <Button
          variant="ghost"
          onClick={onToday}
          className="calendar-today-btn"
        >
          Today
        </Button>
        
        <div className="calendar-nav-buttons">
          <button
            onClick={onPrevMonth}
            className="calendar-nav-btn calendar-nav-prev"
            aria-label="Previous month"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          
          <button
            onClick={onNextMonth}
            className="calendar-nav-btn calendar-nav-next"
            aria-label="Next month"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}


