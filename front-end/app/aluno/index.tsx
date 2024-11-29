import React from 'react';
import { View, SafeAreaView, Text } from 'react-native';
import CustomNavBar from '../../components/navbar/CustomNavBar';
import CustomSearch from '../../components/search/CustomSearch';
import CustomContainer from '../../components/container/CustomContainer';
import { styles } from '../styles';

export default function Aluno() {

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
