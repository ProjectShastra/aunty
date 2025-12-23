import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, getDaysInMonth, setMonth, setYear, startOfMonth, getDay, addMonths, subMonths } from 'date-fns';

interface OnboardingDatePickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export function OnboardingDatePicker({ value, onChange }: OnboardingDatePickerProps) {
  const currentYear = new Date().getFullYear();
  const [viewDate, setViewDate] = useState(() => {
    if (value) return value;
    return new Date(currentYear - 25, 0, 1); // Default to 25 years ago
  });

  const [showYearPicker, setShowYearPicker] = useState(false);

  const years = Array.from({ length: 80 }, (_, i) => currentYear - 18 - i);
  
  const daysInMonth = getDaysInMonth(viewDate);
  const firstDayOfMonth = getDay(startOfMonth(viewDate));
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => null);

  const handlePrevMonth = () => setViewDate(subMonths(viewDate, 1));
  const handleNextMonth = () => setViewDate(addMonths(viewDate, 1));

  const handleSelectDay = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    onChange(newDate);
  };

  const handleSelectYear = (year: number) => {
    setViewDate(setYear(viewDate, year));
    setShowYearPicker(false);
  };

  const isSelected = (day: number) => {
    if (!value) return false;
    return (
      value.getDate() === day &&
      value.getMonth() === viewDate.getMonth() &&
      value.getFullYear() === viewDate.getFullYear()
    );
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === viewDate.getMonth() &&
      today.getFullYear() === viewDate.getFullYear()
    );
  };

  const isFutureDate = (day: number) => {
    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    return date > new Date();
  };

  if (showYearPicker) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4"
      >
        <button
          type="button"
          onClick={() => setShowYearPicker(false)}
          className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to calendar
        </button>
        <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto p-2 bg-muted/30 rounded-xl">
          {years.map((year) => (
            <button
              key={year}
              type="button"
              onClick={() => handleSelectYear(year)}
              className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                viewDate.getFullYear() === year
                  ? 'bg-gradient-to-r from-aunty-pink to-aunty-purple text-white'
                  : 'bg-muted/50 text-foreground hover:bg-muted'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Month/Year header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        <button
          type="button"
          onClick={() => setShowYearPicker(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
        >
          <span className="font-semibold">
            {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
          </span>
        </button>

        <button
          type="button"
          onClick={handleNextMonth}
          className="p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {emptyDays.map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        {days.map((day) => {
          const disabled = isFutureDate(day);
          return (
            <motion.button
              key={day}
              type="button"
              disabled={disabled}
              onClick={() => handleSelectDay(day)}
              whileTap={{ scale: 0.9 }}
              className={`aspect-square rounded-lg text-sm font-medium transition-all flex items-center justify-center ${
                isSelected(day)
                  ? 'bg-gradient-to-r from-aunty-pink to-aunty-purple text-white glow-pink'
                  : disabled
                  ? 'text-muted-foreground/30 cursor-not-allowed'
                  : isToday(day)
                  ? 'bg-muted text-primary border border-primary/30'
                  : 'bg-muted/30 text-foreground hover:bg-muted'
              }`}
            >
              {day}
            </motion.button>
          );
        })}
      </div>

      {value && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center pt-2"
        >
          <p className="text-sm text-muted-foreground">
            Born on{' '}
            <span className="text-primary font-semibold">
              {format(value, 'MMMM d, yyyy')}
            </span>
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
