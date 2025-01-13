import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useTask } from '../context/TaskContext';

const TaskForm = ({ route }) => {
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();
  const { addTask } = useTask();

  const selectedDate = route?.params?.date ?? new Date().toISOString().split('T')[0];

  const [title, setTitle] = useState('');
  const [time, setTime] = useState('12:00');
  const [description, setDescription] = useState('');
  const [isWeeklyRepeat, setIsWeeklyRepeat] = useState(false);
  const [excludeWeekends, setExcludeWeekends] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [numberOfWeeks, setNumberOfWeeks] = useState(1);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    setTitle('');
    setTime('12:00');
    setDescription('');
    setIsWeeklyRepeat(false);
    setExcludeWeekends(false);
    setIsRecurring(false);
    setNumberOfWeeks(1);
  }, [route]);

  const generateTasks = () => {
    const tasks = [];
    const baseTask = {
      title,
      time,
      description,
      date: selectedDate,
    };

    if (!isWeeklyRepeat && !isRecurring) {
      return [baseTask];
    }

    if (isWeeklyRepeat) {
      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(selectedDate);
        currentDate.setDate(currentDate.getDate() + i);
        if (excludeWeekends && (currentDate.getDay() === 6 || currentDate.getDay() === 0)) continue;
        tasks.push({
          ...baseTask,
          date: currentDate.toISOString().split('T')[0],
        });
      }
    } else if (isRecurring) {
      for (let i = 0; i < numberOfWeeks; i++) {
        const currentDate = new Date(selectedDate);
        currentDate.setDate(currentDate.getDate() + i * 7);
        tasks.push({
          ...baseTask,
          date: currentDate.toISOString().split('T')[0],
        });
      }
    }

    return tasks;
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    const tasks = generateTasks();

    try {
      for (const task of tasks) {
        await addTask(task.date, task);
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to create task');
    }
  };

  const handleAiAssist = async () => {
    setIsAiLoading(true);
    // Simulate AI generation process
    setTimeout(() => setIsAiLoading(false), 2000);
  };

  return (
    <View
      style={[styles.screen, { backgroundColor: isDarkMode ? '#1f2937' : '#fff' }]}
    >
      <ScrollView style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: isDarkMode ? '#fff' : '#000' }]}>Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            style={[
              styles.input,
              { backgroundColor: isDarkMode ? '#374151' : '#fff', color: isDarkMode ? '#fff' : '#000' },
            ]}
            placeholder="Add a title..."
            placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: isDarkMode ? '#fff' : '#000' }]}>Time</Text>
          <TextInput
            value={time}
            onChangeText={setTime}
            style={[
              styles.input,
              { backgroundColor: isDarkMode ? '#374151' : '#fff', color: isDarkMode ? '#fff' : '#000' },
            ]}
            placeholder="Add time..."
            placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
          />
        </View>

        {!route?.params?.editingTask && (
          <View style={styles.repeatOptions}>
            <View style={styles.checkboxRow}>
              <Text style={[styles.checkboxLabel, { color: isDarkMode ? '#fff' : '#000' }]}>
                Repeat this week
              </Text>
              <Switch
                value={isWeeklyRepeat}
                onValueChange={(val) => {
                  setIsWeeklyRepeat(val);
                  if (val) setIsRecurring(false);
                }}
              />
            </View>

            {isWeeklyRepeat && (
              <View style={styles.checkboxRow}>
                <Text style={[styles.checkboxLabel, { color: isDarkMode ? '#fff' : '#000' }]}>
                  Exclude weekends
                </Text>
                <Switch
                  value={excludeWeekends}
                  onValueChange={setExcludeWeekends}
                />
              </View>
            )}

            <View style={styles.checkboxRow}>
              <Text style={[styles.checkboxLabel, { color: isDarkMode ? '#fff' : '#000' }]}>
                Recurring every week
              </Text>
              <Switch
                value={isRecurring}
                onValueChange={(val) => {
                  setIsRecurring(val);
                  if (val) setIsWeeklyRepeat(false);
                }}
              />
            </View>

            {isRecurring && (
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: isDarkMode ? '#fff' : '#000' }]}>Number of weeks</Text>
                <TextInput
                  value={String(numberOfWeeks)}
                  onChangeText={(text) => setNumberOfWeeks(Number(text))}
                  keyboardType="numeric"
                  style={[
                    styles.input,
                    { backgroundColor: isDarkMode ? '#374151' : '#fff', color: isDarkMode ? '#fff' : '#000' },
                  ]}
                  placeholder="Enter number of weeks"
                  placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
                />
              </View>
            )}
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: isDarkMode ? '#fff' : '#000' }]}>Description (optional)</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            multiline
            style={[
              styles.input,
              styles.textarea,
              { backgroundColor: isDarkMode ? '#374151' : '#fff', color: isDarkMode ? '#fff' : '#000' },
            ]}
            placeholder="Add a description..."
            placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
          />
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={handleAiAssist}
            disabled={isAiLoading}
            style={[styles.aiButton, { backgroundColor: isAiLoading ? '#7f56d9' : '#007BFF' }]}
          >
            <Text style={styles.submitButtonText}>
              {isAiLoading ? 'Generating...' : 'AI Assistant'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Add Task</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 40,
  },
  form: {
    margin: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    fontSize: 16,
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  repeatOptions: {
    marginVertical: 10,
  },
  checkboxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkboxLabel: {
    fontSize: 14,
  },
  buttons: {
    marginTop: 20,
  },
  aiButton: {
    padding: 14,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  submitButton: {
    padding: 14,
    borderRadius: 6,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default TaskForm;
