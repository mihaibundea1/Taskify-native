// components/TaskComponents/TaskList.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Calendar as CalendarIcon, Check, ChevronRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTask } from '../../context/TaskContext';

export default function TaskList({ selectedDate }) {
    const navigation = useNavigation();
    const { getTasksForDate, toggleTask } = useTask();
    const tasks = getTasksForDate(selectedDate);

    if (!selectedDate) {
        return (
            <View className="flex-1 justify-center items-center py-12">
                <View className="bg-gray-50 p-6 rounded-full">
                    <CalendarIcon size={48} color="#6366f1" />
                </View>
                <Text className="mt-6 text-gray-500 text-lg text-center">
                    Select a date to view your tasks
                </Text>
            </View>
        );
    }

    if (tasks.length === 0) {
        return (
            <View className="flex-1 justify-center items-center py-12">
                <View className="bg-gray-50 p-6 rounded-full">
                    <CalendarIcon size={48} color="#6366f1" />
                </View>
                <Text className="mt-6 text-gray-500 text-lg text-center">
                    No tasks scheduled for this day
                </Text>
                <Text className="mt-2 text-gray-400 text-base text-center">
                    Tap the + button to add a task
                </Text>
            </View>
        );
    }

    return (
        <View className="px-4 py-2">
            <Text className="text-lg font-semibold text-gray-800 mb-4 ml-1">
                Tasks for {new Date(selectedDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                })}
            </Text>
            {tasks.map((task) => (
                <TouchableOpacity
                    key={task.id}
                    onPress={() => navigation.navigate('TaskDetails', { date: selectedDate })}
                    className="flex-row items-center bg-white mb-3 p-4 rounded-xl shadow-sm border border-gray-100"
                    style={{
                        shadowColor: '#6366f1',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.05,
                        shadowRadius: 4,
                        elevation: 2
                    }}
                >
                    <TouchableOpacity
                        onPress={(e) => {
                            e.stopPropagation();
                            toggleTask(selectedDate, task.id);
                        }}
                        className={`w-6 h-6 rounded-full border-2 mr-3 items-center justify-center
                            ${task.completed ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300'}`}
                    >
                        {task.completed && <Check size={16} color="white" />}
                    </TouchableOpacity>

                    <View className="flex-1">
                        <Text className={`text-base ${
                            task.completed ? 'text-gray-400 line-through' : 'text-gray-800'
                        }`}>
                            {task.text}
                        </Text>
                        {task.description && (
                            <Text className="text-gray-400 text-sm mt-1" numberOfLines={1}>
                                {task.description}
                            </Text>
                        )}
                    </View>

                    <ChevronRight size={20} color="#9ca3af" />
                </TouchableOpacity>
            ))}
        </View>
    );
}