// components/TaskComponents/CustomCalendar.js
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


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
            marginTop: hp(0.6),
            flexDirection: 'row',
            justifyContent: 'space-around',
        },
    },
    'stylesheet.day.basic': {
        base: {
            width: wp(11),
            height: wp(11),
            alignItems: 'center',
            justifyContent: 'center',
        },
        selected: {
            borderRadius: wp(5.5),
            backgroundColor: '#6366f1',
        },
        today: {
            borderRadius: wp(5.5),
            borderWidth: 1,
            borderColor: '#6366f1',
        },
    },
};

export default function CustomCalendar({ selectedDate, onDayPress, markedDates, maxHeight }) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [calendarHeight] = useState(new Animated.Value(hp(45)));
    const [isExpanded, setIsExpanded] = useState(true);
    const [calendarKey, setCalendarKey] = useState(0); // Added to force calendar refresh

    const getMonthYearString = () => {
        return currentMonth.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        });
    };

    const toggleCalendarHeight = () => {
        const toValue = isExpanded ? hp(10) : maxHeight;

        Animated.spring(calendarHeight, {
            toValue,
            useNativeDriver: false,
            friction: 10,
        }).start();

        setIsExpanded(!isExpanded);
    };

    const handleMonthChange = (month) => {
        setCurrentMonth(new Date(month.timestamp));
    };

    const goToPreviousMonth = () => {
        const newDate = new Date(currentMonth);
        newDate.setMonth(currentMonth.getMonth() - 1);
        setCurrentMonth(newDate);
        setCalendarKey(prev => prev + 1); // Force calendar refresh
    };

    const goToNextMonth = () => {
        const newDate = new Date(currentMonth);
        newDate.setMonth(currentMonth.getMonth() + 1);
        setCurrentMonth(newDate);
        setCalendarKey(prev => prev + 1); // Force calendar refresh
    };

    const goToToday = () => {
        const today = new Date();
        setCurrentMonth(today);
        setCalendarKey(prev => prev + 1); // Force calendar refresh
        onDayPress({ dateString: today.toISOString().split('T')[0] });
    };

    return (
        <Animated.View className="px-4" style={{ height: calendarHeight }}>
            <View className="bg-white rounded-2xl shadow-md overflow-hidden">
                <View
                    className="flex-row items-center justify-between border-b border-gray-100"
                    style={{
                        paddingHorizontal: wp(4),
                        paddingVertical: hp(1.5),
                    }}
                >
                    <TouchableOpacity
                        onPress={toggleCalendarHeight}
                        className="flex-row items-center"
                    >
                        <CalendarIcon size={wp(5)} color="#6366f1" />
                        <Text className="text-gray-800 font-semibold"
                            style={{
                                marginLeft: wp(2),
                                fontSize: wp(4.5)
                            }}>
                            {getMonthYearString()}
                        </Text>
                    </TouchableOpacity>

                    <View className="flex-row items-center">
                        <TouchableOpacity
                            onPress={goToToday}
                            className="bg-indigo-50 rounded-full"
                            style={{
                                paddingHorizontal: wp(3),
                                paddingVertical: hp(0.5),
                                marginRight: wp(2)
                            }}
                        >
                            <Text className="text-indigo-500" style={{ fontSize: wp(3.5) }}>Today</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={goToPreviousMonth}
                            style={{ padding: wp(2) }}
                        >
                            <ChevronLeft size={wp(5)} color="#6366f1" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={goToNextMonth}
                            style={{ padding: wp(2) }}
                        >
                            <ChevronRight size={wp(5)} color="#6366f1" />
                        </TouchableOpacity>
                    </View>
                </View>

                {isExpanded && (
                    <Calendar
                        key={calendarKey} // Force refresh when navigation happens
                        current={currentMonth.toISOString()}
                        theme={calendarTheme}
                        onDayPress={onDayPress}
                        markedDates={markedDates}
                        enableSwipeMonths={true}
                        onMonthChange={handleMonthChange}
                        hideExtraDays={true}
                        hideArrows={true}
                        style={{
                            borderRadius: wp(4),
                            padding: wp(2.5),
                        }}
                        dayComponent={({ date, state, marking }) => {
                            const isSelected = marking?.selected;
                            const hasEvents = marking?.marked;
                            const isToday = date.dateString === new Date().toISOString().split('T')[0];

                            return (
                                <TouchableOpacity
                                    onPress={() => onDayPress(date)}
                                    className={`items-center justify-center
                                        ${isSelected ? 'bg-indigo-500' : 'bg-transparent'}
                                        ${isToday && !isSelected ? 'border border-indigo-500' : ''}
                                    `}
                                    style={{
                                        width: wp(10),
                                        height: wp(10),
                                        borderRadius: wp(5),
                                    }}
                                >
                                    <Text className={`
                                        ${isSelected ? 'text-white' : ''}
                                        ${state === 'disabled' ? 'text-gray-300' : ''}
                                        ${isToday && !isSelected ? 'text-indigo-500' : 'text-gray-800'}
                                    `}
                                        style={{ fontSize: wp(4) }}>
                                        {date.day}
                                    </Text>
                                    {hasEvents && !isSelected && (
                                        <View className="absolute bg-indigo-500 rounded-full"
                                            style={{
                                                bottom: wp(1),
                                                width: wp(1),
                                                height: wp(1),
                                            }} />
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