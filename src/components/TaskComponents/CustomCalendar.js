// components/TaskComponents/CustomCalendar.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react-native';

const calendarTheme = {
  backgroundColor: '#ffffff',
  calendarBackground: '#ffffff',
  textSectionTitleColor: '#64748b',
  selectedDayBackgroundColor: '#6366f1',
  selectedDayTextColor: '#ffffff',
  todayTextColor: '#6366f1',
  dayTextColor: '#1e293b',
  textDisabledColor: '#cbd5e1',
  dotColor: '#6366f1',
  monthTextColor: '#1e293b',
  textMonthFontWeight: 'bold',
  arrowColor: '#6366f1',
  'stylesheet.calendar.header': {
    week: {
      marginTop: 5,
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
  },
  'stylesheet.day.basic': {
    base: {
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
    },
    selected: {
      borderRadius: 22,
      backgroundColor: '#6366f1',
    },
    today: {
      borderRadius: 22,
      borderWidth: 1,
      borderColor: '#6366f1',
    },
  },
};

export default function CustomCalendar({ selectedDate, onDayPress, markedDates }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarHeight, setCalendarHeight] = useState(new Animated.Value(350)); // Înălțimea inițială
  const [isExpanded, setIsExpanded] = useState(true);

  // Handler pentru schimbarea lunii
  const handleMonthChange = (month) => {
    setCurrentMonth(new Date(month.timestamp));
  };

  // Funcție pentru a obține numele lunii și anul
  const getMonthYearString = () => {
    return currentMonth.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  // Funcție pentru a comuta vizibilitatea calendarului
  const toggleCalendarHeight = () => {
    const toValue = isExpanded ? 80 : 350; // Înălțimile pentru stările expandat/restrâns
    
    Animated.spring(calendarHeight, {
      toValue,
      useNativeDriver: false,
      friction: 10,
    }).start();
    
    setIsExpanded(!isExpanded);
  };

  // Funcții pentru a naviga la luna următoare/anterioară
  const goToPreviousMonth = () => {
    const newDate = new Date(currentMonth.setMonth(currentMonth.getMonth() - 1));
    setCurrentMonth(newDate);
    // Aici poți adăuga logica pentru a actualiza markedDates dacă e necesar
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentMonth.setMonth(currentMonth.getMonth() + 1));
    setCurrentMonth(newDate);
    // Aici poți adăuga logica pentru a actualiza markedDates dacă e necesar
  };

  // Funcție pentru a merge la ziua curentă
  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    onDayPress({ dateString: today.toISOString().split('T')[0] });
  };

  return (
    <Animated.View className="px-4" style={{ height: calendarHeight }}>
      <View className="bg-white rounded-2xl shadow-md overflow-hidden">
        {/* Header cu lună și controale */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
          <TouchableOpacity 
            onPress={toggleCalendarHeight}
            className="flex-row items-center"
          >
            <CalendarIcon size={20} color="#6366f1" />
            <Text className="ml-2 text-lg font-semibold text-gray-800">
              {getMonthYearString()}
            </Text>
          </TouchableOpacity>

          <View className="flex-row items-center">
            <TouchableOpacity 
              onPress={goToToday}
              className="px-3 py-1 bg-indigo-50 rounded-full mr-2"
            >
              <Text className="text-indigo-500 text-sm">Today</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={goToPreviousMonth} className="p-2">
              <ChevronLeft size={20} color="#6366f1" />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={goToNextMonth} className="p-2">
              <ChevronRight size={20} color="#6366f1" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Calendar */}
        {isExpanded && (
          <Calendar
            current={currentMonth.toISOString()}
            theme={calendarTheme}
            onDayPress={onDayPress}
            markedDates={markedDates}
            enableSwipeMonths={true}
            onMonthChange={handleMonthChange}
            hideExtraDays={true}
            hideArrows={true}
            style={{
              borderRadius: 16,
              padding: 10,
            }}
            // Personalizare pentru zilele cu evenimente
            dayComponent={({ date, state, marking }) => {
              const isSelected = marking?.selected;
              const hasEvents = marking?.marked;
              const isToday = date.dateString === new Date().toISOString().split('T')[0];
              
              return (
                <TouchableOpacity
                  onPress={() => onDayPress(date)}
                  className={`w-10 h-10 items-center justify-center rounded-full 
                    ${isSelected ? 'bg-indigo-500' : ''}
                    ${isToday && !isSelected ? 'border border-indigo-500' : ''}`}
                >
                  <Text
                    className={`text-base 
                      ${isSelected ? 'text-white' : 'text-gray-800'}
                      ${state === 'disabled' ? 'text-gray-300' : ''}
                      ${isToday && !isSelected ? 'text-indigo-500' : ''}`}
                  >
                    {date.day}
                  </Text>
                  {hasEvents && !isSelected && (
                    <View className="absolute bottom-1 w-1 h-1 rounded-full bg-indigo-500" />
                  )}
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>
    </Animated.View>
  );
}