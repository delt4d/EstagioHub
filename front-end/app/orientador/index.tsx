import React from 'react';
import { View, SafeAreaView, Text } from 'react-native';
import CustomNavBar from '../../components/navbar/CustomNavBar';
import CustomSearch from '../../components/search/CustomSearch';
import { styles } from '../styles';

export default function Orientador() 
{

  return (
    <SafeAreaView style={styles.container}>
      
      <CustomNavBar userType="orientador" />

      <View style={styles.content}>
        <CustomSearch />
        <Text style={styles.header}>Bem vindo(a) #-Nome-Orientador-# !</Text>
      </View>
    </SafeAreaView>
  );
}
