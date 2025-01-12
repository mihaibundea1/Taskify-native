import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, Keyboard } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { format } from 'date-fns';
import { useTheme } from '../context/ThemeContext'; // Importă contextul tematic

export default function SearchBar({ tasks, onTaskSelect }) {
  const { isDarkMode } = useTheme(); // Obține tema din context
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTasks, setFilteredTasks] = useState([]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const filtered = tasks.filter(task => 
        task?.title?.toLowerCase().includes(query) ||
        task?.description?.toLowerCase().includes(query) || false
      );
      setFilteredTasks(filtered);
    } else {
      setFilteredTasks([]);
    }
  }, [searchQuery, tasks]);

  const handleTaskClick = (task) => {
    onTaskSelect(task);
    setIsOpen(false);
    setSearchQuery('');
    Keyboard.dismiss();
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        className={`flex-row items-center border rounded-lg p-3 
          ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
      >
        <Search size={20} color={isDarkMode ? '#A1A1AA' : '#666'} />
        <Text className={`ml-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
          Search tasks...
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setIsOpen(false);
          setSearchQuery('');
        }}
      >
        <View className={`flex-1 ${isDarkMode ? 'bg-black/70' : 'bg-black/50'}`}>
          <View className={`flex-1 mt-16 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-t-3xl`}>
            <View className={`px-4 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <View className={`flex-row items-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg px-3 py-2`}>
                <Search size={20} color={isDarkMode ? '#A1A1AA' : '#666'} />
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search tasks..."
                  className={`flex-1 ml-2 text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                  autoFocus
                />
                {searchQuery ? (
                  <TouchableOpacity
                    onPress={() => setSearchQuery('')}
                    className={`p-1 ${isDarkMode ? 'text-white' : 'text-gray-600'}`}
                  >
                    <X size={20} />
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>

            <ScrollView className="flex-1">
              {filteredTasks.map((task) => (
                <TouchableOpacity
                  key={task.id}
                  onPress={() => handleTaskClick(task)}
                  className={`px-4 py-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} active:bg-gray-50`}
                >
                  <Text className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {task.title}
                  </Text>
                  <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                    {format(new Date(task.date), 'dd MMMM yyyy')} • {task.time}
                  </Text>
                  {task.description ? (
                    <Text className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`} numberOfLines={1}>
                      {task.description}
                    </Text>
                  ) : null}
                </TouchableOpacity>
              ))}

              {searchQuery && filteredTasks.length === 0 && (
                <View className="p-4">
                  <Text className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No tasks found matching "{searchQuery}"
                  </Text>
                </View>
              )}
            </ScrollView>

            <TouchableOpacity
              onPress={() => {
                setIsOpen(false);
                setSearchQuery('');
              }}
              className={`px-4 py-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
            >
              <Text className={`text-center ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} font-medium`}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
