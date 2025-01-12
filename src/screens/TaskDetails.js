import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, FlatList, Alert, KeyboardAvoidingView, Platform, Keyboard, ToastAndroid, Text } from 'react-native';
import { useTask } from '../context/TaskContext';
import { TaskHeader } from '../components/TaskDetailsComponents/TaskHeader';
import { TaskItem } from '../components/TaskDetailsComponents/TaskItem';
import { EmptyTaskList } from '../components/TaskDetailsComponents/EmptyTaskList';
import { AddTaskInput } from '../components/TaskDetailsComponents/AddTaskInput';
import { TaskDetailsModal } from '../components/TaskDetailsComponents/TaskDetailsModal';
import NetInfo from "@react-native-community/netinfo";
import { useTheme } from '../context/ThemeContext'; // Import theme context

export default function TaskDetails({ route }) {
  const { date } = route.params;
  const { 
    addTask: contextAddTask,
    toggleTask: contextToggleTask,
    updateTaskDescription: contextUpdateDescription,
    deleteTask: contextDeleteTask,
    getTasksForDate,
    userId,
    isOnline,
    syncError,
  } = useTask();
  
  const { isDarkMode } = useTheme(); // Retrieve active theme
  const [newTaskText, setNewTaskText] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [networkStatus, setNetworkStatus] = useState(true);

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

  // Handle keyboard visibility
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
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
  const handleAddTask = useCallback(() => {
    if (newTaskText.trim()) {
      if (!userId) {
        Alert.alert('Login Required', 'Please log in to save tasks across devices.', [{ text: 'OK' }]);
        return;
      }

      if (!networkStatus) {
        ToastAndroid.show('No internet. Task will sync when connection is restored.', ToastAndroid.SHORT);
      }

      contextAddTask(date, newTaskText);
      setNewTaskText('');
      Keyboard.dismiss();
    }
  }, [newTaskText, networkStatus, userId, contextAddTask, date]);

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
        <View className="bg-yellow-100 p-2 items-center">
          <Text className={`text-${isDarkMode ? 'yellow-300' : 'yellow-800'}`}>No internet connection. Changes will sync later.</Text>
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
      <View className={`flex-1 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        {renderNetworkWarning()}

        <TaskHeader
          date={date}
          totalTasks={taskList.length}
          completedTasks={taskList.filter((t) => t.completed).length}
        />

        <FlatList
          className="px-4"
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
          contentContainerStyle={{ paddingBottom: 120 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        />

        <AddTaskInput
          value={newTaskText}
          onChangeText={setNewTaskText}
          onSubmit={handleAddTask}
        />

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
        />
      </View>
    </KeyboardAvoidingView>
  );
}
