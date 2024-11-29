import React from 'react';
import { View, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import CustomButton from '../components/button/CustomButton';
import { styles } from './styles';

export default function HomeScreen() {

  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        
        <CustomButton 
          title="Login" 
          type="primary" 
          onPress={() => router.push('/login')}
        />

        <CustomButton 
          title="Cadastro" 
          type="secondary" 
          onPress={() => router.push('/cadastro')}
        />

        <CustomButton 
          title="Tela do Aluno" 
          type="primary" 
          onPress={() => router.push('/aluno')}
        />

        <CustomButton 
          title="Tela do Orientador" 
          type="secondary" 
          onPress={() => router.push('/orientador')}
        />
        
      </View>
    </SafeAreaView>
  );
}
