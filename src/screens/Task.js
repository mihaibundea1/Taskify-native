// screens/TaskScreen.js
import React, { useState, useCallback } from 'react';
import { View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTask } from '../context/TaskContext';
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
        searchTasks
    } = useTask();

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = useCallback((text) => {
        setSearchQuery(text);
        if (text.trim()) {
            const results = searchTasks(text);
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    }, [searchTasks]);

    const handleSearchResultPress = (task) => {
        setSearchQuery('');
        setSearchResults([]);
        setSelectedDate(task.date);
        navigation.navigate('TaskDetails', { date: task.date });
    };

    const handleAddTask = (date) => {
        if (!date) {
            const today = new Date().toISOString().split('T')[0];
            setSelectedDate(today);
            navigation.navigate('TaskDetails', { date: today });
        } else {
            navigation.navigate('TaskDetails', { date });
        }
    };

    const handleDayPress = (day) => {
        setSelectedDate(day.dateString);
    };

    return (
        <View 
            className="flex-1 bg-gray-50"
            style={{ paddingTop: insets.top }}
        >
            <Header />
            
            <SearchBar
                value={searchQuery}
                onChangeText={handleSearch}
                onClear={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                }}
            />

            {searchQuery ? (
                <SearchResults
                    results={searchResults}
                    onResultPress={handleSearchResultPress}
                />
            ) : (
                <ScrollView className="flex-1">
                    <CustomCalendar
                        selectedDate={selectedDate}
                        onDayPress={handleDayPress}
                        markedDates={{
                            ...getMarkedDates(),
                            [selectedDate]: { 
                                ...getMarkedDates()[selectedDate],
                                selected: true, 
                                selectedColor: '#6366f1',
                            }
                        }}
                    />
                    
                    <TaskList selectedDate={selectedDate} />
                </ScrollView>
            )}

            <FloatingButton 
                onPress={() => handleAddTask(selectedDate)}
            />
        </View>
    );
}