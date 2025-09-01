import React, { useState, useEffect } from 'react';
import { ScrollView, Text, TextInput, View, Pressable, Alert } from 'react-native';
import { COLORS } from '../utils/colors';
import { styles } from '../utils/styles';
import { supabase } from '../supabase';

export default function ProfileScreen({ user, onLogout }) {
  const [nome, setNome] = useState(user?.user_metadata?.full_name || '');
  const [email, setEmail] = useState(
    typeof user?.email === 'string' ? user.email : user?.email?.address || ''
  );
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [address, setAddress] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  // Buscar dados da tabela 'usuarios' pelo user.id
  useEffect(() => {
    async function fetchUserData() {
      console.log('🔍 Iniciando busca de dados do usuário...');
      console.log('User ID:', user?.id);

      if (!user?.id) {
        console.log('⚠️ User ID não definido. Abortando fetch.');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.log('❌ Erro ao buscar dados do usuário:', error.message);
          if (error.code === 'PGRST116') {
            // Registro não encontrado, criar um vazio
            console.log('🆕 Registro não encontrado. Criando novo registro...');
            const { error: insertError } = await supabase.from('usuarios').insert([{ id: user.id }]);
            if (insertError) {
              console.log('❌ Erro ao criar registro vazio:', insertError.message);
            } else {
              console.log('✅ Registro vazio criado com sucesso.');
            }
          }
          return;
        }

        if (data) {
          console.log('✅ Dados recebidos do banco:', data);
          setTelefone(data.telefone || '');
          setCpf(data.cpf || '');
          setAddress(data.endereco || '');
        } else {
          console.log('⚠️ Nenhum dado encontrado para este usuário.');
        }
      } catch (err) {
        console.error('💥 Erro inesperado ao buscar dados do usuário:', err);
      }
    }

    fetchUserData();
  }, [user]);

  async function atualizarDados() {
    console.log('💾 Atualizando dados...');
    console.log({ nome, telefone, cpf, endereco: address });

    try {
      // Atualiza nome no Auth
      const { error: authError } = await supabase.auth.updateUser({ data: { full_name: nome } });
      if (authError) throw authError;

      // Atualiza tabela usuarios pelo user.id
      const { error: dbError } = await supabase
        .from('usuarios')
        .upsert({ id: user.id, nome, telefone, cpf, endereco: address }, { onConflict: 'id' });

      if (dbError) throw dbError;

      console.log('✅ Dados atualizados com sucesso no banco e Auth.');
      Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
    } catch (err) {
      console.error('❌ Erro ao atualizar dados:', err);
      Alert.alert('Erro', 'Não foi possível atualizar seus dados.');
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
    if (error) {
      Alert.alert('Erro', error.message);
    } else {
      Alert.alert('Sucesso', 'Senha alterada com sucesso!');
      setNovaSenha('');
      setConfirmarSenha('');
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.bg }} contentContainerStyle={{ paddingBottom: 100 }}>
      <Text style={styles.sectionTitle}>Meu Perfil</Text>

      <View style={styles.formCard}>
        <Text style={styles.label}>Nome</Text>
        <TextInput value={nome} onChangeText={setNome} style={styles.input} />

        <Text style={styles.label}>E-mail</Text>
        <TextInput value={email} editable={false} style={[styles.input, { opacity: 0.9 }]} />

        <Text style={styles.label}>Telefone</Text>
        <TextInput value={telefone} onChangeText={setTelefone} style={styles.input} keyboardType="phone-pad" />

        <Text style={styles.label}>CPF</Text>
        <TextInput value={cpf} onChangeText={setCpf} style={styles.input} />

        <Text style={styles.label}>Endereço padrão</Text>
        <TextInput value={address} onChangeText={setAddress} style={styles.input} />

        <Pressable onPress={atualizarDados} style={styles.primaryBtn}>
          <Text style={styles.primaryTxt}>Salvar alterações</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Segurança</Text>
      <View style={styles.formCard}>
        <Text style={styles.label}>Nova senha</Text>
        <TextInput value={novaSenha} onChangeText={setNovaSenha} style={styles.input} secureTextEntry />

        <Text style={styles.label}>Confirmar nova senha</Text>
        <TextInput value={confirmarSenha} onChangeText={setConfirmarSenha} style={styles.input} secureTextEntry />

        <Pressable onPress={trocarSenha} style={styles.primaryBtn}>
          <Text style={styles.primaryTxt}>Alterar senha</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Configurações</Text>
      <View style={styles.formCard}>
        <Pressable style={styles.secondaryBtn}>
          <Text style={styles.secondaryTxt}>Notificações</Text>
        </Pressable>
        <Pressable style={styles.secondaryBtn}>
          <Text style={styles.secondaryTxt}>Tema escuro</Text>
        </Pressable>
        <Pressable style={styles.secondaryBtn} onPress={onLogout}>
          <Text style={[styles.secondaryTxt, { color: 'red' }]}>Sair da conta</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
