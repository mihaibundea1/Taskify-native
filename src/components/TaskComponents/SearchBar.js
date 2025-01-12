import React from 'react';
import { View, TextInput, TouchableOpacity, Animated } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTheme } from '../../context/ThemeContext'; // Importă contextul de temă

export function SearchBar({ value, onChangeText, onClear, style }) {
    const { isDarkMode } = useTheme(); // Obține tema activă

    return (
        <View 
            className="border-b"
            style={[{
                paddingHorizontal: wp(4),
                paddingVertical: hp(1.5),
                backgroundColor: isDarkMode ? '#1e293b' : 'white', // Fundalul componentelor
                borderBottomColor: isDarkMode ? '#4b5563' : '#f1f5f9' // Culoarea liniei de jos
            }, style]}
        >
            <View 
                className="flex-row items-center"
                style={{
                    height: hp(6),
                    paddingHorizontal: wp(4),
                    backgroundColor: isDarkMode ? '#4b5563' : '#f3f4f6', // Fundalul câmpului de căutare
                    borderRadius: wp(10)
                }}
            >
                <Search size={wp(5)} color={isDarkMode ? '#f3f4f6' : '#6B7280'} /> {/* Culoarea iconiței Search */}
                <TextInput
                    className="flex-1"
                    style={{
                        marginLeft: wp(3),
                        fontSize: wp(4),
                        color: isDarkMode ? '#f3f4f6' : '#111827' // Culoarea textului
                    }}
                    placeholder="Search tasks..."
                    placeholderTextColor={isDarkMode ? '#9ca3af' : '#9CA3AF'} // Culoarea textului de placeholder
                    value={value}
                    onChangeText={onChangeText}
                />
                {value ? (
                    <TouchableOpacity 
                        onPress={onClear}
                        style={{
                            padding: wp(2)
                        }}
                    >
                        <X size={wp(5)} color={isDarkMode ? '#f3f4f6' : '#6B7280'} /> {/* Culoarea iconiței X */}
                    </TouchableOpacity>
                ) : null}
            </View>
        </View>
    );
}
