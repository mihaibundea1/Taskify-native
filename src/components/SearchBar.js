import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, Keyboard } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { format } from 'date-fns';

export default function SearchBar({ tasks, onTaskSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');  // Starea pentru query-ul de căutare
  const [filteredTasks, setFilteredTasks] = useState([]); // Starea pentru task-urile filtrate

  // Folosim useEffect pentru a filtra task-urile pe măsură ce se schimbă searchQuery
  useEffect(() => {
    console.log('Tasks:', tasks);  // Verifică ce conține tasks
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const filtered = tasks.filter(task => {
        console.log('Task:', task);  // Verifică fiecare task în parte
        return (
          (task?.title && task.title.toLowerCase().includes(query)) ||
          (task?.description && task.description.toLowerCase().includes(query))
        );
      });
      setFilteredTasks(filtered);
    } else {
      setFilteredTasks([]);
    }
  }, [searchQuery, tasks]);
  

  // Funcția care se execută atunci când un task este selectat
  const handleTaskClick = (task) => {
    onTaskSelect(task);  // Apelează funcția de selecție a task-ului
    setIsOpen(false);     // Închide modalul
    setSearchQuery('');   // Resetează searchQuery
    Keyboard.dismiss();   // Ascunde tastatura
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => setIsOpen(true)}  // Deschide modalul când se apasă pe SearchBar
        className="flex-row items-center bg-white border border-gray-200 rounded-lg p-3"
      >
        <Search size={20} color="#666" />
        <Text className="ml-3 text-gray-500">Search tasks...</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setIsOpen(false);  // Închide modalul când se apasă în afară
          setSearchQuery(''); // Resetează searchQuery
        }}
      >
        <View className="flex-1 bg-black/50">
          <View className="flex-1 mt-16 bg-white rounded-t-3xl">
            <View className="px-4 py-4 border-b border-gray-200">
              <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
                <Search size={20} color="#666" />
                <TextInput
                  value={searchQuery}  // Valoarea câmpului de input
                  onChangeText={setSearchQuery} // Actualizează searchQuery în timp real
                  placeholder="Search tasks..."
                  className="flex-1 ml-2 text-base"
                  autoFocus
                />
                {searchQuery ? (
                  <TouchableOpacity
                    onPress={() => setSearchQuery('')} // Șterge textul când apesi pe "X"
                    className="p-1"
                  >
                    <X size={20} color="#666" />
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>

            <ScrollView className="flex-1">
              {filteredTasks.map((task) => (
                <TouchableOpacity
                  key={task.id}
                  onPress={() => handleTaskClick(task)} // Apelează funcția de selecție a task-ului
                  className="px-4 py-3 border-b border-gray-100 active:bg-gray-50"
                >
                  <Text className="font-medium text-gray-900">
                    {task.title}
                  </Text>
                  <Text className="text-sm text-gray-500 mt-1">
                    {format(new Date(task.date), 'dd MMMM yyyy')} • {task.time}
                  </Text>
                  {task.description ? (
                    <Text className="text-sm text-gray-600 mt-1" numberOfLines={1}>
                      {task.description}
                    </Text>
                  ) : null}
                </TouchableOpacity>
              ))}

              {searchQuery && filteredTasks.length === 0 && (
                <View className="p-4">
                  <Text className="text-center text-gray-500">
                    No tasks found matching "{searchQuery}"
                  </Text>
                </View>
              )}
            </ScrollView>

            <TouchableOpacity
              onPress={() => {
                setIsOpen(false);
                setSearchQuery(''); // Resetează searchQuery când se închide modalul
              }}
              className="px-4 py-4 border-t border-gray-200"
            >
              <Text className="text-center text-blue-600 font-medium">
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
