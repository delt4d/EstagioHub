import React, { useState } from 'react';
import { View, SafeAreaView, Text, Image } from 'react-native';
import { Link } from 'expo-router';

import logo from '../../assets/images/LogoEstagioRed.png'
import CustomButton from '../../components/button/CustomButton';
import CustomInput from '../../components/input/CustomInput';

import { styles, login } from '../styles';

export default function ForgotPassword() 
{
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleLogin = () => {
    
    setEmailError('');

    if (email) {

      alert('Recuperando senha');
    } 
    else 
    {
      if (!email) 
      {
        setEmailError("Digite um email");
      }
      alert('Por favor, preencha todos os campos');
    }
    
  };

  return (
    <SafeAreaView style={login.container}>
      <View style={login.innerContainer}>
        
        <Image 
          source={logo}
          style={login.logoImage}
          resizeMode="contain"
        />

        <Text style={login.header}>Esqueceu sua senha? Não se preocupe!</Text>

        <CustomInput 
          label="Endereço de email"
          placeholder="Digite seu email"
          onChangeText={setEmail}
          errorMessage={emailError}
        />

        <CustomButton 
          title="Recuperar Senha" 
          type="primary" 
          onPress={handleLogin} 
        />
        
        <Text style={login.linkText}>Quer tentar novamente? <Link style={styles.link} href={'/login'}>Acessar Agora</Link></Text>

      </View>
    </SafeAreaView>
  );
}
