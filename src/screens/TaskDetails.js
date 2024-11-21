import React, { useState, useEffect } from 'react';
import {
    View,
    FlatList,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    Dimensions
} from 'react-native';
import { TaskHeader } from '../components/TaskHeader';
import { TaskItem } from '../components/TaskItem';
import { EmptyTaskList } from '../components/EmptyTaskList';
import { AddTaskInput } from '../components/AddTaskInput';
import { TaskDetailsModal } from '../components/TaskDetailsModal';

// Initialize dimensions
const { width, height } = Dimensions.get('window');
const wp = (percentage) => (width * percentage) / 100;
const hp = (percentage) => (height * percentage) / 100;

export default function TaskDetails({ route, navigation }) {
    const { date } = route.params;
    const [task, setTask] = useState('');
    const [taskList, setTaskList] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [dimensions, setDimensions] = useState({
        width: width,
        height: height
    });

    // Handle keyboard events
    useEffect(() => {
        const showListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            () => setKeyboardVisible(true)
        );
        const hideListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => setKeyboardVisible(false)
        );

        return () => {
            showListener.remove();
            hideListener.remove();
        };
    }, []);

    // Handle dimension changes
    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setDimensions({ width: window.width, height: window.height });
            // Update wp and hp calculations based on new dimensions
            const newWp = (percentage) => (window.width * percentage) / 100;
            const newHp = (percentage) => (window.height * percentage) / 100;
        });

        return () => subscription?.remove();
    }, []);

    const addTask = () => {
        if (task.trim()) {
            const newTask = {
                id: Date.now().toString(),
                text: task,
                completed: false,
                createdAt: new Date(),
                description: '',
                dueTime: null
            };
            setTaskList(prevTasks => [...prevTasks, newTask]);
            setTask('');
            Keyboard.dismiss();
        }
    };

    const toggleTask = (id) => {
        setTaskList(prevTasks =>
            prevTasks.map(task =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    const deleteTask = (id) => {
        Alert.alert(
            "Delete Task",
            "Are you sure you want to delete this task?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    onPress: () => {
                        setTaskList(prevTasks => prevTasks.filter(task => task.id !== id));
                        setIsModalVisible(false);
                    },
                    style: "destructive"
                }
            ]
        );
    };

    const updateTaskDescription = (id, description) => {
        setTaskList(prevTasks =>
            prevTasks.map(task =>
                task.id === id ? { ...task, description } : task
            )
        );
    };

    // Calculate dynamic styles based on current dimensions
    const dynamicStyles = {
        container: {
            width: dimensions.width,
            height: dimensions.height
        },
        flatList: {
            maxHeight: dimensions.height * 0.8,
            width: dimensions.width * 0.92
        },
        inputBar: {
            minHeight: dimensions.height * 0.08,
            width: dimensions.width,
            paddingBottom: Platform.OS === 'ios' ? dimensions.height * 0.02 : 0
        }
    };

    return (
        <View className="flex-1 bg-gray-50" style={dynamicStyles.container}>
            <TaskHeader
                date={date}
                totalTasks={taskList.length}
                completedTasks={taskList.filter(t => t.completed).length}
                style={{
                    minHeight: hp(10),
                    paddingHorizontal: wp(4)
                }}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : hp(2)}
                style={{ width: dimensions.width }}
            >
                <FlatList
                    className="px-4"
                    data={taskList}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TaskItem
                            task={item}
                            onToggle={toggleTask}
                            onPress={() => {
                                Keyboard.dismiss();
                                setSelectedTask(item);
                                setIsModalVisible(true);
                            }}
                            style={{
                                minHeight: hp(8),
                                marginVertical: hp(1),
                                paddingHorizontal: wp(4)
                            }}
                        />
                    )}
                    ListEmptyComponent={
                        <EmptyTaskList
                            style={{
                                minHeight: hp(20),
                                paddingVertical: hp(2)
                            }}
                        />
                    }
                    contentContainerStyle={{
                        paddingBottom: hp(12),
                        width: dynamicStyles.flatList.width,
                        alignSelf: 'center'
                    }}
                    style={dynamicStyles.flatList}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                />

                <View
                    className="absolute left-0 right-0 bottom-0 bg-white border-t border-gray-200"
                    style={dynamicStyles.inputBar}
                >
                    <AddTaskInput
                        value={task}
                        onChangeText={setTask}
                        onSubmit={addTask}
                        style={{
                            padding: wp(4),
                            height: hp(7)
                        }}
                    />
                </View>
            </KeyboardAvoidingView>

            <TaskDetailsModal
                visible={isModalVisible}
                task={selectedTask}
                onClose={() => {
                    setIsModalVisible(false);
                    Keyboard.dismiss();
                }}
                onToggle={toggleTask}
                onDelete={deleteTask}
                onDescriptionChange={updateTaskDescription}
                style={{
                    container: {
                        marginTop: hp(24),
                        maxHeight: hp(70)
                    },
                    header: {
                        height: hp(7),
                        paddingHorizontal: wp(4)
                    },
                    content: {
                        padding: wp(4)
                    }
                }}
            />
        </View>
    );
}