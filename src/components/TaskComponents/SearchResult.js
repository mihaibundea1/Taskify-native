import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Calendar as CalendarIcon, ChevronRight, Search } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export function SearchResult({ results, onResultPress }) {
    const navigation = useNavigation();

    if (results.length === 0) {
        return (
            <View className="flex-1 justify-center items-center" style={{ paddingVertical: hp(6) }}>
                <View className="bg-gray-50 rounded-full" style={{ padding: wp(6) }}>
                    <Search size={wp(12)} color="#6366f1" />
                </View>
                <Text className="text-gray-500 text-center" 
                    style={{ 
                        marginTop: hp(3),
                        fontSize: wp(4.5)
                    }}>
                    No tasks found
                </Text>
            </View>
        );
    }

    return (
        <ScrollView className="flex-1">
            <View style={{ padding: wp(4) }}>
                {results.map((task) => (
                    <TouchableOpacity
                        key={task.id}
                        onPress={() => onResultPress(task)}
                        className="flex-row items-center bg-white rounded-xl shadow-sm border border-gray-100"
                        style={{
                            marginBottom: hp(1.5),
                            padding: wp(4),
                            shadowColor: '#6366f1',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.05,
                            shadowRadius: 4,
                            elevation: 2
                        }}
                    >
                        <View className="flex-1">
                            <Text className="text-gray-800" 
                                style={{ 
                                    fontSize: wp(4),
                                    fontWeight: 'bold'
                                }}>
                                {task.title}
                            </Text>
                            <Text className="text-gray-600"
                                style={{ 
                                    fontSize: wp(3.8), 
                                    marginTop: hp(0.5) 
                                }}>
                                {task.description}
                            </Text>
                            <View className="flex-row items-center" 
                                style={{ 
                                    marginTop: hp(1) 
                                }}>
                                <CalendarIcon size={wp(4)} color="#6B7280" />
                                <Text className="text-gray-500" 
                                    style={{ 
                                        marginLeft: wp(2),
                                        fontSize: wp(3.5)
                                    }}>
                                    {new Date(task.date).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })} - {task.time}
                                </Text>
                            </View>
                        </View>
                        <ChevronRight size={wp(5)} color="#9ca3af" />
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
}
