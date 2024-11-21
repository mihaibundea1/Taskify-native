import React, { useState } from 'react';
import { Text, View, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Plus, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export default function Task() {
  const [selectedDate, setSelectedDate] = useState('');
  const [tasks, setTasks] = useState({});
  const navigation = useNavigation();

  const theme = {
    backgroundColor: '#ffffff',
    calendarBackground: '#ffffff',
    textSectionTitleColor: '#b6c1cd',
    selectedDayBackgroundColor: '#3b82f6',
    selectedDayTextColor: '#ffffff',
    todayTextColor: '#3b82f6',
    dayTextColor: '#2d4150',
    textDisabledColor: '#d9e1e8',
    dotColor: '#3b82f6',
    monthTextColor: '#2d4150',
    textMonthFontWeight: 'bold',
    arrowColor: '#3b82f6',
  };

  const handleAddTask = (date) => {
    navigation.navigate('TaskDetails', { date });
  };

  const renderTaskList = () => {
    return tasks[selectedDate] ? (
      <FlatList
        data={tasks[selectedDate]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View className="flex-row items-center p-4 mb-2 bg-white rounded-lg shadow-sm">
            <CheckCircle2 size={24} color="#3b82f6" />
            <Text className="ml-3 text-gray-800 text-base">{item}</Text>
          </View>
        )}
      />
    ) : (
      <View className="flex-1 justify-center items-center">
        <CalendarIcon size={48} color="#9ca3af" />
        <Text className="mt-4 text-gray-400 text-lg">No tasks for this day</Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-6 pt-6 pb-4 bg-white">
        <Text className="text-2xl font-bold text-gray-800">Tasks Calendar</Text>
        <Text className="text-gray-500 mt-1">Manage your daily tasks</Text>
      </View>

      <ScrollView className="flex-1">
        {/* Calendar Container */}
        <View className="px-4 py-6">
          <View className="bg-white rounded-xl shadow-sm overflow-hidden">
            <Calendar
              theme={theme}
              onDayPress={(day) => {
                setSelectedDate(day.dateString);
                handleAddTask(day.dateString);
              }}
              markedDates={{
                [selectedDate]: { selected: true, selectedColor: '#3b82f6' },
              }}
            />
          </View>
        </View>

        {/* Task List */}
        <View className="px-4 flex-1">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            {selectedDate ? `Tasks for ${selectedDate}` : 'Select a date'}
          </Text>
          <View className="flex-1">
            {selectedDate ? renderTaskList() : (
              <View className="flex-1 justify-center items-center py-8">
                <CalendarIcon size={48} color="#9ca3af" />
                <Text className="mt-4 text-gray-400 text-lg">Select a date to view tasks</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity
        onPress={() => handleAddTask(selectedDate)}
        className="absolute bottom-6 right-6 bg-blue-500 w-14 h-14 rounded-full items-center justify-center shadow-lg"
      >
        <Plus color="white" size={24} />
      </TouchableOpacity>
    </View>
  );
}