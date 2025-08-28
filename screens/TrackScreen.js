import { View, Text, Pressable} from 'react-native';
import { COLORS } from '../utils/colors';
import { styles } from '../utils/styles';

export default function TrackScreen({ order, onBackHome }) {
    const steps = ['recebido', 'preparando', 'a caminho', 'entregue'];
    const current = steps.indexOf(order.status);
    return (
      <View style={{ flex: 1 }}>
        <Text style={styles.sectionTitle}>Acompanhar pedido</Text>
        <View style={{ paddingHorizontal: 16 }}>
          <Text style={{ color: COLORS.muted }}>Pedido #{order.id}</Text>
          <View style={{ marginTop: 12, gap: 10 }}>
            {steps.map((s, i) => (
              <View
                key={s}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View
                  style={[
                    styles.dot,
                    i <= current
                      ? { backgroundColor: COLORS.brand }
                      : { backgroundColor: 'rgba(255,255,255,0.2)' },
                  ]}
                />
                <Text
                  style={{ color: i <= current ? COLORS.text : COLORS.muted }}>
                  {s.toUpperCase()}
                </Text>
              </View>
            ))}
          </View>
          <Pressable
            onPress={onBackHome}
            style={[
              styles.primaryBtn,
              { marginTop: 24, alignSelf: 'flex-start' },
            ]}>
            <Text style={styles.primaryTxt}>Voltar ao início</Text>
          </Pressable>
        </View>
      </View>
    );
  }