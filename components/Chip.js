import React from 'react';
import { Text, Pressable} from 'react-native';
import { COLORS } from '../utils/colors';
import { styles } from '../utils/styles';

export default function Chip({ label, active, onPress }) {
    return (
      <Pressable
        onPress={onPress}
        style={[styles.chip, active && { backgroundColor: COLORS.brand }]}>
        <Text
          style={[
            styles.chipTxt,
            active && { color: '#000', fontWeight: '800' },
          ]}>
          {label}
        </Text>
      </Pressable>
    );
  }