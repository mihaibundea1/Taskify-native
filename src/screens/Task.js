import React, { useState, useCallback, useMemo } from 'react';
import { View, ScrollView, Dimensions, Platform, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTask } from '../context/TaskContext';
import Header from '../components/TaskComponents/Header';
import { SearchBar } from '../components/TaskComponents/SearchBar';
import { SearchResults } from '../components/TaskComponents/SearchResult';
import CustomCalendar from '../components/TaskComponents/CustomCalendar';
import TaskList from '../components/TaskComponents/TaskList';
import FloatingButton from '../components/TaskComponents/FloatingButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function Task() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const {
    selectedDate,
    setSelectedDate,
    getMarkedDates,
    searchTasks,
    refreshTasks
  } = useTask();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refresh tasks when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refreshTasks?.();
    }, [refreshTasks])
  );

  const handleSearch = useCallback((text) => {
    setSearchQuery(text);
    if (text.trim()) {
      const results = searchTasks(text);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchTasks]);

  const handleSearchResultPress = useCallback((task) => {
    setSearchQuery('');
    setSearchResults([]);
    setSelectedDate(task.date);
    navigation.navigate('TaskDetails', { date: task.date });
  }, [navigation, setSelectedDate]);

  const handleAddTask = useCallback((date) => {
    const taskDate = date || new Date().toISOString().split('T')[0];
    if (!date) {
      setSelectedDate(taskDate);
    }
    navigation.navigate('TaskDetails', { date: taskDate });
  }, [navigation, setSelectedDate]);

  const handleDayPress = useCallback((day) => {
    setSelectedDate(day.dateString);
  }, [setSelectedDate]);

  const handleRefresh = useCallback(async () => {
    if (refreshTasks) {
      setIsRefreshing(true);
      await refreshTasks();
      setIsRefreshing(false);
    }
  }, [refreshTasks]);

  const markedDates = useMemo(() => ({
    ...getMarkedDates(),
    [selectedDate]: {
      ...getMarkedDates()[selectedDate],
      selected: true,
      selectedColor: '#6366f1',
    }
  }), [getMarkedDates, selectedDate]);

  return (
    <View 
      className="flex-1 bg-gray-50 "
    >
      {/* Fixed Header Section */}
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

      {/* Scrollable Content */}
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
          {/* Calendar Section */}
          <View className="mx-4 my-2">
            <View className="bg-white rounded-xl shadow-sm">
              <CustomCalendar
                selectedDate={selectedDate}
                onDayPress={handleDayPress}
                markedDates={markedDates}
              />
            </View>
          </View>
          
          {/* Task List Section */}
          <View className="flex-1 mx-4 mt-2">
            <TaskList selectedDate={selectedDate} />
          </View>
          
          {/* Bottom Padding for FloatingButton */}
          <View className="h-24" />
        </ScrollView>
      )}

      {/* Floating Button - always on top */}
      <View className="absolute bottom-6 right-4">
        <FloatingButton onPress={() => handleAddTask(selectedDate)} />
      </View>
    </View>
  );
}