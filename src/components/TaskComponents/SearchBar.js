import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native'; // Adăugăm Text la import
import { Search, X } from 'lucide-react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTheme } from '../../context/ThemeContext';

export function SearchBar({ value, onChangeText, onClear, style }) {
    const { isDarkMode } = useTheme();

    return (
        <View 
            className="border-b"
            style={[{
                paddingHorizontal: wp(4),
                paddingVertical: hp(1.5),
                backgroundColor: isDarkMode ? '#1e293b' : 'white',
                borderBottomColor: isDarkMode ? '#4b5563' : '#f1f5f9'
            }, style]}
        >
            <View 
                className="flex-row items-center"
                style={{
                    height: hp(6),
                    paddingHorizontal: wp(4),
                    backgroundColor: isDarkMode ? '#4b5563' : '#f3f4f6',
                    borderRadius: wp(10)
                }}
            >
                <Search size={wp(5)} color={isDarkMode ? '#f3f4f6' : '#6B7280'} />
                <TextInput
                    className="flex-1"
                    style={{
                        marginLeft: wp(3),
                        fontSize: wp(4),
                        color: isDarkMode ? '#f3f4f6' : '#111827'
                    }}
                    placeholder="Search tasks..."
                    placeholderTextColor={isDarkMode ? '#9ca3af' : '#9CA3AF'}
                    value={value}
                    onChangeText={onChangeText}
                    keyboardType="default"
                    accessibilityLabel="Search tasks input"
                />
                {value ? (
                    <TouchableOpacity 
                        onPress={onClear}
                        style={{
                            padding: wp(2)
                        }}
                        accessibilityLabel="Clear search"
                    >
                        <X size={wp(5)} color={isDarkMode ? '#f3f4f6' : '#6B7280'} />
                    </TouchableOpacity>
                ) : null}
            </View>
        </View>
    );
}