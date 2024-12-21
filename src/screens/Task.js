// Dashboard.js
import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, Alert } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import Calendar from '../components/Calendar';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import SearchBar from '../components/SearchBar';
import { taskService } from '../services/taskService';

export default function Task() {
  const { user } = useUser();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadTasks();
  }, [user?.id]);

  const loadTasks = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const userTasks = await taskService.getTasks(user.id);
      setTasks(userTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      setError('Could not load tasks. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTask = async (taskData) => {
    if (!user?.id) return;
    
    try {
      if (editingTask) {
        await taskService.updateTask(editingTask.id, {
          ...taskData[0],
          userId: user.id
        });
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === editingTask.id ? { ...task, ...taskData[0] } : task
          )
        );
      } else {
        const newTasks = await Promise.all(
          taskData.map(task => taskService.addTask(user.id, task))
        );
        setTasks(prevTasks => [...prevTasks, ...newTasks]);
      }
      
      setIsFormOpen(false);
      setEditingTask(null);
    } catch (error) {
      Alert.alert('Error', 'Could not save task. Please try again.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      await taskService.deleteTask(taskId);
    } catch (error) {
      Alert.alert('Error', 'Could not delete task. Please try again.');
      const deletedTask = tasks.find(task => task.id === taskId);
      if (deletedTask) {
        setTasks(prevTasks => [...prevTasks, deletedTask]);
      }
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const filteredTasks = tasks.filter(task => 
    task?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task?.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false
  );

  if (error) {
    return (
      <View className="p-4 bg-red-50 rounded-lg">
        <Text className="text-red-600">{error}</Text>
        <Text 
          className="mt-2 text-sm underline"
          onPress={() => loadTasks()}
        >
          Try Again
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="mb-6 px-4">
        <SearchBar
          tasks={tasks}
          onTaskSelect={(task) => {
            setSelectedDate(new Date(task.date));
          }}
        />
      </View>

      <View className="flex-1 px-4">
        <ScrollView 
          className="flex-1"
          showsVerticalScrollIndicator={false}
        >
          <Calendar
            selectedDate={selectedDate}
            currentMonth={currentMonth}
            onDateSelect={setSelectedDate}
            tasks={tasks}
            onPrevMonth={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))}
            onNextMonth={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))}
          />

          <View className="mt-6">
            <TaskList
              selectedDate={selectedDate}
              tasks={filteredTasks}
              onAddTask={() => {
                setEditingTask(null);
                setIsFormOpen(true);
              }}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </View>
        </ScrollView>
      </View>

      <TaskForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        selectedDate={selectedDate}
        editingTask={editingTask}
      />
    </View>
  );
}