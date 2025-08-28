import { Modal, Pressable, Text, TextInput, View } from 'react-native';
import { COLORS } from '../utils/colors';
import { styles } from '../utils/styles';
import Row from '../components/Row';
import { currency } from '../utils/helpers';

export default function CheckoutModal({
    open,
    onClose,
    address,
    setAddress,
    payment,
    setPayment,
    total,
    onConfirm,
  }) {
    return (
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={onClose}>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <Text style={styles.modalTitle}>Pagamento</Text>
            <Text style={{ color: COLORS.muted, marginBottom: 12 }}>
              Confirme os dados e finalize
            </Text>
  
            <Text style={styles.label}>Endereço</Text>
            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder="Seu endereço"
              placeholderTextColor={COLORS.muted}
              style={styles.input}
            />
  
            <Text style={styles.label}>Forma de pagamento</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
              {['Pix', 'Cartão', 'Dinheiro'].map((p) => (
                <Pressable
                  key={p}
                  onPress={() => setPayment(p)}
                  style={[
                    styles.payBtn,
                    payment === p && { backgroundColor: COLORS.brand },
                  ]}>
                  <Text
                    style={[
                      styles.payTxt,
                      payment === p && { color: '#000', fontWeight: '800' },
                    ]}>
                    {p}
                  </Text>
                </Pressable>
              ))}
            </View>
  
            <Row
              label={<Text style={{ fontWeight: '800' }}>Total</Text>}
              value={<Text style={{ fontWeight: '800' }}>{currency(total)}</Text>}
            />
  
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
              <Pressable onPress={onClose} style={styles.secondaryBtn}>
                <Text style={styles.secondaryTxt}>Cancelar</Text>
              </Pressable>
              <Pressable
                onPress={onConfirm}
                style={[styles.primaryBtn, { flex: 1 }]}>
                <Text style={styles.primaryTxt}>Finalizar pedido</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    );
  }