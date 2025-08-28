import React from 'react';
import { View, Text, Pressable,} from 'react-native';
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
        {items.map((it) => (
          <Pressable
            key={it.key}
            style={styles.tabItem}
            onPress={() => onChange(it.key)}>
            <Text
              style={[
                styles.tabTxt,
                current === it.key && { color: COLORS.brand },
              ]}>
              {' '}
              {it.label}{' '}
            </Text>
            {current === it.key && <View style={styles.tabIndicator} />}
          </Pressable>
        ))}
      </View>
    );
  }