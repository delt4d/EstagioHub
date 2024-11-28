import React from 'react';
import { View, SafeAreaView, Text } from 'react-native';
import { styles } from '../styles';
import { useRouter } from 'expo-router';

import CustomNavBar from '../../components/navbar/CustomNavBar';
import CustomSearch from '../../components/search/CustomSearch';
import CustomContainer from '../../components/container/CustomContainer';

export default function AlunosRegistrados() 
{

  return (
    <SafeAreaView style={styles.container}>
      
      <CustomNavBar userType="orientador" />

      <View style={styles.content}>
        
        <CustomSearch />
        
        <CustomContainer title="Alunos Registrados">
          <Text>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Saepe impedit delectus at, facilis repudiandae hic quam? Doloremque corporis qui, omnis eveniet atque natus nobis molestias eaque ea iusto quae quidem.</Text>
        </CustomContainer>

      </View>

    </SafeAreaView>
  );
}
