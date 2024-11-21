// components/TaskComponents/SearchResults.js
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Calendar as CalendarIcon, ChevronRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export function SearchResults({ results, onResultPress }) {
    const navigation = useNavigation();

    if (results.length === 0) {
        return (
            <View className="flex-1 justify-center items-center py-12">
                <View className="bg-gray-50 p-6 rounded-full">
                    <Search size={48} color="#6366f1" />
                </View>
                <Text className="mt-6 text-gray-500 text-lg text-center">
                    No tasks found
                </Text>
            </View>
        );
    }

    return (
        <ScrollView className="flex-1">
            <View className="p-4">
                {results.map((result) => (
                    <TouchableOpacity
                        key={result.id}
                        onPress={() => onResultPress(result)}
                        className="flex-row items-center bg-white mb-3 p-4 rounded-xl shadow-sm border border-gray-100"
                        style={{
                            shadowColor: '#6366f1',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.05,
                            shadowRadius: 4,
                            elevation: 2
                        }}
                    >
                        <View className="flex-1">
                            <Text className="text-base text-gray-800">
                                {result.text}
                            </Text>
                            <View className="flex-row items-center mt-2">
                                <CalendarIcon size={16} color="#6B7280" />
                                <Text className="ml-2 text-sm text-gray-500">
                                    {new Date(result.date).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </Text>
                            </View>
                        </View>
                        <ChevronRight size={20} color="#9ca3af" />
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
}