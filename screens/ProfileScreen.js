import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, Pressable, Modal, TextInput, Image, Alert } from 'react-native';
import { COLORS } from '../utils/colors';
import { styles } from '../utils/styles';
import { supabase } from '../supabase';
import { FontAwesome5, MaterialIcons, Entypo } from '@expo/vector-icons';

export default function ProfileScreen({ user, onLogout, onEditProfile }) {
  const [nome, setNome] = useState(user?.user_metadata?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [address, setAddress] = useState('');

  const [modalVisible, setModalVisible] = useState(null); // 'nome', 'telefone', 'cpf', 'endereco', 'senha'
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  useEffect(() => {
    async function fetchUserData() {
      if (!user?.id) return;
      const { data } = await supabase.from('usuarios').select('*').eq('id', user.id).single();
      if (data) {
        setTelefone(data.telefone || '');
        setCpf(data.cpf || '');
        setAddress(data.endereco || '');
      }
    }
    fetchUserData();
  }, [user]);

  async function atualizarCampo(campo, valor) {
    try {
      if (campo === 'nome') await supabase.auth.updateUser({ data: { full_name: valor } });
      await supabase.from('usuarios').upsert({ id: user.id, [campo]: valor }, { onConflict: 'id' });
      Alert.alert('Sucesso', 'Atualizado com sucesso!');
      setModalVisible(null);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível atualizar');
    }
  }

  async function trocarSenha() {
    if (!novaSenha || novaSenha.length < 8) {
      Alert.alert('Erro', 'A senha deve ter no mínimo 8 caracteres.');
      return;
    }
    if (novaSenha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: novaSenha });
    if (error) Alert.alert('Erro', error.message);
    else {
      Alert.alert('Sucesso', 'Senha alterada!');
      setNovaSenha('');
      setConfirmarSenha('');
      setModalVisible(null);
    }
  }

  const opcoes = [
    { label: 'Métodos de pagamento', icon: <FontAwesome5 name="credit-card" size={20} color={COLORS.text} />, action: () => Alert.alert('Métodos de pagamento') },
    { label: 'Histórico de pedidos', icon: <MaterialIcons name="history" size={20} color={COLORS.text} />, action: () => Alert.alert('Histórico de pedidos') },
    { label: 'Configurações', icon: <Entypo name="cog" size={20} color={COLORS.text} />, action: () => Alert.alert('Configurações') },
    { label: 'Ajuda & Suporte', icon: <Entypo name="help" size={20} color={COLORS.text} />, action: () => Alert.alert('Ajuda & Suporte') },
    { label: 'Termos & Privacidade', icon: <MaterialIcons name="privacy-tip" size={20} color={COLORS.text} />, action: () => Alert.alert('Termos & Privacidade') },
    { label: 'Sair da conta', icon: <Entypo name="log-out" size={20} color="red" />, action: onLogout },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.bg }} contentContainerStyle={{ padding: 20 }}>
      
      {/* Card do usuário */}
      <Pressable
        style={[styles.formCard, { flexDirection: 'row', alignItems: 'center', padding: 20, marginBottom: 20 }]}
        onPress={onEditProfile} // chama a função de navegação
      >
        <Image
          source={{ uri: user?.user_metadata?.avatar_url || 'https://i.pravatar.cc/100' }}
          style={{ width: 70, height: 70, borderRadius: 35, marginRight: 15 }}
        />
        <View>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.text }}>Meu Perfil</Text>
          <Text style={{ color: COLORS.muted }}>Acesse suas informações do perfil</Text>
        </View>
      </Pressable>

      {/* Lista de opções */}
      {opcoes.map((opt, idx) => (
        <Pressable
          key={idx}
          onPress={opt.action}
          style={[styles.formCard, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 15, paddingHorizontal: 20, marginBottom: 10 }]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {opt.icon}
            <Text style={{ fontSize: 16, color: COLORS.text, marginLeft: 15 }}>{opt.label}</Text>
          </View>
          <Entypo name="chevron-right" size={20} color={COLORS.muted} />
        </Pressable>
      ))}
    </ScrollView>
  );
}
