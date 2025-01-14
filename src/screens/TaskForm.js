import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useTask } from '../context/TaskContext';
import { aiService } from '../services/aiService'; // Import AI service

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
  const [subTasks, setSubTasks] = useState([]); // Store AI-generated tasks

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
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }
  
    setIsAiLoading(true);
    try {
      const suggestions = await aiService.decomposeTask(title, description || '', selectedDate);
      setSubTasks(suggestions);
  
      // Parcurgem răspunsul JSON și creăm task-uri din subtask-urile generate
      const tasksToAdd = suggestions.map(suggestion => ({
        title: suggestion.title,
        description: suggestion.description || '',
        date: selectedDate,
        time: suggestion.suggestedTime,
      }));
  
      // Adăugăm fiecare task în context sau în baza de date
      for (const task of tasksToAdd) {
        await addTask(task.date, task); // Apelăm funcția addTask pentru fiecare task generat
      }
      
      // După ce task-urile sunt adăugate, navigăm înapoi
      navigation.goBack();
    } catch (error) {
      console.error('Error generating tasks:', error);
      Alert.alert('Error', 'Unable to generate tasks. Please try again.');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: isDarkMode ? '#1f2937' : '#fff' }]}>
      <ScrollView style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: isDarkMode ? '#fff' : '#000' }]}>Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            style={[styles.input, { backgroundColor: isDarkMode ? '#374151' : '#fff', color: isDarkMode ? '#fff' : '#000' }]}
            placeholder="Add a title..."
            placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: isDarkMode ? '#fff' : '#000' }]}>Time</Text>
          <TextInput
            value={time}
            onChangeText={setTime}
            style={[styles.input, { backgroundColor: isDarkMode ? '#374151' : '#fff', color: isDarkMode ? '#fff' : '#000' }]}
            placeholder="Add time..."
            placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: isDarkMode ? '#fff' : '#000' }]}>Description (optional)</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            multiline
            style={[styles.input, styles.textarea, { backgroundColor: isDarkMode ? '#374151' : '#fff', color: isDarkMode ? '#fff' : '#000' }]}
            placeholder="Add a description..."
            placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: isDarkMode ? '#fff' : '#000' }]}>Repeat Weekly</Text>
          <Switch
            value={isWeeklyRepeat}
            onValueChange={setIsWeeklyRepeat}
          />
        </View>

        {isWeeklyRepeat && (
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: isDarkMode ? '#fff' : '#000' }]}>Exclude Weekends</Text>
            <Switch
              value={excludeWeekends}
              onValueChange={setExcludeWeekends}
            />
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: isDarkMode ? '#fff' : '#000' }]}>Recurring</Text>
          <Switch
            value={isRecurring}
            onValueChange={setIsRecurring}
          />
        </View>

        {isRecurring && (
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: isDarkMode ? '#fff' : '#000' }]}>Number of Weeks</Text>
            <TextInput
              value={String(numberOfWeeks)}
              onChangeText={(value) => setNumberOfWeeks(Number(value))}
              keyboardType="numeric"
              style={[styles.input, { backgroundColor: isDarkMode ? '#374151' : '#fff', color: isDarkMode ? '#fff' : '#000' }]}
              placeholder="1"
            />
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, { backgroundColor: isAiLoading ? '#9ca3af' : '#8b5cf6' }]}
          onPress={handleAiAssist}
          disabled={isAiLoading}
        >
          <Text style={styles.buttonText}>
            {isAiLoading ? 'Generating...' : 'AI Assistant'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Add Task</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
  },
  textarea: {
    minHeight: 100,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#222222',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default TaskForm;
