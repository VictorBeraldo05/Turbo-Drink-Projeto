import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../utils/styles';
import { COLORS } from '../utils/colors';


export default function Row({ label, value }) {
    return (
      <View style={styles.row}>
        {typeof label === 'string' ? (
          <Text style={{ color: COLORS.muted }}>{label}</Text>
        ) : (
          label
        )}
        {typeof value === 'string' ? (
          <Text style={{ color: COLORS.text }}>{value}</Text>
        ) : (
          value
        )}
      </View>
    );
  }