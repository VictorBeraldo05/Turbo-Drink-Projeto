import React from "react";
import { Modal, View, Text, Pressable } from "react-native";
import { COLORS } from '../utils/colors';

export default function AlertPopup({ visible, message, onClose, type = 'info' }) {
    // Ajuste de cores baseado no tipo de alerta
    const backgroundColors = {
      info: COLORS.bgLight || '#333',      // alerta informativo
      success: COLORS.success || '#4CAF50', // sucesso
      error: COLORS.error || '#F44336'     // erro
    };
  
    const textColors = {
      info: COLORS.text || '#FFF',
      success: '#FFF',
      error: '#FFF'
    };
  
    return (
      <Modal
        transparent
        animationType="fade"
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={{
          flex:1,
          backgroundColor:'rgba(0,0,0,0.5)',
          justifyContent:'center',
          alignItems:'center'
        }}>
          <View style={{
            width: 300,
            backgroundColor: backgroundColors[type],
            borderRadius: 15,
            padding: 25,
            alignItems: 'center',
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5
          }}>
            <Text style={{ fontSize:16, marginBottom:20, textAlign:'center', color: textColors[type] }}>
              {message}
            </Text>
            <Pressable 
              onPress={onClose} 
              style={{ paddingVertical:10, paddingHorizontal:20, borderRadius:10, backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              <Text style={{ color: textColors[type], fontWeight:'bold' }}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  }