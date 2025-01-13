import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Text, TextInput } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTask } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';

export default function TaskForm({ route }) {
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();
  const { addTask, userId } = useTask();
  
  // Get the current date from navigation params or use current date
  const initialDate = route.params?.date || new Date().toISOString().split('T')[0];
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date(initialDate));
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleSubmit = async () => {
    const taskData = {
      title: title,
      description: description,
      date: format(date, 'yyyy-MM-dd'),
      time: format(time, 'HH:mm'),
      userId: userId
    };

    await addTask(taskData.date, title);
    navigation.goBack();
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  const textInputStyle = `p-4 rounded-lg mb-4 ${
    isDarkMode 
      ? 'bg-gray-700 text-white border-gray-600' 
      : 'bg-white text-gray-900 border-gray-200'
  } border`;

  return (
    <View className={`flex-1 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <ScrollView className="p-4">
        <Text className={`text-lg mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Task Title
        </Text>
        <TextInput
          className={textInputStyle}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter task title"
          placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
        />

        <Text className={`text-lg mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Description
        </Text>
        <TextInput
          className={`${textInputStyle} min-h-[100px]`}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter task description"
          placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
          multiline
          textAlignVertical="top"
        />

        <Text className={`text-lg mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Date
        </Text>
        <TouchableOpacity 
          onPress={() => setShowDatePicker(true)}
          className={`${textInputStyle} justify-center`}
        >
          <Text className={isDarkMode ? 'text-white' : 'text-gray-900'}>
            {format(date, 'MMMM dd, yyyy')}
          </Text>
        </TouchableOpacity>

        <Text className={`text-lg mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Time
        </Text>
        <TouchableOpacity 
          onPress={() => setShowTimePicker(true)}
          className={`${textInputStyle} justify-center`}
        >
          <Text className={isDarkMode ? 'text-white' : 'text-gray-900'}>
            {format(time, 'HH:mm')}
          </Text>
        </TouchableOpacity>

        {(showDatePicker || showTimePicker) && (
          <DateTimePicker
            value={showDatePicker ? date : time}
            mode={showDatePicker ? 'date' : 'time'}
            is24Hour={true}
            display="default"
            onChange={showDatePicker ? onDateChange : onTimeChange}
          />
        )}

        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-indigo-500 p-4 rounded-lg mt-6"
        >
          <Text className="text-white text-center text-lg font-semibold">
            Create Task
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}