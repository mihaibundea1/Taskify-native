import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    ScrollView,
    TextInput,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';
import { Trash2, Check, X, Calendar, AlignLeft, Clock } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext'; // Importă contextul de temă
import DateTimePicker from '@react-native-community/datetimepicker';


export function TaskDetailsModal({
    visible,
    task,
    onClose,
    onToggle,
    onDelete,
    onDescriptionChange,
    onUpdateTask
}) {
    // Local state for managing description changes
    const [localDescription, setLocalDescription] = useState('');
    const [localTime, setLocalTime] = useState('');
    const [localTitle, setLocalTitle] = useState('');
    const [isCompleted, setIsCompleted] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    // Update local state when task changes
    useEffect(() => {
        if (task) {
            setLocalDescription(task.description || '');
            setIsCompleted(task.completed || false);
        }
    }, [task]);

    // Handle description changes with debounce
    useEffect(() => {
        if (task && localDescription !== task.description) {
            const timeoutId = setTimeout(() => {
                onDescriptionChange(task.id, localDescription);
            }, 500);

            return () => clearTimeout(timeoutId);
        }
    }, [localDescription]);

    const handleTimeChange = (event, selectedTime) => {
        setShowTimePicker(false);
        if (selectedTime) {
            const timeString = selectedTime.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
            setLocalTime(timeString);

            // Actualizează task-ul cu noua oră
            if (onUpdateTask) {
                onUpdateTask(task.id, {
                    ...task,
                    time: timeString
                });
            }
        }
    };

    const handleTitleChange = (newTitle) => {
        setLocalTitle(newTitle);
        if (onUpdateTask) {
            onUpdateTask(task.id, {
                ...task,
                title: newTitle
            });
        }
    };

    // Handle task toggle
    const handleToggle = () => {
        if (task) {
            setIsCompleted(!isCompleted);
            onToggle(task.id);
        }
    };

    // Handle modal close
    const handleClose = () => {
        Keyboard.dismiss();
        onClose();
    };

    // Dismiss keyboard when clicking outside TextInput
    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    const { isDarkMode } = useTheme(); // Folosește contextul de temă

    if (!task) return null;

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={handleClose}
        >
            <TouchableWithoutFeedback onPress={dismissKeyboard}>
                <View className={`flex-1 ${isDarkMode ? 'bg-black/50' : 'bg-black/50'}`}>
                    <View className={`flex-1 mt-24 rounded-t-3xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        {/* Header */}
                        <View className={`flex-row justify-between items-center p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                            <View className="flex-1">
                                <Text className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Task Details</Text>
                                <Text className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Created {new Date(task.date).toLocaleDateString()} {/* Folosește data corectă */}
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={handleClose}
                                className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
                            >
                                <X size={20} color={isDarkMode ? '#555555' : '#6B7280'} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView className="flex-1 px-6">
                            {/* Titlu editabil */}
                            <View className={`flex-row items-center py-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                                <TouchableOpacity
                                    onPress={handleToggle}
                                    className={`w-7 h-7 rounded-full border-2 mr-4 items-center justify-center
                                        ${isCompleted ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300'}`}
                                >
                                    {isCompleted && <Check size={18} color="white" />}
                                </TouchableOpacity>
                                <TextInput
                                    className={`text-xl flex-1 ${isCompleted ? 'text-gray-400 line-through' : isDarkMode ? 'text-white' : 'text-gray-800'}`}
                                    value={localTitle}
                                    onChangeText={handleTitleChange}
                                    placeholder="Task title"
                                    placeholderTextColor={isDarkMode ? '#9CA3AF' : '#9CA3AF'}
                                />
                            </View>

                            {/* Time Picker Section */}
                            <View className={`py-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                                <TouchableOpacity
                                    onPress={() => setShowTimePicker(true)}
                                    className="flex-row items-center"
                                >
                                    <Clock size={20} color={isDarkMode ? '#F3F4F6' : '#6B7280'} />
                                    <Text className={`ml-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                        Time: {localTime || 'Set time'}
                                    </Text>
                                </TouchableOpacity>

                                {showTimePicker && (
                                    <DateTimePicker
                                        value={localTime ? new Date(`2000-01-01T${localTime}`) : new Date()}
                                        mode="time"
                                        is24Hour={true}
                                        display="default"
                                        onChange={handleTimeChange}
                                    />
                                )}
                            </View>

                            {/* Description Section */}
                            <View className="py-6 space-y-4">
                                <View className="flex-row items-center">
                                    <AlignLeft size={20} color={isDarkMode ? '#F3F4F6' : '#6B7280'} />
                                    <Text className={`text-lg ml-2 ${isDarkMode ? 'text-white' : 'text-gray-800'} font-medium`}>
                                        Description
                                    </Text>
                                </View>
                                <View className={`bg-gray-50 rounded-xl p-4 ${isDarkMode ? 'bg-gray-700' : ''}`}>
                                    <TextInput
                                        className={`text-base min-h-[100px] ${isDarkMode ? 'text-white' : 'text-gray-700'}`}
                                        multiline
                                        placeholder="Add details about your task..."
                                        placeholderTextColor={isDarkMode ? '#9CA3AF' : '#9CA3AF'}
                                        value={localDescription}
                                        onChangeText={setLocalDescription}
                                        textAlignVertical="top"
                                        returnKeyType="done"
                                        blurOnSubmit={true}
                                        onBlur={() => {
                                            if (task.description !== localDescription) {
                                                onDescriptionChange(task.id, localDescription);
                                            }
                                        }}
                                    />
                                </View>
                            </View>

                            {/* Delete Button */}
                            <TouchableOpacity
                                onPress={() => onDelete(task.id)}
                                activeOpacity={0.7}
                                className={`bg-red-50 p-4 rounded-xl flex-row items-center justify-center my-6 ${isDarkMode ? 'bg-red-800' : ''}`}
                            >
                                <Trash2 size={20} color="#EF4444" className="mr-2" />
                                <Text className="text-red-500 font-medium">Delete Task</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}
