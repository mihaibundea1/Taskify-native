import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Calendar as CalendarIcon, Check, ChevronRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTask } from '../../context/TaskContext';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTheme } from '../../context/ThemeContext'; // Importăm contextul de temă

export default function TaskList({ selectedDate }) {
    const navigation = useNavigation();
    const { getTasksForDate, toggleTask } = useTask();
    const { isDarkMode } = useTheme(); // Obținem tema activă
    const tasks = getTasksForDate(selectedDate);

    if (!selectedDate) {
        return (
            <View className="flex-1 justify-center items-center" style={{ paddingVertical: hp(6) }}>
                <View className="bg-gray-50 rounded-full" style={{ padding: wp(6) }}>
                    <CalendarIcon size={wp(4)} color="#007BFF" />
                </View>
                <Text 
                    className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-center`} 
                    style={{ marginTop: hp(3), fontSize: wp(3) }}
                >
                    Select a date to view your tasks
                </Text>
            </View>
        );
    }

    if (tasks.length === 0) {
        return (
            <View className="flex-1 justify-center items-center" style={{ paddingVertical: hp(6) }}>
                <View className="bg-gray-50 rounded-full" style={{ padding: wp(6) }}>
                    <CalendarIcon size={wp(12)} color="#007BFF" />
                </View>
                <Text 
                    className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-center`} 
                    style={{ marginTop: hp(3), fontSize: wp(4.5) }}
                >
                    No tasks scheduled for this day
                </Text>
                <Text 
                    className={`${isDarkMode ? 'text-gray-500' : 'text-gray-400'} text-center`} 
                    style={{ marginTop: hp(1), fontSize: wp(4) }}
                >
                    Tap the + button to add a task
                </Text>
            </View>
        );
    }

    return (
        <View style={{ paddingHorizontal: wp(4), paddingVertical: hp(1) }}>
            <Text 
                className={`${isDarkMode ? 'text-gray-100' : 'text-gray-800'} font-semibold`} 
                style={{ fontSize: wp(4.5), marginBottom: hp(2), marginLeft: wp(0.5) }}
            >
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
                    className="flex-row items-center"
                    style={{
                        marginBottom: hp(1.5),
                        padding: wp(4),
                        backgroundColor: isDarkMode ? '#2d3748' : 'white', // Fundalul task-ului
                        borderRadius: wp(2),
                        borderWidth: 1,
                        borderColor: isDarkMode ? '#4a5568' : '#e5e7eb', // Culoarea graniței
                        shadowColor: isDarkMode ? '#007BFF' : '#000000', // Umbra
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
                        className={`rounded-full border-2 items-center justify-center
                            ${task.completed ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300'}`}
                        style={{
                            width: wp(6),
                            height: wp(6),
                            marginRight: wp(3)
                        }}
                    >
                        {task.completed && <Check size={wp(4)} color="white" />}
                    </TouchableOpacity>

                    <View className="flex-1">
                        <Text 
                            className={`${task.completed ? 'text-gray-400 line-through' : isDarkMode ? 'text-gray-100' : 'text-gray-800'}`} 
                            style={{ fontSize: wp(4) }}
                        >
                            {task.title}  {/* Afișează titlul task-ului */}
                        </Text>
                        {task.description && (
                            <Text 
                                className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} 
                                style={{ fontSize: wp(3.5), marginTop: hp(0.5) }} 
                                numberOfLines={1}
                            >
                                {task.description} {/* Afișează descrierea task-ului */}
                            </Text>
                        )}
                        <Text 
                            className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} 
                            style={{ fontSize: wp(3), marginTop: hp(0.5) }}
                        >
                            {task.time} {/* Afișează ora task-ului */}
                        </Text>
                    </View>

                    <ChevronRight size={wp(5)} color={isDarkMode ? '#cbd5e1' : '#9ca3af'} />
                </TouchableOpacity>
            ))}
        </View>
    );
}
