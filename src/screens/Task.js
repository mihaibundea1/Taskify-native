import React, { useState, useCallback, useMemo } from 'react';
import { View, ScrollView, Platform, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTask } from '../context/TaskContext';
import Header from '../components/TaskComponents/Header';
import { SearchBar } from '../components/TaskComponents/SearchBar';
import { SearchResult } from '../components/TaskComponents/SearchResult';
import CustomCalendar from '../components/TaskComponents/CustomCalendar';
import TaskList from '../components/TaskComponents/TaskList';
import FloatingButton from '../components/TaskComponents/FloatingButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext'; // Importă contextul de temă

export default function Task() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme(); // Obține tema din context

  const {
    selectedDate,
    setSelectedDate,
    getMarkedDates,
    searchTasks,
    refreshTasks,
  } = useTask();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Optimized refresh effect
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      const refresh = async () => {
        if (isMounted && !isRefreshing) {
          setIsRefreshing(true);
          await refreshTasks();
          if (isMounted) {
            setIsRefreshing(false);
          }
        }
      };
      refresh();

      return () => {
        isMounted = false;
      };
    }, [])
  );

  // Memoized search handler
  const handleSearch = useCallback((text) => {
    if (text === undefined) return; // Previne procesarea dacă text este undefined
    
    setSearchQuery(text);
    if (text && text.trim()) {
        const results = searchTasks(text);
        setSearchResult(results || []); // Asigură-te că results nu este undefined
    } else {
        setSearchResult([]);
    }
}, [searchTasks]);

  // Memoized search result press handler
  const handleSearchResultPress = useCallback((task) => {
    setSearchQuery('');
    setSearchResult([]);
    setSelectedDate(task.date);
    navigation.navigate('TaskDetails', { date: task.date });
    
  }, [navigation, setSelectedDate]);

  // Memoized add task handler
  // const handleAddTask = useCallback((date) => {
  //   const taskDate = date || new Date().toISOString().split('T')[0];
  //   if (taskDate !== selectedDate) {
  //     setSelectedDate(taskDate);
  //   }
  //   navigation.navigate('TaskDetails', { date: taskDate });
  // }, [navigation, setSelectedDate, selectedDate]);
  const handleAddTask = useCallback((date) => {
    console.log('handleAddTask invoked with date:', date);
    const taskDate = date || new Date().toISOString().split('T')[0];
    setSelectedDate(taskDate);
    navigation.navigate('TaskForm', { date: taskDate });
  }, [navigation, setSelectedDate]);

  // Memoized day press handler
  const handleDayPress = useCallback((day) => {
    if (day.dateString !== selectedDate) {
      setSelectedDate(day.dateString);
    }
  }, [selectedDate, setSelectedDate]);

  // Memoized refresh handler
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refreshTasks();
    setIsRefreshing(false);
  }, [refreshTasks]);

  // Memoized marked dates
  const markedDates = useMemo(() => {
    const marked = getMarkedDates();
    return {
      ...marked,
      [selectedDate]: {
        ...marked[selectedDate],
        selected: true,
        selectedColor: '#6366f1',
      },
    };
  }, [getMarkedDates, selectedDate]);

  return (
    <View className={`flex-1 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <View className={`bg-gray-50 z-10 shadow-sm`}>
        <Header />
        <SearchBar
          value={searchQuery}
          onChangeText={handleSearch}
          onClear={() => {
            setSearchQuery('');
            setSearchResult([]);
          }}
        />
      </View>

      {searchQuery ? (
        <SearchResult
          results={searchResult}
          onResultPress={handleSearchResultPress}
          className="flex-1 mx-4"
        />
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerClassName="grow"
          showsVerticalScrollIndicator={false}
          refreshControl={Platform.OS === 'ios' && (
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#6366f1"
            />
          )}
        >
          <View className="mx-4 my-4">
            <View className={`bg-white ${isDarkMode ? 'bg-gray-700' : 'bg-white'} rounded-xl shadow-sm`}>
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
        <FloatingButton onPress={() => {handleAddTask(selectedDate),
        console.log('handleAddTask invoked with date:', selectedDate);
        }
          
        } />
      </View>
    </View>
  );
}
