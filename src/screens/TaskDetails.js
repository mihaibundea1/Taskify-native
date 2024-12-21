import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { useTask } from '../context/TaskContext';
import { TaskHeader } from '../components/TaskDetailsComponents/TaskHeader';
import { TaskItem } from '../components/TaskDetailsComponents/TaskItem';
import { EmptyTaskList } from '../components/TaskDetailsComponents/EmptyTaskList';
import { AddTaskInput } from '../components/TaskDetailsComponents/AddTaskInput';
import { TaskDetailsModal } from '../components/TaskDetailsComponents/TaskDetailsModal';

export default function TaskDetails({ route }) {
  const { date } = route.params;
  const {
    addTask: contextAddTask,
    toggleTask: contextToggleTask,
    updateTaskDescription: contextUpdateDescription,
    deleteTask: contextDeleteTask,
    getTasksForDate,
  } = useTask();

  const [newTaskText, setNewTaskText] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Memoize the task list based on the date
  const taskList = useMemo(() => getTasksForDate(date), [date, getTasksForDate]);

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
  }, []); // Empty dependency array ensures this effect runs only once when the component mounts

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      contextAddTask(date, newTaskText);
      setNewTaskText('');
      Keyboard.dismiss();
    }
  };

  const handleToggle = (taskId) => {
    contextToggleTask(date, taskId);
  };

  const handleDescriptionChange = (taskId, description) => {
    contextUpdateDescription(date, taskId, description);
  };

  const handleDelete = (taskId) => {
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

  return (
    <View className="flex-1 bg-gray-50">
      <TaskHeader
        date={date}
        totalTasks={taskList.length}
        completedTasks={taskList.filter((t) => t.completed).length}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
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
            paddingBottom: 80,
          }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        />

        {/* Add task input */}
        <AddTaskInput
          value={newTaskText}
          onChangeText={setNewTaskText}
          onSubmit={handleAddTask}
        />
      </KeyboardAvoidingView>

      {/* Task details modal */}
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
  );
}
