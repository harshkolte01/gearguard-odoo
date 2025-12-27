'use client';

import { useMemo } from 'react';
import type { CalendarData } from '@/lib/types';
import CalendarDayCell from './CalendarDayCell';

interface MonthlyCalendarProps {
  calendarData: CalendarData;
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function MonthlyCalendar({ calendarData }: MonthlyCalendarProps) {
  const { month, year, requestsByDate } = calendarData;

  // Generate calendar grid
  const calendarGrid = useMemo(() => {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const today = new Date();
    const isCurrentMonth = today.getMonth() === month - 1 && today.getFullYear() === year;
    const todayDate = today.getDate();

    // Calculate days from previous month to show
    const prevMonthLastDay = new Date(year, month - 1, 0).getDate();
    const prevMonthDays = startingDayOfWeek;

    // Calculate total cells needed (must be multiple of 7)
    const totalCells = Math.ceil((daysInMonth + prevMonthDays) / 7) * 7;
    const nextMonthDays = totalCells - daysInMonth - prevMonthDays;

    const days = [];

    // Previous month days
    for (let i = prevMonthDays - 1; i >= 0; i--) {
      days.push({
        date: prevMonthLastDay - i,
        isCurrentMonth: false,
        isToday: false,
        dateKey: null,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({
        date: i,
        isCurrentMonth: true,
        isToday: isCurrentMonth && i === todayDate,
        dateKey,
      });
    }

    // Next month days
    for (let i = 1; i <= nextMonthDays; i++) {
      days.push({
        date: i,
        isCurrentMonth: false,
        isToday: false,
        dateKey: null,
      });
    }

    return days;
  }, [month, year]);

  return (
    <div className="calendar-container" style={{ display: 'block' }}>
      {/* Day names header */}
      <div className="calendar-day-headers" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {DAY_NAMES.map((day) => (
          <div key={day} className="calendar-day-header">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="calendar-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {calendarGrid.map((day, index) => (
          <CalendarDayCell
            key={index}
            date={day.date}
            isCurrentMonth={day.isCurrentMonth}
            isToday={day.isToday}
            requests={day.dateKey ? (requestsByDate[day.dateKey] || []) : []}
          />
        ))}
      </div>
    </div>
  );
}

