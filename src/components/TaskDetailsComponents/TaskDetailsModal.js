// components/TaskDetailsComponents/TaskDetailsModal.js
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
import { Trash2, Check, X, Calendar, AlignLeft } from 'lucide-react-native';

export function TaskDetailsModal({
    visible,
    task,
    onClose,
    onToggle,
    onDelete,
    onDescriptionChange
}) {
    // Local state for managing description changes
    const [localDescription, setLocalDescription] = useState('');
    const [isCompleted, setIsCompleted] = useState(false);

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

    if (!task) return null;

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={handleClose}
        >
            <TouchableWithoutFeedback onPress={dismissKeyboard}>
                <View className="flex-1 bg-black/50">
                    <View className="flex-1 bg-white mt-24 rounded-t-3xl">
                        {/* Header */}
                        <View className="flex-row justify-between items-center p-6 border-b border-gray-100">
                            <View className="flex-1">
                                <Text className="text-2xl font-bold text-gray-900">Task Details</Text>
                                <Text className="text-gray-500 text-sm mt-1">
                                    Created {new Date(task.createdAt).toLocaleDateString()}
                                </Text>
                            </View>
                            <TouchableOpacity 
                                onPress={handleClose}
                                className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
                            >
                                <X size={20} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView 
                            className="flex-1 px-6"
                            keyboardShouldPersistTaps="handled"
                            keyboardDismissMode="on-drag"
                        >
                            {/* Task Title */}
                            <View className="flex-row items-center py-6 border-b border-gray-100">
                                <TouchableOpacity
                                    onPress={handleToggle}
                                    activeOpacity={0.7}
                                    className={`w-7 h-7 rounded-full border-2 mr-4 items-center justify-center
                                        ${isCompleted ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300'}`}
                                >
                                    {isCompleted && <Check size={18} color="white" />}
                                </TouchableOpacity>
                                <Text className={`text-xl ${
                                    isCompleted ? 'text-gray-400 line-through' : 'text-gray-800'
                                }`}>
                                    {task.text}
                                </Text>
                            </View>

                            {/* Description Section */}
                            <View className="py-6 space-y-4">
                                <View className="flex-row items-center">
                                    <AlignLeft size={20} color="#6B7280" />
                                    <Text className="text-gray-800 font-medium text-lg ml-2">
                                        Description
                                    </Text>
                                </View>
                                <View className="bg-gray-50 rounded-xl p-4">
                                    <TextInput
                                        className="text-gray-700 text-base min-h-[100px]"
                                        multiline
                                        placeholder="Add details about your task..."
                                        placeholderTextColor="#9CA3AF"
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
                                className="bg-red-50 p-4 rounded-xl flex-row items-center justify-center my-6"
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