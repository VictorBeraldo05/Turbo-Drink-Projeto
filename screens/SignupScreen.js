import { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { supabase } from '../supabase';
import { styles } from '../utils/styles';
import { COLORS } from '../utils/colors';
import AlertPopup from '../components/AlertPopup';

export default function SignupScreen({ onBack }) {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [telefone, setTelefone] = useState('');
    const [senha, setSenha] = useState('');
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [senhaError, setSenhaError] = useState('');
  
    async function handleSignup() {
        console.log("Botão clicado — testando conexão com Supabase...");
      
        // 1️⃣ Validação dos campos
        if (!nome || !email || !cpf || !telefone || !senha) {
          setAlertMessage("Por favor, preencha todos os campos para criar sua conta.");
          setAlertVisible(true);
          return;
        }
      
        if (senha.length < 8) {
          setAlertMessage("A senha deve ter no mínimo 8 caracteres");
          setAlertVisible(true);
          return;
        }
      
        // Verifica CPF
        const { data: cpfData, error: cpfError } = await supabase
        .from('usuarios')
        .select('id')
        .eq('cpf', cpf)
        .limit(1); // garante que só retorna 1

        if (cpfError) {
        console.error(cpfError);
        setAlertMessage("Erro ao verificar CPF. Tente novamente.");
        setAlertVisible(true);
        return;
        }

        if (cpfData && cpfData.length > 0) {
        setAlertMessage("CPF já cadastrado. Verifique seus dados.");
        setAlertVisible(true);
        return;
        }

        // Verifica telefone
        const { data: telData, error: telError } = await supabase
        .from('usuarios')
        .select('id')
        .eq('telefone', telefone)
        .limit(1);

        if (telError) {
        console.error(telError);
        setAlertMessage("Erro ao verificar telefone. Tente novamente.");
        setAlertVisible(true);
        return;
        }

        if (telData && telData.length > 0) {
        setAlertMessage("Telefone já cadastrado. Verifique seus dados.");
        setAlertVisible(true);
        return;
        }
      
        // 4️⃣ Criar usuário no Auth
        const { data, error } = await supabase.auth.signUp({
          email,
          password: senha,
        });

        // Atualizar user_metadata
        await supabase.auth.updateUser({ data: { full_name: nome } });
      
        if (error) {
          setAlertMessage(
            error.message.includes("User already registered")
              ? "Este e-mail já está cadastrado. Tente fazer login."
              : "Erro ao criar conta. Tente novamente mais tarde."
          );
          setAlertVisible(true);
          return;
        }
      
        const user = data.user;
      
        // 5️⃣ Inserir usuário na tabela "usuarios"
        const { error: insertError } = await supabase.from("usuarios").insert([
          { id: user.id, nome, cpf, telefone },
        ]);
      
        if (insertError) {
          console.error("Erro ao salvar usuário na tabela:", insertError);
          setAlertMessage("Erro ao salvar usuário. Tente novamente.");
          setAlertVisible(true);
          return;
        }
      
        // ✅ Sucesso
        setAlertMessage("Conta criada com sucesso! Faça login para continuar.");
        setAlertVisible(true);
        setTimeout(() => onBack(), 1500);
      }
      
  
    return (
      <View style={{ flex:1, backgroundColor: COLORS.bg, padding: 20, justifyContent: 'center' }}>
        <Text style={{ fontSize: 26, color: COLORS.text, marginBottom: 20, textAlign: 'center' }}>Criar conta</Text>
  
        <TextInput placeholder="Nome completo" value={nome} onChangeText={setNome} style={styles.input} />
        <TextInput placeholder="E-mail" value={email} onChangeText={setEmail} style={styles.input} />
        <TextInput placeholder="CPF" value={cpf} onChangeText={setCpf} style={styles.input} />
        <TextInput placeholder="Telefone" value={telefone} onChangeText={setTelefone} style={styles.input} />
        <TextInput placeholder="Senha" secureTextEntry value={senha} onChangeText={(txt) => {setSenha(txt);
          if (txt.length < 8) {
            setSenhaError("A senha deve ter no mínimo 8 caracteres");
          } else {
            setSenhaError("");
          }
        }}style={styles.input}/>
  
        {/* Mensagem de erro em vermelho */}
        {senhaError ? (
          <Text style={{ color: "red", marginTop: -10, marginBottom: 10, fontSize: 14 }}>
            {senhaError}
          </Text>
        ) : null}
  
        <Pressable onPress={handleSignup} style={styles.primaryBtn}>
        <Text style={styles.primaryTxt}>Cadastrar</Text>
        </Pressable>
  
        <Pressable onPress={onBack} style={{ marginTop: 15 }}>
          <Text style={{ fontSize: 15, color: COLORS.muted, textAlign: 'center' }}>Já tem conta? Voltar para login</Text>
        </Pressable>
  
        <AlertPopup visible={alertVisible} message={alertMessage} onClose={() => setAlertVisible(false)} />
      </View>
    );
  }