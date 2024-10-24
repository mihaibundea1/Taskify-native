import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Plus } from 'lucide-react-native';  // Correct import for React Native
import { useNavigation } from '@react-navigation/native';

export default function Task() {
  const [selectedDate, setSelectedDate] = useState('');
  const [tasks, setTasks] = useState({});
  const navigation = useNavigation();

  const handleAddTask = (date) => {
    navigation.navigate('TaskDetails', { date });
  };

  const renderTaskList = () => {
    return tasks[selectedDate] ? (
      <FlatList
        data={tasks[selectedDate]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.taskItem}>{item}</Text>}
      />
    ) : (
      <Text style={styles.noTaskText}>No tasks for this day</Text>
    );
  };

  return (
    <View style={styles.container}>
      {/* Calendar în mijloc */}
      <Calendar
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
          handleAddTask(day.dateString);
        }}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: 'blue' },
        }}
      />
      
      {/* Lista de task-uri pentru ziua selectată */}
      <View style={styles.taskListContainer}>
        {selectedDate ? renderTaskList() : <Text style={styles.noDateText}>Select a date</Text>}
      </View>

      {/* Buton de adăugare taskuri în colțul dreapta sus */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => handleAddTask(selectedDate)}
      >
        <Plus name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  taskListContainer: {
    flex: 1,
    padding: 20,
  },
  noTaskText: {
    textAlign: 'center',
    color: 'gray',
  },
  taskItem: {
    fontSize: 16,
    paddingVertical: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  noDateText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
  },
  addButton: {
    position: 'absolute',
    top: 0,
    right: 10,
    backgroundColor: '#007AFF',
    borderRadius: 30,
    padding: 10,
    elevation: 5,
  },
});
