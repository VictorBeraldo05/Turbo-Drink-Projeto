import React from 'react';
import { View, Text, Image, Pressable} from 'react-native';
import { styles } from '../utils/styles';
import { currency } from '../utils/helpers';

export default function ProductCard({ item, onAdd }) {
    return (
      <View style={styles.card}>
        <Image source={{ uri: item.img }} style={styles.cardImg} />
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardPrice}>{currency(item.price)}</Text>
        </View>
        <Pressable onPress={onAdd} style={styles.addBtn}>
          <Text style={{ fontWeight: '800' }}>Adicionar</Text>
        </Pressable>
      </View>
    );
  }