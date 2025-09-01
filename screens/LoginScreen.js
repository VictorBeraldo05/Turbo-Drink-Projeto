import { useState } from 'react';
import { View, Text, TextInput, Pressable, Image } from 'react-native';
import { supabase } from '../supabase';
import { styles } from '../utils/styles';
import { COLORS } from '../utils/colors';
import BrandMark from '../components/BrandMark';
import AlertPopup from '../components/AlertPopup';

export default function LoginScreen({ onSignupNavigate, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  async function handleLogin() {
    if (!email || !senha) {
      setAlertMessage("Preencha todos os campos");
      setAlertVisible(true);
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
    if (error) {
      setAlertMessage(error.message);
      setAlertVisible(true);
      return;
    }

    onLoginSuccess(data.user);
  }

  async function handleGoogleLogin() {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        queryParams: { prompt: 'select_account' }
      });
      // O App.js vai capturar a sessão e redirecionar automaticamente
    } catch {
      setAlertMessage("Erro ao iniciar login com Google");
      setAlertVisible(true);
    }
  }

  return (
    <View style={{ backgroundColor: COLORS.bg, flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 20 }}>
      <BrandMark size={300} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry style={styles.input} />

      <Pressable onPress={handleLogin} style={styles.primaryBtn}>
        <Text style={styles.primaryTxt}>Entrar</Text>
      </Pressable>

      <Pressable onPress={handleGoogleLogin} style={styles.btnGoogleLogin}>
        <Image source={require('../assets/google.png')} style={{ width: 20, height: 20, marginRight: 20 }} />
        <Text style={{ fontSize: 15, color: "#000", fontWeight: "500" }}>Entrar com Google</Text>
      </Pressable>

      <Pressable onPress={onSignupNavigate} style={{ marginTop: 15 }}>
        <Text style={{ fontSize: 15, color: COLORS.muted, textAlign: 'center' }}>
          Não tem conta? Cadastre-se
        </Text>
      </Pressable>

      <AlertPopup visible={alertVisible} message={alertMessage} onClose={() => setAlertVisible(false)} />
    </View>
  );
}
