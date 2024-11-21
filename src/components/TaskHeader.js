// components/TaskHeader.js
import React from 'react';
import { View, Text } from 'react-native';
import { wp, hp } from '../utils/responsive';

export function TaskHeader({ date, totalTasks, completedTasks, style }) {
  return (
    <View 
      className="bg-white border-b border-gray-200"
      style={[{
        paddingVertical: hp(2),
        paddingHorizontal: wp(4)
      }, style]}
    >
      <Text 
        className="font-bold text-gray-800"
        style={{
          fontSize: wp(6),
          lineHeight: wp(7)
        }}
      >
        Tasks for {new Date(date).toLocaleDateString('en-US', { 
          month: 'long', 
          day: 'numeric' 
        })}
      </Text>
      <Text 
        className="text-gray-500 mt-1"
        style={{
          fontSize: wp(3.5)
        }}
      >
        {totalTasks} tasks, {completedTasks} completed
      </Text>
    </View>
  );
}