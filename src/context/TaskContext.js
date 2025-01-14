// context/TaskContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from "@clerk/clerk-expo";
import taskService from '../services/taskService';
import { Alert } from 'react-native';

const TaskContext = createContext();

export function TaskProvider({ children }) {
    const { user, isLoaded, isSignedIn } = useUser();
    const [tasks, setTasks] = useState({});
    const [selectedDate, setSelectedDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const [syncError, setSyncError] = useState(null);

    // Track user changes
    useEffect(() => {
        if (isLoaded && isSignedIn && user) {
            setUserId(user.id);
        } else if (isLoaded && !isSignedIn) {
            setUserId(null);
            setTasks({});
        }
    }, [user, isLoaded, isSignedIn]);

    // Load local tasks from AsyncStorage
    const validateTaskStructure = (tasks) => {
        if (!tasks || typeof tasks !== 'object') return {};
        const validTasks = {};
        Object.keys(tasks).forEach(date => {
            if (Array.isArray(tasks[date])) {
                validTasks[date] = tasks[date].filter(task =>
                    task.title && task.date && task.time && task.userId
                );
            }
        });
        return validTasks;
    };

    const loadLocalTasks = async () => {
        try {
            const storedTasks = await AsyncStorage.getItem('tasks');
            if (storedTasks) {
                const parsedTasks = JSON.parse(storedTasks);
                setTasks(validateTaskStructure(parsedTasks)); // Validare structură
            }
        } catch (error) {
            console.error('Error loading local tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    // Save tasks to AsyncStorage
    const saveLocalTasks = async (tasksToSave) => {
        try {
            await AsyncStorage.setItem('tasks', JSON.stringify(tasksToSave));
        } catch (error) {
            console.error('Error saving local tasks:', error);
        }
    };

    // Real-time task subscription
    useEffect(() => {
        let unsubscribe;

        const setupTaskListener = async () => {
            if (userId) {
                try {
                    setLoading(true);
                    unsubscribe = taskService.subscribeToTasks(
                        userId,
                        (fetchedTasks) => {
                            const tasksByDate = fetchedTasks.reduce((acc, task) => {
                                const date = task.date || new Date().toISOString().split('T')[0]; // Asigurăm că există o dată
                                if (!acc[date]) {
                                    acc[date] = [];
                                }
                                acc[date].push(task); // Posibil ca task-urile să aibă structură greșită
                                return acc;
                            }, {});

                            setTasks(tasksByDate); // Posibil să seteze o structură incorectă
                            saveLocalTasks(tasksByDate);
                            setLoading(false);
                        },
                        (error) => {
                            console.error('Tasks sync error:', error);
                            setSyncError(error);
                            setLoading(false);
                            Alert.alert('Sync Error', 'Failed to sync tasks');
                        }
                    );
                } catch (error) {
                    console.error('Error setting up task listener:', error);
                    setLoading(false);
                }
            } else {
                // If no user, load from local storage
                loadLocalTasks();
            }
        };

        setupTaskListener();

        // Cleanup subscription
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [userId]);

    // Refresh tasks
    const refreshTasks = async () => {
        if (userId) {
            try {
                const userTasks = await taskService.getTasks(userId);

                // Organize tasks by date
                const tasksByDate = userTasks.reduce((acc, task) => {
                    const date = task.date || new Date().toISOString().split('T')[0];
                    if (!acc[date]) {
                        acc[date] = [];
                    }
                    acc[date].push(task);
                    return acc;
                }, {});

                setTasks(tasksByDate);
                saveLocalTasks(tasksByDate);
            } catch (error) {
                console.error('Error refreshing tasks:', error);
                setSyncError(error);
                Alert.alert('Refresh Error', 'Failed to refresh tasks');

                // Fallback to local tasks if network fails
                loadLocalTasks();
            }
        } else {
            // If no user, just load local tasks
            loadLocalTasks();
        }
    };

    // Add a new task
    // Add a new task
    const addTask = async (date, taskData) => {
        if (!userId) {
            // If no user, just save locally
            const newTask = {
                id: Date.now().toString(),
                title: taskData.title,
                description: taskData.description || '',
                date: taskData.date,
                time: taskData.time,
                completed: false,
                createdAt: new Date()
            };

            const updatedTasks = {
                ...tasks,
                [date]: [...(tasks[date] || []), newTask]
            };

            setTasks(updatedTasks);
            saveLocalTasks(updatedTasks);
            return;
        }

        try {
            const taskPayload = {
                title: taskData.title,
                description: taskData.description || '',
                date: taskData.date,
                time: taskData.time,
                completed: false,
                userId: userId
            };

            // Optimistic update
            const newTaskTemp = {
                id: `temp-${Date.now()}`,
                ...taskPayload
            };

            const updatedTasks = {
                ...tasks,
                [date]: [...(tasks[date] || []), newTaskTemp]
            };

            setTasks(updatedTasks);
            saveLocalTasks(updatedTasks);

            // Add task via service
            await taskService.addTask(userId, taskPayload);
        } catch (error) {
            console.error('Error adding task:', error);
            Alert.alert('Add Task Error', 'Failed to add task');
        }
    };

    const updateTask = async (taskId, updatedTaskData) => {
        if (!userId) {
            // Update local
            const updatedTasks = { ...tasks };
            Object.keys(updatedTasks).forEach(date => {
                const taskIndex = updatedTasks[date].findIndex(t => t.id === taskId);
                if (taskIndex !== -1) {
                    updatedTasks[date][taskIndex] = {
                        ...updatedTasks[date][taskIndex],
                        ...updatedTaskData
                    };
                }
            });

            setTasks(updatedTasks);
            saveLocalTasks(updatedTasks);
            return;
        }

        try {
            // Optimistic update
            const updatedTasks = { ...tasks };
            Object.keys(updatedTasks).forEach(date => {
                const taskIndex = updatedTasks[date].findIndex(t => t.id === taskId);
                if (taskIndex !== -1) {
                    updatedTasks[date][taskIndex] = {
                        ...updatedTasks[date][taskIndex],
                        ...updatedTaskData
                    };
                }
            });

            setTasks(updatedTasks);
            saveLocalTasks(updatedTasks);

            // Update via service - nu mai includem userId aici
            await taskService.updateTask(taskId, updatedTaskData);
        } catch (error) {
            console.error('Error updating task:', error);
            Alert.alert('Update Task Error', 'Failed to update task');
        }
    };

    // Toggle task completion
    const toggleTask = async (date, taskId) => {
        if (!userId) {
            // If no user, just update locally
            const updatedTasks = {
                ...tasks,
                [date]: tasks[date].map(task =>
                    task.id === taskId
                        ? { ...task, completed: !task.completed }
                        : task
                )
            };

            setTasks(updatedTasks);
            saveLocalTasks(updatedTasks);
            return;
        }

        try {
            // Find the current task
            const taskToToggle = tasks[date]?.find(task => task.id === taskId);

            // Optimistic update
            const updatedTasks = {
                ...tasks,
                [date]: tasks[date].map(task =>
                    task.id === taskId
                        ? { ...task, completed: !task.completed }
                        : task
                )
            };

            setTasks(updatedTasks);
            saveLocalTasks(updatedTasks);

            // Update task via service
            await taskService.updateTaskStatus(taskId, !taskToToggle.completed);
        } catch (error) {
            console.error('Error toggling task:', error);
            Alert.alert('Toggle Error', 'Failed to update task status');
        }
    };

    // Update task description
    const updateTaskDescription = async (date, taskId, description) => {
        if (!userId) {
            // If no user, just update locally
            const updatedTasks = {
                ...tasks,
                [date]: tasks[date].map(task =>
                    task.id === taskId
                        ? { ...task, description }
                        : task
                )
            };

            setTasks(updatedTasks);
            saveLocalTasks(updatedTasks);
            return;
        }

        try {
            // Optimistic update
            const updatedTasks = {
                ...tasks,
                [date]: tasks[date].map(task =>
                    task.id === taskId
                        ? { ...task, description }
                        : task
                )
            };

            setTasks(updatedTasks);
            saveLocalTasks(updatedTasks);

            // Update task via service
            await taskService.updateTask(taskId, { description });
        } catch (error) {
            console.error('Error updating task description:', error);
            Alert.alert('Update Error', 'Failed to update task description');
        }
    };

    // Delete task
    const deleteTask = async (date, taskId) => {
        if (!userId) {
            // If no user, just update locally
            const updatedTasks = {
                ...tasks,
                [date]: tasks[date].filter(task => task.id !== taskId)
            };

            setTasks(updatedTasks);
            saveLocalTasks(updatedTasks);
            return;
        }

        try {
            // Optimistic update
            const updatedTasks = {
                ...tasks,
                [date]: tasks[date].filter(task => task.id !== taskId)
            };

            setTasks(updatedTasks);
            saveLocalTasks(updatedTasks);

            // Delete task via service
            await taskService.deleteTask(taskId);
        } catch (error) {
            console.error('Error deleting task:', error);
            Alert.alert('Delete Error', 'Failed to delete task');
        }
    };

    // Get tasks for a specific date
    const getTasksForDate = (date) => {
        return tasks[date] || [];
    };

    // Get marked dates for calendar
    const getMarkedDates = () => {
        const marked = {};
        Object.keys(tasks).forEach(date => {
            if (tasks[date]?.length > 0) {
                marked[date] = {
                    marked: true,
                    dotColor: '#007BFF'
                };
            }
        });
        return marked;
    };

    // Search tasks
    const searchTasks = (searchTerm) => {
        // Verifică dacă searchTerm este definit și nu este null
        if (!searchTerm || typeof searchTerm !== 'string') {
            return [];
        }

        const searchTermTrimmed = searchTerm.trim();
        if (searchTermTrimmed === '') {
            return [];
        }

        const searchResult = [];
        const searchTermLower = searchTermTrimmed.toLowerCase();

        // Verifică dacă tasks există și este un obiect
        if (!tasks || typeof tasks !== 'object') {
            return [];
        }

        Object.entries(tasks).forEach(([date, tasksForDate]) => {
            // Verifică dacă tasksForDate este un array
            if (!Array.isArray(tasksForDate)) {
                return;
            }

            tasksForDate.forEach(task => {
                if (!task) return; // Skip dacă task este null sau undefined

                const taskTitle = task.title || '';
                const taskDescription = task.description || '';

                if (
                    taskTitle.toLowerCase().includes(searchTermLower) ||
                    taskDescription.toLowerCase().includes(searchTermLower)
                ) {
                    searchResult.push({
                        ...task,
                        date
                    });
                }
            });
        });

        return searchResult.sort((a, b) => new Date(b.date) - new Date(a.date));
    };


    return (
        <TaskContext.Provider value={{
            tasks,
            selectedDate,
            setSelectedDate,
            searchTasks,
            loading,
            addTask,
            toggleTask,
            updateTaskDescription,
            deleteTask,
            getTasksForDate,
            getMarkedDates,
            refreshTasks,
            updateTask,  // Asigură-te că este inclusă aici
            userId,
            user,
            syncError
        }}>
            {children}
        </TaskContext.Provider>
    );
}

// Custom hook to use the context
export function useTask() {
    const context = useContext(TaskContext);
    if (context === undefined) {
        throw new Error('useTask must be used within a TaskProvider');
    }
    return context;
}