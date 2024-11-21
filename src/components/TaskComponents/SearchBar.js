// components/TaskComponents/SearchBar.js
import React from 'react';
import { View, TextInput, TouchableOpacity, Animated } from 'react-native';
import { Search, X } from 'lucide-react-native';

export function SearchBar({ value, onChangeText, onClear, style }) {
    return (
        <View 
            className="px-4 py-3 bg-white border-b border-gray-100"
            style={style}
        >
            <View className="flex-row items-center bg-gray-50 rounded-xl px-4 h-12">
                <Search size={20} color="#6B7280" />
                <TextInput
                    className="flex-1 ml-3 text-base text-gray-800"
                    placeholder="Search tasks..."
                    placeholderTextColor="#9CA3AF"
                    value={value}
                    onChangeText={onChangeText}
                />
                {value ? (
                    <TouchableOpacity onPress={onClear}>
                        <X size={20} color="#6B7280" />
                    </TouchableOpacity>
                ) : null}
            </View>
        </View>
    );
}
