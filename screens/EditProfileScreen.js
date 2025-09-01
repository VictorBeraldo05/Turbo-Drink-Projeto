import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, TextInput, Pressable, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../supabase';
import { COLORS } from '../utils/colors';
import { styles } from '../utils/styles';

export default function EditProfileScreen({ user, onBack }) {
  const [nome, setNome] = useState(user?.user_metadata?.full_name || '');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [endereco, setEndereco] = useState('');
  const [avatar, setAvatar] = useState(user?.user_metadata?.avatar_url || 'https://i.pravatar.cc/100');
  const [uploading, setUploading] = useState(false);

  // Carrega dados do usuário do Supabase
  useEffect(() => {
    async function fetchUserData() {
      if (!user?.id) return;
      const { data } = await supabase.from('usuarios').select('*').eq('id', user.id).single();
      if (data) {
        setTelefone(data.telefone || '');
        setCpf(data.cpf || '');
        setEndereco(data.endereco || '');
      }
    }
    fetchUserData();
  }, [user]);

  // Atualiza um campo no Supabase
  async function atualizarCampo(campo, valor) {
    try {
      if (campo === 'nome') {
        await supabase.auth.updateUser({ data: { full_name: valor, avatar_url: avatar } });
      }
      await supabase.from('usuarios').upsert({ id: user.id, [campo]: valor }, { onConflict: 'id' });
    } catch (err) {
      console.log(err);
      Alert.alert('Erro', 'Não foi possível atualizar ' + campo);
    }
  }

  // Salva todas as alterações
  async function salvarAlteracoes() {
    await atualizarCampo('nome', nome);
    await atualizarCampo('telefone', telefone);
    await atualizarCampo('cpf', cpf);
    await atualizarCampo('endereco', endereco);
    Alert.alert('Sucesso', 'Alterações salvas!');
  }

  // Escolher nova imagem
  async function pickImage() {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permissão necessária', 'Precisamos acessar suas fotos para alterar o avatar.');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!pickerResult.cancelled) {
      uploadAvatar(pickerResult.uri);
    }
  }

  // Upload de avatar para Supabase Storage
  async function uploadAvatar(uri) {
    try {
      setUploading(true);
      const response = await fetch(uri);
      const blob = await response.blob();
      const fileName = `avatars/${user.id}-${Date.now()}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, blob, { upsert: true });

      if (uploadError) throw uploadError;

      const { publicUrl, error: urlError } = supabase.storage.from('avatars').getPublicUrl(fileName);
      if (urlError) throw urlError;

      setAvatar(publicUrl);

      await supabase.auth.updateUser({ data: { avatar_url: publicUrl } });
      Alert.alert('Sucesso', 'Avatar atualizado!');
    } catch (err) {
      console.log(err);
      Alert.alert('Erro', 'Não foi possível atualizar a imagem.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.bg }} contentContainerStyle={{ padding: 20 }}>
      <Pressable onPress={onBack} style={{ marginBottom: 20 }}>
        <Text style={{ color: COLORS.primary }}>Voltar</Text>
      </Pressable>

      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Pressable onPress={pickImage}>
          <Image
            source={{ uri: avatar }}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
          <Text style={{ color: COLORS.primary, marginTop: 5 }}>Alterar foto</Text>
        </Pressable>
      </View>

      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: COLORS.text }}>Editar perfil</Text>

      <Text style={styles.label}>Nome</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} />

      <Text style={styles.label}>Telefone</Text>
      <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />

      <Text style={styles.label}>CPF</Text>
      <TextInput style={styles.input} value={cpf} onChangeText={setCpf} />

      <Text style={styles.label}>Endereço</Text>
      <TextInput style={styles.input} value={endereco} onChangeText={setEndereco} />

      <Pressable onPress={salvarAlteracoes} style={[styles.primaryBtn, { marginTop: 20 }]}>
        <Text style={styles.primaryTxt}>{uploading ? 'Salvando...' : 'Salvar alterações'}</Text>
      </Pressable>
    </ScrollView>
  );
}
