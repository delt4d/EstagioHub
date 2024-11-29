import React from 'react';
import { View, SafeAreaView, Text } from 'react-native';
import { styles } from '../styles';
import { useRouter } from 'expo-router';

import CustomNavBar from '../../components/navbar/CustomNavBar';
import CustomSearch from '../../components/search/CustomSearch';
import CustomNotification from '../../components/notification/CustomNotification';
import CustomContainer from '../../components/container/CustomContainer';

export default function Estagio() 
{

  return (
    <SafeAreaView style={styles.container}>
      
      <CustomNavBar userType="aluno" />

      <View style={styles.content}>
        
        <CustomSearch />

        <View>
          <CustomNotification 
            textNotification="Você tem 2 documentos pendentes!"
          />
        </View>

        <CustomContainer title="Meus Documentos">
          <Text>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Saepe impedit delectus at, facilis repudiandae hic quam? Doloremque corporis qui, omnis eveniet atque natus nobis molestias eaque ea iusto quae quidem.</Text>
        </CustomContainer>

      </View>

    </SafeAreaView>
  );
}
