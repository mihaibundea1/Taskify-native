// TaskList.js
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Plus, Edit2, Trash2 } from 'lucide-react-native';
import { format } from 'date-fns';

export default function TaskList({ 
  selectedDate, 
  tasks, 
  onAddTask, 
  onEditTask, 
  onDeleteTask,
  searchQuery,
  onSearchChange,
}) {
  const dayTasks = tasks
    .filter(task => task.date === format(selectedDate, 'yyyy-MM-dd'))
    .sort((a, b) => {
      const timeCompare = a.time.localeCompare(b.time);
      if (timeCompare !== 0) return timeCompare;
      return a.title.localeCompare(b.title);
    });

  return (
    <View className="bg-white rounded-xl shadow-sm p-4">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-xl font-semibold text-gray-900">
          {format(selectedDate, 'MMMM d, yyyy')}
        </Text>
        <TouchableOpacity
          onPress={onAddTask}
          className="bg-blue-600 px-4 py-2 rounded-lg flex-row items-center"
        >
          <Plus color="white" size={20} />
          <Text className="text-white ml-2">Add</Text>
        </TouchableOpacity>
      </View>

      {dayTasks.length === 0 ? (
        <View className="py-8 items-center">
          <Text className="text-gray-500 text-center">
            No tasks scheduled for this day
          </Text>
        </View>
      ) : (
        <ScrollView className="space-y-2">
          {dayTasks.map((task) => (
            <View 
              key={task.id}
              className="p-4 bg-white border border-gray-200 rounded-lg mb-2"
            >
              <View className="flex-row justify-between items-center">
                <View>
                  <View className="flex-row items-center">
                    <Text className="text-sm font-medium text-blue-600">
                      {task.time}
                    </Text>
                    <Text className="text-sm font-medium text-gray-900 ml-2">
                      {task.title}
                    </Text>
                  </View>
                  {task.description && (
                    <Text className="text-sm text-gray-600 mt-1">
                      {task.description}
                    </Text>
                  )}
                </View>
                <View className="flex-row">
                  <TouchableOpacity
                    onPress={() => onEditTask(task)}
                    className="p-2"
                  >
                    <Edit2 size={16} color="#666" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => onDeleteTask(task.id)}
                    className="p-2"
                  >
                    <Trash2 size={16} color="#666" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}