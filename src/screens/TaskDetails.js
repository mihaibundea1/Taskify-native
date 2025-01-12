import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ToastAndroid,
} from 'react-native';
import { useTask } from '../context/TaskContext';
import { TaskHeader } from '../components/TaskDetailsComponents/TaskHeader';
import { TaskItem } from '../components/TaskDetailsComponents/TaskItem';
import { EmptyTaskList } from '../components/TaskDetailsComponents/EmptyTaskList';
import { AddTaskInput } from '../components/TaskDetailsComponents/AddTaskInput';
import { TaskDetailsModal } from '../components/TaskDetailsComponents/TaskDetailsModal';
import NetInfo from "@react-native-community/netinfo";

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
      
      // Optional: Show network status toast
      if (!state.isConnected) {
        ToastAndroid.show('No internet connection. Changes will sync later.', ToastAndroid.SHORT);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Use effect to listen to keyboard visibility
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

  // Handling sync errors
  useEffect(() => {
    if (syncError) {
      Alert.alert(
        'Sync Error', 
        'There was a problem syncing your tasks. Please check your connection and try again.',
        [{ text: 'OK' }]
      );
    }
  }, [syncError]);

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      // Check if user is logged in
      if (!userId) {
        Alert.alert(
          'Login Required', 
          'Please log in to save tasks across devices.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Check network status if online mode is important
      if (!networkStatus) {
        ToastAndroid.show('No internet. Task will sync when connection is restored.', ToastAndroid.SHORT);
      }

      // Add task with context method
      contextAddTask(date, newTaskText);
      setNewTaskText('');
      Keyboard.dismiss();
    }
  };

  const handleToggle = (taskId) => {
    // Check if user is logged in
    if (!userId) {
      Alert.alert(
        'Login Required', 
        'Please log in to save tasks across devices.',
        [{ text: 'OK' }]
      );
      return;
    }

    contextToggleTask(date, taskId);
  };

  const handleDescriptionChange = (taskId, description) => {
    // Check if user is logged in
    if (!userId) {
      Alert.alert(
        'Login Required', 
        'Please log in to save tasks across devices.',
        [{ text: 'OK' }]
      );
      return;
    }

    contextUpdateDescription(date, taskId, description);
  };

  const handleDelete = (taskId) => {
    // Check if user is logged in
    if (!userId) {
      Alert.alert(
        'Login Required', 
        'Please log in to save tasks across devices.',
        [{ text: 'OK' }]
      );
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
  };

  // Render network status warning
  const renderNetworkWarning = () => {
    if (!networkStatus) {
      return (
        <View className="bg-yellow-100 p-2 items-center">
          <Text className="text-yellow-800">No internet connection. Changes will sync later.</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 70} // Adjust this offset as per your header height
      style={{ flex: 1 }}
    >
      {/* Main Container */}
      <View className="flex-1 bg-gray-50">
        {/* Network Status Warning */}
        {renderNetworkWarning()}
  
        {/* Task Header */}
        <TaskHeader
          date={date}
          totalTasks={taskList.length}
          completedTasks={taskList.filter((t) => t.completed).length}
        />
  
        {/* Task List */}
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
          contentContainerStyle={{
            paddingBottom: 120, // Leave room for input
          }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        />
  
        {/* Add Task Input */}
        <AddTaskInput
          value={newTaskText}
          onChangeText={setNewTaskText}
          onSubmit={handleAddTask}
        />
  
        {/* Task Details Modal */}
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