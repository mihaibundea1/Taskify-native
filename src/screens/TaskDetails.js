import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, FlatList, Alert, KeyboardAvoidingView, Platform, Keyboard, ToastAndroid, Text } from 'react-native';
import { useTask } from '../context/TaskContext';
import { TaskHeader } from '../components/TaskDetailsComponents/TaskHeader';
import { TaskItem } from '../components/TaskDetailsComponents/TaskItem';
import { EmptyTaskList } from '../components/TaskDetailsComponents/EmptyTaskList';
import { TaskDetailsModal } from '../components/TaskDetailsComponents/TaskDetailsModal';
import NetInfo from "@react-native-community/netinfo";
import { useTheme } from '../context/ThemeContext'; // Import theme context
import { useNavigation } from '@react-navigation/native';
import FloatingButton from '../components/TaskComponents/FloatingButton';


export default function TaskDetails({ route }) {
  const { date } = route.params;
  const {
    addTask: contextAddTask,
    toggleTask: contextToggleTask,
    updateTaskDescription: contextUpdateDescription,
    deleteTask: contextDeleteTask,
    getTasksForDate,
    updateTask,
    userId,
    isOnline,
    syncError,
    selectedDate,
    setSelectedDate,
  } = useTask();

  const { isDarkMode } = useTheme(); // Retrieve active theme
  const [newTaskText, setNewTaskText] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [networkStatus, setNetworkStatus] = useState(true);
  const navigation = useNavigation();

  // Memoize the task list based on the date
  const taskList = useMemo(() => getTasksForDate(date), [date, getTasksForDate]);

  // Network status listener
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setNetworkStatus(state.isConnected);

      if (!state.isConnected) {
        ToastAndroid.show('No internet connection. Changes will sync later.', ToastAndroid.SHORT);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Handle sync errors
  useEffect(() => {
    if (syncError) {
      Alert.alert(
        'Sync Error',
        'There was a problem syncing your tasks. Please check your connection and try again.',
        [{ text: 'OK' }]
      );
    }
  }, [syncError]);

  // Add task handler
  // const handleAddTask = useCallback(() => {
  //   if (newTaskText.trim()) {
  //     if (!userId) {
  //       Alert.alert('Login Required', 'Please log in to save tasks across devices.', [{ text: 'OK' }]);
  //       return;
  //     }

  //     if (!networkStatus) {
  //       ToastAndroid.show('No internet. Task will sync when connection is restored.', ToastAndroid.SHORT);
  //     }

  //     contextAddTask(date, newTaskText);
  //     setNewTaskText('');
  //     Keyboard.dismiss();
  //   }
  // }, [newTaskText, networkStatus, userId, contextAddTask, date]);

  const handleAddTask = useCallback((date) => {
    console.log('handleAddTask invoked with date:', date);
    const taskDate = date || new Date().toISOString().split('T')[0];
    setSelectedDate(taskDate);
    navigation.navigate('TaskForm', { date: taskDate });
  }, [navigation, setSelectedDate]);

  // Toggle task completion
  const handleToggle = useCallback((taskId) => {
    if (!userId) {
      Alert.alert('Login Required', 'Please log in to save tasks across devices.', [{ text: 'OK' }]);
      return;
    }
    contextToggleTask(date, taskId);
  }, [userId, contextToggleTask, date]);

  // Update task description
  const handleDescriptionChange = useCallback((taskId, description) => {
    if (!userId) {
      Alert.alert('Login Required', 'Please log in to save tasks across devices.', [{ text: 'OK' }]);
      return;
    }
    contextUpdateDescription(date, taskId, description);
  }, [userId, contextUpdateDescription, date]);

  // Delete task
  const handleDelete = useCallback((taskId) => {
    if (!userId) {
      Alert.alert('Login Required', 'Please log in to save tasks across devices.', [{ text: 'OK' }]);
      return;
    }

    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: () => {
          contextDeleteTask(date, taskId);
          setIsModalVisible(false);
          setSelectedTask(null);
        },
        style: 'destructive',
      },
    ]);
  }, [userId, contextDeleteTask, date]);

  // Render network status warning
  const renderNetworkWarning = () => {
    if (!networkStatus) {
      return (
        <View style={{ backgroundColor: isDarkMode ? '#FBBF24' : '#FFFBF0', padding: 8, alignItems: 'center' }}>
          <Text style={{ color: isDarkMode ? '#F59E0B' : '#9B5C01' }}>
            No internet connection. Changes will sync later.
          </Text>
        </View>
      );
    }
    return null;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 70}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1, backgroundColor: isDarkMode ? '#1E2937' : '#FAFAFA' }}>
        {renderNetworkWarning()}

        <TaskHeader
          date={date}
          totalTasks={taskList.length}
          completedTasks={taskList.filter((t) => t.completed).length}
        />

        <FlatList
          contentContainerStyle={{ paddingBottom: 120 }}
          data={taskList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onToggle={handleToggle}
              onPress={() => {
                setSelectedTask(item);
                setIsModalVisible(true);
              }}
            />
          )}
          ListEmptyComponent={<EmptyTaskList />}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        />

        {/* <AddTaskInput
          value={newTaskText}
          onChangeText={setNewTaskText}
          onSubmit={handleAddTask}
        /> */}

        <TaskDetailsModal
          visible={isModalVisible}
          task={selectedTask}
          onClose={() => {
            setIsModalVisible(false);
            setSelectedTask(null);
          }}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onDescriptionChange={handleDescriptionChange}
          onUpdateTask={updateTask} // pasăm noua funcție
        />
      </View>
      <View className="absolute bottom-6 right-4">
        <FloatingButton onPress={() => {
          handleAddTask(selectedDate),
          console.log('handleAddTask invoked with date:', selectedDate);
        }

        } />
      </View>
    </KeyboardAvoidingView>
  );
}
