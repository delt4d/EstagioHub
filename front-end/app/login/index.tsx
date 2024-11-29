import React, { useState } from 'react';
import { View, SafeAreaView, Text, Image } from 'react-native';
import { Link } from 'expo-router';

import logo from '../../assets/images/LogoEstagioRed.png'
import CustomButton from '../../components/button/CustomButton';
import CustomInput from '../../components/input/CustomInput';

import { styles, login } from '../styles';

export default function Login() {
  
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [emailError, setEmailError] = useState('');
  const [senhaError, setSenhaError] = useState('');

  const handleLogin = () => {
    
    setEmailError('');
    setSenhaError('');

    if (email && senha) {

      alert('Acessando o sistema');
    } 
    else 
    {
      if (!email) 
      {
        setEmailError("Digite um email");
      }
      if (!senha) 
      {
        setSenhaError("Digite uma senha");
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

        <Text style={login.header}>Bem vindo ao nosso sistema!</Text>

        <CustomInput 
          label="Endereço de email"
          placeholder="Digite seu email"
          onChangeText={setEmail}
          errorMessage={emailError}
        />

        <CustomInput 
          label="Senha"
          placeholder="Digite sua senha"
          iconName="eye"
          onChangeText={setSenha}
          secureTextEntry={true}
          errorMessage={senhaError}
        />

        <Text style={login.linkRecuperarSenha}>Esqueceu sua senha? <Link style={styles.link} href={'/recuperarSenha'}>Redefinir Senha</Link></Text>

        <CustomButton 
          title="Acessar o Sistema" 
          type="primary" 
          onPress={handleLogin} 
        />
        
        <Text style={login.linkText}>Ainda não tem uma conta? <Link style={styles.link} href={'/cadastro'}>Criar uma Conta</Link></Text>

      </View>
    </SafeAreaView>
  );
}
