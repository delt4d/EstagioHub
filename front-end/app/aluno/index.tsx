import React from 'react';
import { View, SafeAreaView, Text } from 'react-native';
import CustomNavBar from '../../components/navbar/CustomNavBar';
import CustomSearch from '../../components/search/CustomSearch';
import CustomContainer from '../../components/container/CustomContainer';
import { styles } from '../styles';

export default function Aluno() {
  
  const paths = ['Home'];

  const handleNavigate = (index: number) => {
    const route = paths.slice(0, index + 1).join('/');
    console.log(route);
  };

  return (
    <SafeAreaView style={styles.container}>
      
      <CustomNavBar userType="aluno" />

      <View style={styles.content}>
        <CustomSearch />
        
        <CustomContainer title="Tela de Boas-Vindas">
          <Text>Bem-vindo(a) #-Nome-Aluno-# !</Text>
        </CustomContainer>
      </View>

        

    </SafeAreaView>
  );
}
