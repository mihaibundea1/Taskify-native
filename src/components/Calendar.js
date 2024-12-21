// Calendar.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday, 
  startOfWeek, 
  endOfWeek 
} from 'date-fns';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function Calendar({ 
  selectedDate, 
  currentMonth, 
  onDateSelect, 
  tasks, 
  onPrevMonth, 
  onNextMonth 
}) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const hasTasksOnDate = (date) => {
    return tasks.some(task => isSameDay(new Date(task.date), date));
  };

  return (
    <View className="bg-white rounded-xl shadow-sm p-4">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-xl font-semibold text-gray-900">
          {format(currentMonth, 'MMMM yyyy')}
        </Text>
        
        <View className="flex-row space-x-2">
          <TouchableOpacity
            onPress={onPrevMonth}
            className="p-2 bg-gray-100 rounded-lg"
          >
            <ChevronLeft size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onNextMonth}
            className="p-2 bg-gray-100 rounded-lg"
          >
            <ChevronRight size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-row mb-2">
        {WEEKDAYS.map((day) => (
          <View key={day} className="flex-1 items-center">
            <Text className="text-sm font-medium text-gray-500">
              {day}
            </Text>
          </View>
        ))}
      </View>

      <View className="flex-row flex-wrap">
        {days.map((day, idx) => {
          const hasTasks = hasTasksOnDate(day);
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isCurrentDay = isToday(day);

          return (
            <TouchableOpacity
              key={day.toString()}
              onPress={() => onDateSelect(day)}
              className={`w-${100/7}% aspect-square items-center justify-center
                ${!isCurrentMonth ? 'opacity-30' : ''}
                ${isSelected ? 'bg-blue-100' : ''}
                ${isCurrentDay ? 'border border-blue-400' : ''}`}
            >
              <View className="relative">
                <Text className={`text-center
                  ${isSelected ? 'text-blue-600 font-medium' : 'text-gray-900'}
                  ${isCurrentDay ? 'font-bold' : ''}`}
                >
                  {format(day, 'd')}
                </Text>
                {hasTasks && (
                  <View className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}