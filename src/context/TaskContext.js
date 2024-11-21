// context/TaskContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TaskContext = createContext();

export function TaskProvider({ children }) {
    const [tasks, setTasks] = useState({});
    const [selectedDate, setSelectedDate] = useState('');
    const [loading, setLoading] = useState(true);

    // Load tasks from storage on mount
    useEffect(() => {
        loadTasks();
    }, []);

    // Save tasks to storage whenever they change
    useEffect(() => {
        if (!loading) {
            saveTasks();
        }
    }, [tasks]);

    const loadTasks = async () => {
        try {
            const storedTasks = await AsyncStorage.getItem('tasks');
            if (storedTasks) {
                setTasks(JSON.parse(storedTasks));
            }
        } catch (error) {
            console.error('Error loading tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveTasks = async () => {
        try {
            await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
        } catch (error) {
            console.error('Error saving tasks:', error);
        }
    };

    // Add a new task for a specific date
    const addTask = (date, taskText) => {
        const newTask = {
            id: Date.now().toString(),
            text: taskText,
            completed: false,
            createdAt: new Date(),
            description: '',
            dueTime: null
        };

        setTasks(prevTasks => ({
            ...prevTasks,
            [date]: [...(prevTasks[date] || []), newTask]
        }));
    };

    // Toggle task completion
    const toggleTask = (date, taskId) => {
        setTasks(prevTasks => ({
            ...prevTasks,
            [date]: prevTasks[date]?.map(task => 
                task.id === taskId 
                    ? { ...task, completed: !task.completed }
                    : task
            )
        }));
    };

    // Update task description
    const updateTaskDescription = (date, taskId, description) => {
        setTasks(prevTasks => ({
            ...prevTasks,
            [date]: prevTasks[date]?.map(task =>
                task.id === taskId
                    ? { ...task, description }
                    : task
            )
        }));
    };

    // Delete task
    const deleteTask = (date, taskId) => {
        setTasks(prevTasks => ({
            ...prevTasks,
            [date]: prevTasks[date]?.filter(task => task.id !== taskId)
        }));
    };

    // Get tasks for a specific date
    const getTasksForDate = (date) => {
        return tasks[date] || [];
    };

    // Get all dates that have tasks
    const getMarkedDates = () => {
        const marked = {};
        Object.keys(tasks).forEach(date => {
            if (tasks[date]?.length > 0) {
                marked[date] = {
                    marked: true,
                    dotColor: '#6366f1'
                };
            }
        });
        return marked;
    };

    const searchTasks = (searchTerm) => {
        if (!searchTerm.trim()) return [];

        const searchResults = [];
        const searchTermLower = searchTerm.toLowerCase();

        Object.entries(tasks).forEach(([date, tasksForDate]) => {
            tasksForDate.forEach(task => {
                if (
                    task.text.toLowerCase().includes(searchTermLower) ||
                    (task.description && task.description.toLowerCase().includes(searchTermLower))
                ) {
                    searchResults.push({
                        ...task,
                        date
                    });
                }
            });
        });

        return searchResults.sort((a, b) => new Date(b.date) - new Date(a.date));
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
            getMarkedDates
        }}>
            {children}
        </TaskContext.Provider>
    );
}

// Custom hook pentru utilizarea contextului
export function useTask() {
    const context = useContext(TaskContext);
    if (context === undefined) {
        throw new Error('useTask must be used within a TaskProvider');
    }
    return context;
}