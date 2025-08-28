import { ScrollView, Pressable, Text, StyleSheet } from 'react-native';
import { COLORS} from '../utils/colors'; 
import { currency } from '../utils/helpers';
import { styles } from '../utils/styles';

export default function OrdersScreen({ orders, onOpen }) {
    return (
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={styles.sectionTitle}>Seus pedidos</Text>
        {orders.length === 0 && (
          <Text style={{ color: COLORS.muted, paddingHorizontal: 16 }}>
            Você ainda não fez pedidos.
          </Text>
        )}
        {orders.map((o) => (
          <Pressable
            key={o.id}
            onPress={() => onOpen(o)}
            style={styles.orderCard}>
            <Text style={{ color: COLORS.text, fontWeight: '700' }}>
              #{o.id} • {o.status}
            </Text>
            <Text style={{ color: COLORS.muted, marginTop: 4 }}>
              {new Date(o.createdAt).toLocaleString()}
            </Text>
            <Text style={{ color: COLORS.text, marginTop: 6 }}>
              {o.items.length} itens • {currency(o.total)}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    );
  }