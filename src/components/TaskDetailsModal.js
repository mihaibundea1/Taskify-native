// components/TaskDetailsModal.js
import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native';
import { Trash2, Check, X, Calendar, AlignLeft } from 'lucide-react-native';

export function TaskDetailsModal({
    visible,
    task,
    onClose,
    onToggle,
    onDelete,
    onDescriptionChange
}) {
    if (!task) return null;

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/50">
                <View className="flex-1 bg-white mt-24 rounded-t-3xl">
                    <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                        <Text className="text-xl font-bold text-gray-800">Task Details</Text>
                        <TouchableOpacity onPress={onClose} className="p-2">
                            <X size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView className="flex-1 p-4"
                        keyboardShouldPersistTaps="handled"
                        keyboardDismissMode="on-drag">
                        <View className="flex-row items-center mb-6">
                            <TouchableOpacity
                                onPress={() => onToggle(task.id)}
                                className={`w-6 h-6 rounded-full border-2 mr-3 items-center justify-center
                  ${task.completed ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}
                            >
                                {task.completed && <Check size={16} color="white" />}
                            </TouchableOpacity>
                            <Text className={`text-xl ${task.completed ? 'text-gray-400 line-through' : 'text-gray-800'
                                }`}>
                                {task.text}
                            </Text>
                        </View>

                        <View className="space-y-4">
                            <View className="flex-row items-center">
                                <Calendar size={20} color="#666" className="mr-2" />
                                <Text className="text-gray-600">
                                    Created: {new Date(task.createdAt).toLocaleDateString()}
                                </Text>
                            </View>

                            <View className="bg-gray-50 p-4 rounded-xl">
                                <View className="flex-row items-center mb-2">
                                    <AlignLeft size={20} color="#666" className="mr-2" />
                                    <Text className="text-gray-800 font-medium">Description</Text>
                                </View>
                                <TextInput
                                    className="text-gray-600"
                                    multiline
                                    placeholder="Add a description..."
                                    value={task.description}
                                    onChangeText={(text) => onDescriptionChange(task.id, text)}
                                />
                            </View>

                            <TouchableOpacity
                                onPress={() => onDelete(task.id)}
                                className="bg-red-50 p-4 rounded-xl flex-row items-center justify-center mt-4"
                            >
                                <Trash2 size={20} color="#EF4444" className="mr-2" />
                                <Text className="text-red-500 font-medium">Delete Task</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}