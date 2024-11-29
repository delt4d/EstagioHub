import React from 'react';
import { View, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

import CustomButton from '../../components/button/CustomButton'

import { styles } from '../styles';

export default function Politicas() {

  const router = useRouter();

  const PaginaCadastro = () => {
    router.push('/cadastro');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        
        <h1 style={{ textAlign: 'center'}}>
          Pagina de Politicas e Diretrizes
        </h1>

        <CustomButton 
          title="Voltar" 
          type="primary" 
          onPress={PaginaCadastro} 
        />

      </View>
    </SafeAreaView>
  );
}
