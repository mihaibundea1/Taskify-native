import React, { useState, useCallback, useMemo } from 'react';
import { View, ScrollView, Platform, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTask } from '../context/TaskContext'; // Ensure you are using the correct hook
import Header from '../components/TaskComponents/Header';
import { SearchBar } from '../components/TaskComponents/SearchBar';
import { SearchResults } from '../components/TaskComponents/SearchResult';
import CustomCalendar from '../components/TaskComponents/CustomCalendar';
import TaskList from '../components/TaskComponents/TaskList';
import FloatingButton from '../components/TaskComponents/FloatingButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Task() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const {
    selectedDate,
    setSelectedDate,
    getMarkedDates,
    searchTasks,
    refreshTasks, // Ensure this is being accessed from context
  } = useTask();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refresh tasks when the screen is focused
  useFocusEffect(
    useCallback(() => {
      refreshTasks(); // Call refreshTasks here
    }, [refreshTasks]) // Make sure refreshTasks is available
  );

  // Handle search input and filter results
  const handleSearch = useCallback((text) => {
    setSearchQuery(text);
    if (text.trim()) {
      const results = searchTasks(text);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchTasks]);

  // Handle when a search result is pressed
  const handleSearchResultPress = useCallback((task) => {
    setSearchQuery('');  // Clear search query
    setSearchResults([]); // Clear search results
    setSelectedDate(task.date); // Set the selected date to the task's date
    navigation.navigate('TaskDetails', { date: task.date }); // Navigate to TaskDetails screen
  }, [navigation, setSelectedDate]);

  // Handle adding a task
  const handleAddTask = useCallback((date) => {
    const taskDate = date || new Date().toISOString().split('T')[0]; // Use current date if not provided
    if (!date) {
      setSelectedDate(taskDate); // Set the selected date if none is passed
    }
    navigation.navigate('TaskDetails', { date: taskDate }); // Navigate to TaskDetails screen
  }, [navigation, setSelectedDate]);

  // Handle day press on calendar
  const handleDayPress = useCallback((day) => {
    setSelectedDate(day.dateString); // Set the selected date
  }, [setSelectedDate]);

  // Handle pull-to-refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refreshTasks(); // Ensure refreshTasks is available and called
    setIsRefreshing(false);
  }, [refreshTasks]);

  // Memoize marked dates for the calendar
  const markedDates = useMemo(() => {
    return {
      ...getMarkedDates(),
      [selectedDate]: {
        ...getMarkedDates()[selectedDate],
        selected: true,
        selectedColor: '#6366f1',
      }
    };
  }, [getMarkedDates, selectedDate]);

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-gray-50 z-10 shadow-sm">
        <Header />
        <SearchBar
          value={searchQuery}
          onChangeText={handleSearch}
          onClear={useCallback(() => {
            setSearchQuery('');
            setSearchResults([]);
          }, [])}
        />
      </View>

      {searchQuery ? (
        <SearchResults
          results={searchResults}
          onResultPress={handleSearchResultPress}
          className="flex-1 mx-4"
        />
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerClassName="grow"
          showsVerticalScrollIndicator={false}
          refreshControl={
            Platform.OS === 'ios' ? (
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor="#6366f1"
              />
            ) : null
          }
        >
          <View className="mx-4 my-2">
            <View className="bg-white rounded-xl shadow-sm">
              <CustomCalendar
                selectedDate={selectedDate}
                onDayPress={handleDayPress}
                markedDates={markedDates}
              />
            </View>
          </View>

          <View className="flex-1 mx-4 mt-2">
            <TaskList selectedDate={selectedDate} />
          </View>

          <View className="h-24" />
        </ScrollView>
      )}

      <View className="absolute bottom-6 right-4">
        <FloatingButton onPress={() => handleAddTask(selectedDate)} />
      </View>
    </View>
  );
}
