// TaskForm.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Switch,
  Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { X, Plus, Clock, Calendar } from 'lucide-react-native';
import { format } from 'date-fns';

export default function TaskForm({ 
  isOpen, 
  onClose, 
  onSave, 
  selectedDate, 
  editingTask 
}) {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('12:00');
  const [description, setDescription] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  
  // States for recurring task options
  const [isWeeklyRepeat, setIsWeeklyRepeat] = useState(false);
  const [excludeWeekends, setExcludeWeekends] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [numberOfWeeks, setNumberOfWeeks] = useState('1');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setTime(editingTask.time);
      setDescription(editingTask.description || '');
      setDate(new Date(editingTask.date));
      // Reset recurring options when editing
      setIsWeeklyRepeat(false);
      setIsRecurring(false);
      setExcludeWeekends(false);
      setNumberOfWeeks('1');
    } else {
      setDate(selectedDate);
    }
  }, [editingTask, selectedDate]);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setTitle('');
    setTime('12:00');
    setDescription('');
    setIsWeeklyRepeat(false);
    setIsRecurring(false);
    setExcludeWeekends(false);
    setNumberOfWeeks('1');
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTime(format(selectedTime, 'HH:mm'));
    }
  };

  const generateTasks = () => {
    const tasks = [];
    const baseTask = {
      title,
      time,
      description,
      date: format(date, 'yyyy-MM-dd'),
    };

    if (!isWeeklyRepeat && !isRecurring) {
      return [baseTask];
    }

    if (isWeeklyRepeat) {
      // Generate tasks for each day of the week
      for (let i = 0; i < 7; i++) {
        const taskDate = new Date(date);
        taskDate.setDate(taskDate.getDate() + i);
        
        if (excludeWeekends && [0, 6].includes(taskDate.getDay())) {
          continue;
        }
        
        tasks.push({
          ...baseTask,
          date: format(taskDate, 'yyyy-MM-dd'),
        });
      }
    } else if (isRecurring) {
      // Generate tasks for specified number of weeks
      for (let i = 0; i < parseInt(numberOfWeeks); i++) {
        const taskDate = new Date(date);
        taskDate.setDate(taskDate.getDate() + (i * 7));
        
        tasks.push({
          ...baseTask,
          date: format(taskDate, 'yyyy-MM-dd'),
        });
      }
    }

    return tasks;
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      return;
    }

    const tasks = generateTasks();
    onSave(tasks);
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50">
        <View className="flex-1 mt-16 bg-white rounded-t-3xl">
          <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
            <Text className="text-xl font-semibold text-gray-900">
              {editingTask ? 'Edit Task' : 'New Task'}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="p-2 rounded-full bg-gray-100"
            >
              <X size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 p-4">
            <View className="space-y-4">
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1">
                  Title
                </Text>
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Enter task title"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
                />
              </View>

              <View className="flex-row space-x-4">
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Date
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    className="flex-row items-center px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
                  >
                    <Calendar size={20} color="#666" />
                    <Text className="ml-2">
                      {format(date, 'MMM d, yyyy')}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Time
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowTimePicker(true)}
                    className="flex-row items-center px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
                  >
                    <Clock size={20} color="#666" />
                    <Text className="ml-2">{time}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {!editingTask && (
                <View className="space-y-4">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm font-medium text-gray-700">
                      Repeat this week
                    </Text>
                    <Switch
                      value={isWeeklyRepeat}
                      onValueChange={(value) => {
                        setIsWeeklyRepeat(value);
                        if (value) setIsRecurring(false);
                      }}
                    />
                  </View>

                  {isWeeklyRepeat && (
                    <View className="flex-row items-center justify-between pl-4">
                      <Text className="text-sm text-gray-600">
                        Exclude weekends
                      </Text>
                      <Switch
                        value={excludeWeekends}
                        onValueChange={setExcludeWeekends}
                      />
                    </View>
                  )}

                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm font-medium text-gray-700">
                      Repeat weekly
                    </Text>
                    <Switch
                      value={isRecurring}
                      onValueChange={(value) => {
                        setIsRecurring(value);
                        if (value) setIsWeeklyRepeat(false);
                      }}
                    />
                  </View>

                  {isRecurring && (
                    <View>
                      <Text className="text-sm font-medium text-gray-700 mb-1">
                        Number of weeks
                      </Text>
                      <TextInput
                        value={numberOfWeeks}
                        onChangeText={setNumberOfWeeks}
                        keyboardType="numeric"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
                        placeholder="Enter number of weeks"
                      />
                    </View>
                  )}
                </View>
              )}

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1">
                  Description (optional)
                </Text>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Add description"
                  multiline
                  numberOfLines={4}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
                />
              </View>
            </View>
          </ScrollView>

          <View className="p-4 border-t border-gray-200">
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!title.trim()}
              className={`w-full py-3 rounded-lg items-center justify-center bg-blue-600 
                ${!title.trim() ? 'opacity-50' : ''}`}
            >
              <Text className="text-white font-medium">
                {editingTask ? 'Save Changes' : 'Add Task'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {showDatePicker && Platform.OS === 'ios' && (
        <View className="bg-white">
          <DateTimePicker
            value={date}
            mode="date"
            display="spinner"
            onChange={handleDateChange}
          />
          <TouchableOpacity
            onPress={() => setShowDatePicker(false)}
            className="p-4 border-t border-gray-200"
          >
            <Text className="text-center text-blue-600 font-medium">
              Done
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {showTimePicker && Platform.OS === 'ios' && (
        <View className="bg-white">
          <DateTimePicker
            value={new Date(`2000-01-01T${time}`)}
            mode="time"
            display="spinner"
            onChange={handleTimeChange}
          />
          <TouchableOpacity
            onPress={() => setShowTimePicker(false)}
            className="p-4 border-t border-gray-200"
          >
            <Text className="text-center text-blue-600 font-medium">
              Done
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* For Android, we show the native picker directly */}
      {(showDatePicker || showTimePicker) && Platform.OS === 'android' && (
        <DateTimePicker
          value={showDatePicker ? date : new Date(`2000-01-01T${time}`)}
          mode={showDatePicker ? 'date' : 'time'}
          display="default"
          onChange={showDatePicker ? handleDateChange : handleTimeChange}
        />
      )}
    </Modal>
  );
}