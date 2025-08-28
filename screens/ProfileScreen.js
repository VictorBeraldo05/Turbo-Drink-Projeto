import { ScrollView, Text, TextInput, View, Pressable } from 'react-native';
import { COLORS } from '../utils/colors';
import { styles } from '../utils/styles';

export default function ProfileScreen({ user, address, setAddress, payment, setPayment }) {
    return (
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={styles.sectionTitle}>Seu perfil</Text>
        <View style={styles.formCard}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            value={user.name}
            editable={false}
            style={[styles.input, { opacity: 0.7 }]}
          />
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            value={user.email}
            editable={false}
            style={[styles.input, { opacity: 0.7 }]}
          />
  
          <Text style={styles.label}>Endereço padrão</Text>
          <TextInput
            value={address}
            onChangeText={setAddress}
            placeholder="Endereço"
            placeholderTextColor={COLORS.muted}
            style={styles.input}
          />
  
          <Text style={styles.label}>Pagamento preferido</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
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
        </View>
      </ScrollView>
    );
  }