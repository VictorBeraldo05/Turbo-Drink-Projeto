import React from 'react';
import { View, Text, Pressable} from 'react-native';
import BrandMark from './BrandMark';
import { styles } from '../utils/styles';


export default function Header({ onOpenCart, cartCount }) {
    return (
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <BrandMark size={38} />
          <View>
            <Text style={styles.brand}>Turbo Drink</Text>
            <Text style={styles.subtitle}>Adega & Entregas Rápidas</Text>
          </View>
        </View>
        <Pressable onPress={onOpenCart} style={styles.cartBtn}>
          <Text style={{ color: '#000', fontWeight: '700' }}>Carrinho</Text>
          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={{ fontSize: 12, fontWeight: '700' }}>{cartCount}</Text>
            </View>
          )}
        </Pressable>
      </View>
    );
  }