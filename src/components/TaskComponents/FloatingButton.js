// components/FloatingButton.js
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Plus } from 'lucide-react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function FloatingButton({ onPress }) {
  return (
    <View style={{
      position: 'absolute',
      bottom: hp(3),
      right: wp(4)
    }}>
      <TouchableOpacity
        onPress={onPress}
        style={{
          backgroundColor: '#6366f1',
          width: wp(14),
          height: wp(14),
          borderRadius: wp(7),
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#6366f1',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 5,
        }}
      >
        <Plus color="white" size={wp(7)} />
      </TouchableOpacity>
    </View>
  );
}