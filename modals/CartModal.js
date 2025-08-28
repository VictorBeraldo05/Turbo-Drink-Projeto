import { Modal, Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { COLORS } from '../utils/colors';
import { styles } from '../utils/styles';
import Row from '../components/Row';
import { currency } from '../utils/helpers';

export default function CartModal({
    open,
    onClose,
    items,
    subtotal,
    delivery,
    total,
    onMinus,
    onPlus,
    onCheckout,
  }) {
    return (
      <Modal visible={open} animationType="slide" onRequestClose={onClose}>
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Seu carrinho</Text>
            <Pressable onPress={onClose}>
              <Text style={{ color: COLORS.muted }}>Fechar</Text>
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
            {items.length === 0 && (
              <Text style={{ color: COLORS.muted }}>
                Seu carrinho está vazio.
              </Text>
            )}
            {items.map((it) => (
              <View key={it.id} style={styles.cartItem}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: COLORS.text, fontWeight: '600' }}>
                    {it.name}
                  </Text>
                  <Text style={{ color: COLORS.muted, marginTop: 2 }}>
                    {currency(it.price)} • {it.qty} un
                  </Text>
                </View>
                <View style={styles.qtyRow}>
                  <Pressable onPress={() => onMinus(it.id)} style={styles.qtyBtn}>
                    <Text>-</Text>
                  </Pressable>
                  <Text
                    style={{
                      color: COLORS.text,
                      minWidth: 24,
                      textAlign: 'center',
                    }}>
                    {it.qty}
                  </Text>
                  <Pressable onPress={() => onPlus(it.id)} style={styles.qtyBtn}>
                    <Text>+</Text>
                  </Pressable>
                </View>
              </View>
            ))}
  
            <View style={styles.divider} />
            <Row label="Subtotal" value={currency(subtotal)} />
            <Row label="Entrega" value={currency(delivery)} />
            <Row
              label={<Text style={{ fontWeight: '800' }}>Total</Text>}
              value={<Text style={{ fontWeight: '800' }}>{currency(total)}</Text>}
            />
          </ScrollView>
          <View style={{ padding: 16 }}>
            <Pressable
              disabled={!items.length}
              onPress={onCheckout}
              style={[styles.primaryBtn, !items.length && { opacity: 0.5 }]}>
              <Text style={styles.primaryTxt}>Ir para pagamento</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }