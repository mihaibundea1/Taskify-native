import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTheme } from '../../context/ThemeContext'; // Importă contextul de temă

const calendarTheme = (isDarkMode) => ({
    backgroundColor: isDarkMode ? '#102a43' : '#e3f2fd', // Fundal general
    calendarBackground: isDarkMode ? '#102a43' : '#e3f2fd', // Fundal calendar
    textSectionTitleColor: isDarkMode ? '#7ea5cc' : '#3b82f6', // Titluri de secțiuni
    selectedDayBackgroundColor: '#2563eb', // Ziua selectată (albastru mai intens)
    selectedDayTextColor: '#ffffff', // Text pe zi selectată
    todayTextColor: '#1d4ed8', // Ziua curentă
    dayTextColor: isDarkMode ? '#dbeafe' : '#1e40af', // Zilele obișnuite
    textDisabledColor: '#93c5fd', // Zile dezactivate
    dotColor: '#3b82f6', // Culoarea punctelor
    monthTextColor: isDarkMode ? '#dbeafe' : '#1e3a8a', // Text lună
    textMonthFontWeight: 'bold', // Text lună bold
    arrowColor: '#3b82f6', // Culoare săgeți
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
            backgroundColor: '#2563eb', // Fundal zi selectată
        },
        today: {
            borderRadius: wp(5.5),
            borderWidth: 1,
            borderColor: '#1d4ed8', // Contur ziua curentă
        },
    },
});


export default function CustomCalendar({ selectedDate, onDayPress, markedDates, maxHeight }) {
    const { isDarkMode } = useTheme(); // Folosește contextul de temă
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [calendarHeight] = useState(new Animated.Value(hp(50)));
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

    // Updated day press handler
    const handleDayPress = useCallback((day) => {
        if (selectedDate !== day.dateString) {
            onDayPress(day);
        }
    }, [selectedDate, onDayPress]); // Avoid unnecessary state updates

    useEffect(() => {
        // Ensure that calendar gets updated when the theme changes
        setCalendarKey(prev => prev + 1);
    }, [isDarkMode]);

    return (
        <Animated.View className="px-4" style={{ height: calendarHeight, overflow: 'hidden' }}>
            <View className={`rounded-2xl shadow-md overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
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
                        <CalendarIcon size={wp(5)} color={isDarkMode ? '#f3f4f6' : '#007BFF'} />
                        <Text className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
                            style={{
                                marginLeft: wp(2),
                                fontSize: wp(4.5)
                            }} >
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
                            }}
                        >
                            <Text className="text-indigo-500">Today</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={goToPreviousMonth}>
                            <ChevronLeft size={wp(6)} color={isDarkMode ? '#cbd5e1' : '#007BFF'} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={goToNextMonth}>
                            <ChevronRight size={wp(6)} color={isDarkMode ? '#cbd5e1' : '#007BFF'} />
                        </TouchableOpacity>
                    </View>
                </View>

                <Calendar
                    key={calendarKey}
                    current={currentMonth.toISOString().split('T')[0]}  // Convert Date to YYYY-MM-DD string
                    onDayPress={handleDayPress}
                    markedDates={markedDates}
                    theme={calendarTheme(isDarkMode)}
                    onMonthChange={handleMonthChange}
                />
            </View>
        </Animated.View>
    );
}
