import { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { supabase } from '../supabase';
import { styles } from '../utils/styles';
import AlertPopup from '../components/AlertPopup';  

export default function AdditionalInfoForm({ user, onComplete }) {
    const [cpf, setCpf] = useState('');
    const [telefone, setTelefone] = useState('');
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
  
    async function handleSubmit() {
      if (!cpf || !telefone) {
        setAlertMessage("Preencha todos os campos");
        setAlertVisible(true);
        return;
      }
  
    const { data: existing, error: checkError } = await supabase
      .from('usuarios')
      .select('id')
      .eq('cpf', cpf)
      .single();
  
      if (existing) {
        setAlertMessage("CPF já cadastrado. Verifique seus dados.");
        setAlertVisible(true);
        return;
      }
    
      const { data, error } = await supabase
        .from('usuarios')
        .insert([
          { 
            id: user.id, 
            nome: user.user_metadata?.full_name || user.email,
            cpf, 
            telefone
          }
        ]);
    
      if (error) {
        console.error('Erro ao salvar dados adicionais:', error); // 👈 log completo
        setAlertMessage("Erro ao salvar dados. Veja o console para detalhes.");
        setAlertVisible(true);
      } else {
        onComplete();
      }
    }
  
    return (
      <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
        <Text style={{color: 'white', fontSize: 25, textAlign: 'center'}}>Preencha as informações</Text>
        <Text style={{color: 'white', fontSize: 25, textAlign: 'center', marginTop: 20, marginBottom: 65}}>Para completar seu cadastro</Text>
        <TextInput placeholder="CPF" value={cpf} onChangeText={setCpf} style={styles.input} />
        <TextInput placeholder="Telefone" value={telefone} onChangeText={setTelefone} style={styles.input} />
        <Pressable onPress={handleSubmit} style={styles.primaryBtn}>
          <Text style={styles.primaryTxt}>Continuar</Text>
        </Pressable>
  
        <AlertPopup visible={alertVisible} message={alertMessage} onClose={() => setAlertVisible(false)} />
      </View>
    );
  }