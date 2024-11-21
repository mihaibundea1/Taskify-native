// components/Header.js
import React from 'react';
import { View, Text } from 'react-native';
import { Calendar as CalendarIcon } from 'lucide-react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function Header() {
  return (
    <View style={{
      paddingHorizontal: wp(2.5),
      paddingBottom: hp(1.5),
      paddingTop: hp(2),
      backgroundColor: 'white',
      borderBottomWidth: 1,
      borderBottomColor: '#f1f5f9'
    }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <View>
          <Text style={{
            fontSize: wp(7),
            fontWeight: 'bold',
            color: '#111827'
          }}>Calendar</Text>
          <Text style={{
            color: '#6b7280',
            marginTop: hp(0.5),
            fontSize: wp(4)
          }}>Organize your schedule</Text>
        </View>
        <CalendarIcon size={wp(7)} color="#6366f1" />
      </View>
    </View>
  );
}