// components/TaskComponents/SearchBar.js
import React from 'react';
import { View, TextInput, TouchableOpacity, Animated } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export function SearchBar({ value, onChangeText, onClear, style }) {
    return (
        <View 
            className="bg-white border-b border-gray-100"
            style={[{
                paddingHorizontal: wp(4),
                paddingVertical: hp(1.5)
            }, style]}
        >
            <View className="flex-row items-center bg-gray-50 rounded-xl" 
                style={{
                    height: hp(6),
                    paddingHorizontal: wp(4)
                }}>
                <Search size={wp(5)} color="#6B7280" />
                <TextInput
                    className="flex-1 text-gray-800"
                    style={{
                        marginLeft: wp(3),
                        fontSize: wp(4)
                    }}
                    placeholder="Search tasks..."
                    placeholderTextColor="#9CA3AF"
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
                        <X size={wp(5)} color="#6B7280" />
                    </TouchableOpacity>
                ) : null}
            </View>
        </View>
    );
}