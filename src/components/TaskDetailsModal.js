// components/TaskDetailsModal.js
import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Trash2, Check, X, Calendar, AlignLeft } from 'lucide-react-native';
import InputField from './InputField'; // Import InputField component

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
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    className="flex-1"
                    keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 80}
                >
                    <View className="flex-1 bg-white mt-16 rounded-t-3xl">
                        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                            <Text className="text-xl font-bold text-gray-800">Task Details</Text>
                            <TouchableOpacity onPress={onClose} className="p-2">
                                <X size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            className="flex-1"
                            keyboardShouldPersistTaps="handled"
                            keyboardDismissMode="interactive"
                        >
                            <View className="p-4">
                                <View className="flex-row items-center mb-6">
                                    <TouchableOpacity
                                        onPress={() => onToggle(task.id)}
                                        className={`w-6 h-6 rounded-full border-2 mr-3 items-center justify-center
                                            ${task.completed ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}
                                    >
                                        {task.completed && <Check size={16} color="white" />}
                                    </TouchableOpacity>
                                    <Text className={`text-xl ${task.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                                        {task.text}
                                    </Text>
                                </View>

                                <View className="space-y-4 mb-40">
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
                                        <InputField
                                            icon={<AlignLeft size={20} color="#666" />}
                                            placeholder="Add a description..."
                                            value={task.description}
                                            onChangeText={(text) => onDescriptionChange(task.id, text)}
                                            multiline
                                            isPassword={false}
                                            showPassword={false}
                                            setShowPassword={null}
                                            isLoading={false}
                                            autoCapitalize="sentences"
                                            keyboardType="default"
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
                            </View>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}
