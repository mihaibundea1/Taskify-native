// components/AddTaskInput.js
import React from 'react';
import { View, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { Plus } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');
const wp = (percentage) => (width * percentage) / 100;
const hp = (percentage) => (height * percentage) / 100;

export function AddTaskInput({ value, onChangeText, onSubmit, style }) {
  return (
    <View 
      className="p-4" 
      style={style}
    >
      <View 
        className="flex-row items-center bg-gray-50 rounded-xl px-4 py-2"
        style={{
          minHeight: hp(6),
          width: wp(92)
        }}
      >
        <TextInput
          className="flex-1 text-base text-gray-800"
          style={{
            fontSize: wp(4)
          }}
          placeholder="Add a new task"
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmit}
          blurOnSubmit={false}
        />
        <TouchableOpacity 
          onPress={onSubmit}
          className={`p-2 rounded-full ${
            value.trim() ? 'bg-blue-500' : 'bg-gray-300'
          }`}
          style={{
            width: wp(10),
            height: wp(10),
            justifyContent: 'center',
            alignItems: 'center'
          }}
          disabled={!value.trim()}
        >
          <Plus size={wp(5)} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}