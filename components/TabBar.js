import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { COLORS } from '../utils/colors';
import { styles } from '../utils/styles';
import { SCREENS } from '../utils/constants';

export default function TabBar({ current, onChange }) {
  const items = [
    { key: SCREENS.HOME, label: 'Início' },
    { key: SCREENS.ORDERS, label: 'Pedidos' },
    { key: SCREENS.PROFILE, label: 'Perfil' },
  ];

  return (
    <View style={styles.tabbar}>
      {items.map((item) => {
        const isActive = current === item.key;
        return (
          <Pressable
            key={item.key}
            style={({ pressed }) => [
              styles.tabItem,
              pressed && { opacity: 0.6 }, // feedback ao pressionar
            ]}
            onPress={() => onChange(item.key)}
          >
            <Text
              style={[
                styles.tabTxt,
                isActive && { color: COLORS.brand, fontWeight: 'bold' },
              ]}
            >
              {item.label}
            </Text>
            {isActive && <View style={styles.tabIndicator} />}
          </Pressable>
        );
      })}
    </View>
  );
}
