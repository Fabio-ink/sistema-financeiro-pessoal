import React, { useState, useEffect, useRef } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const DatePicker = ({ label, value, onChange, className = '', ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value));
    } else {
        setSelectedDate(null);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const onDateClick = (day) => {
    setSelectedDate(day);
    onChange({ target: { value: format(day, 'yyyy-MM-dd'), name: props.name } });
    setIsOpen(false);
  };

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-4 px-2">
        <button
          type="button"
          onClick={prevMonth}
          className="p-1 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-sm font-semibold text-white capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
        </div>
        <button
          type="button"
          onClick={nextMonth}
          className="p-1 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const dateFormat = "EEEEE"; // S, T, Q, Q, S, S, D
    const startDate = startOfWeek(currentMonth, { weekStartsOn: 0 });

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="text-xs font-medium text-gray-500 text-center py-1 uppercase" key={i}>
          {format(addDays(startDate, i), dateFormat, { locale: ptBR })}
        </div>
      );
    }

    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        
        const isSelected = selectedDate && isSameDay(day, selectedDate);
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isTodayDate = isToday(day);

        days.push(
          <div
            className={`relative p-1 w-full aspect-square flex items-center justify-center cursor-pointer rounded-full transition-all duration-200
              ${!isCurrentMonth ? "text-gray-600" : "text-gray-300 hover:bg-white/10 hover:text-white"}
              ${isSelected ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20 font-bold" : ""}
              ${isTodayDate && !isSelected ? "border border-brand-primary/50 text-brand-primary" : ""}
            `}
            key={day}
            onClick={() => onDateClick(cloneDay)}
          >
            <span className="text-sm">{formattedDate}</span>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-1" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="space-y-1">{rows}</div>;
  };

  return (
    <div className={twMerge("relative", className)} ref={containerRef}>
       {label && (
        <label className="block text-sm font-medium text-text-secondary mb-2 ml-1">
          {label}
        </label>
      )}
      <div
        className="relative cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center w-full p-3 bg-brand-dark border border-brand-border rounded-xl text-white transition-all group-hover:border-gray-500 focus-within:border-brand-primary focus-within:ring-1 focus-within:ring-brand-primary">
            <CalendarIcon className="w-5 h-5 text-gray-400 mr-3 group-hover:text-white transition-colors" />
            <span className={twMerge("text-sm", !selectedDate && "text-text-muted")}>
                {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : 'Selecione uma data'}
            </span>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 p-4 bg-[#1E1E2E] border border-gray-700 rounded-2xl shadow-xl w-[320px] animate-in fade-in zoom-in-95 duration-200">
          {renderHeader()}
          {renderDays()}
          {renderCells()}
        </div>
      )}
    </div>
  );
};

export default DatePicker;
