import { Modal, Pressable, SafeAreaView, ScrollView, Text, View, Image, Alert } from 'react-native';
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
  onRemove,   // 🔥 novo handler para remover item
  onClearCart // 🔥 novo handler para limpar tudo
}) {
  return (
    <Modal visible={open} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
        
        {/* Header */}
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Seu carrinho</Text>
          
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            {items.length > 0 && (
              <Pressable
                onPress={() =>
                  Alert.alert("Limpar carrinho", "Tem certeza que deseja remover todos os itens?", [
                    { text: "Cancelar", style: "cancel" },
                    { text: "Sim", onPress: onClearCart }
                  ])
                }
              >
                <Text style={{ color: COLORS.danger }}>Limpar</Text>
              </Pressable>
            )}
            <Pressable onPress={onClose}>
              <Text style={{ color: COLORS.muted }}>Fechar</Text>
            </Pressable>
          </View>
        </View>

        {/* Itens */}
        <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 120 }}>
          {items.length === 0 && (
            <Text style={{ color: COLORS.muted }}>Seu carrinho está vazio.</Text>
          )}
          
          {items.map((it) => (
            <View key={it.id} style={styles.cartItem}>
              
              {/* Imagem do produto */}
              {it.image && (
                <Image
                  source={{ uri: it.image }}
                  style={{ width: 50, height: 50, borderRadius: 8, marginRight: 12 }}
                />
              )}
              
              <View style={{ flex: 1 }}>
                <Text style={{ color: COLORS.text, fontWeight: '600' }}>{it.name}</Text>
                <Text style={{ color: COLORS.muted, marginTop: 2 }}>
                  {currency(it.price)} • {it.qty} un
                </Text>
              </View>

              {/* Botões de quantidade */}
              <View style={styles.qtyRow}>
                <Pressable
                  onPress={() => onMinus(it.id)}
                  style={({ pressed }) => [styles.qtyBtn, pressed && { backgroundColor: COLORS.line }]}
                >
                  <Text>-</Text>
                </Pressable>
                <Text style={{ color: COLORS.text, minWidth: 24, textAlign: 'center' }}>
                  {it.qty}
                </Text>
                <Pressable
                  onPress={() => onPlus(it.id)}
                  style={({ pressed }) => [styles.qtyBtn, pressed && { backgroundColor: COLORS.line }]}
                >
                  <Text>+</Text>
                </Pressable>
              </View>

              {/* Remover item */}
              <Pressable onPress={() => onRemove(it.id)} style={{ marginLeft: 8 }}>
                <Text style={{ color: COLORS.danger }}>✕</Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>

        {/* Resumo fixo no rodapé */}
        <View style={{
          borderTopWidth: 1,
          borderTopColor: COLORS.line,
          padding: 16,
          backgroundColor: COLORS.card
        }}>
          <Row label="Subtotal" value={currency(subtotal)} />
          <Row label="Entrega" value={currency(delivery)} />
          <Row
            label={<Text style={{ fontWeight: '800' }}>Total</Text>}
            value={<Text style={{ fontWeight: '800' }}>{currency(total)}</Text>}
          />

          <Pressable
            disabled={!items.length}
            onPress={onCheckout}
            style={[styles.primaryBtn, !items.length && { opacity: 0.5 }]}
          >
            <Text style={styles.primaryTxt}>Ir para pagamento</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
