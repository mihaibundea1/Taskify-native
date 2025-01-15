import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Check, ChevronRight, Bell } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { sendEmail } from '../../services/emailService';

export function TaskItem({ task, onToggle, onPress }) {
  const { isDarkMode } = useTheme();
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const notificationTimes = [
    { label: '15 minutes', minutes: 15 },
    { label: '30 minutes', minutes: 30 },
    { label: '1 hour', minutes: 60 },
    { label: '2 hours', minutes: 120 },
    { label: '4 hours', minutes: 240 },
    { label: '8 hours', minutes: 480 },
    { label: '12 hours', minutes: 720 },
    { label: '24 hours', minutes: 1440 }
  ];

  const scheduleNotification = async (minutes) => {
    const notificationTime = new Date(task.time);
    notificationTime.setMinutes(notificationTime.getMinutes() - minutes);

    // Calculate the time difference for the email subject
    const timeLabel = minutes >= 60 
      ? `${minutes / 60} hour${minutes / 60 > 1 ? 's' : ''}`
      : `${minutes} minutes`;

    try {
      await sendEmail(
        task.userEmail, // Assuming task has userEmail property
        `Reminder: "${task.title}" starts in ${timeLabel}`,
        `Your task "${task.title}" is scheduled to start in ${timeLabel}.
        
Description: ${task.description || 'No description provided'}
Time: ${task.time}

Don't forget to complete this task on time!`
      );
      
      setShowNotificationModal(false);
    } catch (error) {
      console.error('Failed to schedule notification:', error);
    }
  };

  return (
    <>
      <TouchableOpacity 
        onPress={onPress}
        className={`flex-row items-center my-2 p-4 rounded-xl border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
        }`}
        style={{
          shadowColor: isDarkMode ? '#007BFF' : '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2
        }}
      >
        <TouchableOpacity 
          onPress={(e) => {
            e.stopPropagation();
            onToggle(task.id);
          }}
          className={`w-6 h-6 rounded-full border-2 mr-4 items-center justify-center
            ${task.completed ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300'}`}
        >
          {task.completed && <Check size={16} color="white" />}
        </TouchableOpacity>
        
        <View className="flex-1">
          <Text className={`text-base font-medium ${
            task.completed ? 'line-through' : ''
          } ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
            {task.title}
          </Text>
          {task.description && (
            <Text className={`text-sm mt-1 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`} numberOfLines={1}>
              {task.description}
            </Text>
          )}
          {task.time && (
            <Text className={`text-sm mt-1 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {task.time}
            </Text>
          )}
        </View>

        <TouchableOpacity 
          onPress={() => setShowNotificationModal(true)}
          className="mx-2"
        >
          <Bell 
            size={20} 
            color={isDarkMode ? '#9CA3AF' : '#6B7280'}
          />
        </TouchableOpacity>
        
        <ChevronRight size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
      </TouchableOpacity>

      <Modal
        visible={showNotificationModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowNotificationModal(false)}
      >
        <TouchableOpacity
          className="flex-1 justify-center items-center bg-black/50"
          onPress={() => setShowNotificationModal(false)}
        >
          <View 
            className={`w-80 rounded-xl p-4 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <Text className={`text-lg font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Set Reminder
            </Text>
            
            {notificationTimes.map((time) => (
              <TouchableOpacity
                key={time.minutes}
                onPress={() => scheduleNotification(time.minutes)}
                className={`p-3 border-b ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-100'
                }`}
              >
                <Text className={
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }>
                  {time.label} before
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={() => setShowNotificationModal(false)}
              className="mt-4 p-3 bg-indigo-500 rounded-lg"
            >
              <Text className="text-white text-center font-medium">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}