import React from 'react';
import { View, Text } from 'react-native';
import { Calendar as CalendarIcon } from 'lucide-react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTheme } from '../../context/ThemeContext'; // Importă contextul de temă

export default function Header() {
  const { isDarkMode } = useTheme(); // Obține tema activă

  return (
    <View style={{
      paddingHorizontal: wp(2.5),
      paddingBottom: hp(1.5),
      paddingTop: hp(2),
      backgroundColor: isDarkMode ? '#1e293b' : 'white', // Modifică fundalul
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#4b5563' : '#f1f5f9' // Modifică culoarea liniei de jos
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
            color: isDarkMode ? '#f3f4f6' : '#111827' // Modifică culoarea textului
          }}>Calendar</Text>
          <Text style={{
            color: isDarkMode ? '#9ca3af' : '#6b7280', // Modifică culoarea subtitlului
            marginTop: hp(0.5),
            fontSize: wp(4)
          }}>Organize your schedule</Text>
        </View>
        <CalendarIcon size={wp(7)} color={isDarkMode ? '#007BFF' : '#007BFF'} />
      </View>
    </View>
  );
}
