import React, { useState } from 'react';
import { View, SafeAreaView, Text, Image } from 'react-native';
import { Link } from 'expo-router';

import { useRouter } from 'expo-router';

import logo from '../../assets/images/LogoEstagioRed.png'
import CustomButton from '../../components/button/CustomButton';
import CustomInput from '../../components/input/CustomInput';
import CustomCheckBox from '../../components/checkbox/CustomCheckBox';

import { styles, cadastro } from '../styles';

import axios from 'axios';

export default function Cadastro() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [emailError, setEmailError] = useState('');
  const [senhaError, setSenhaError] = useState('');
  const [nomeError, setNomeError] = useState('');

  const router = useRouter();

  const handleCadastro = async () => {
    
    setEmailError('');
    setSenhaError('');
    setNomeError('');

    if (email && senha) {

      try {
        await axios.post('http://localhost:8000/api/v1/student/register', {
          nome: nome, 
          email: email,
          senha: senha,
        });
        router.push('/login');
      } catch (error) {
        console.error(error);
      }
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
      if (!nome) 
      {
        setSenhaError("Digite um nome");
      }
      alert('Por favor, preencha todos os campos');

    }
    
  };

  return (
    <SafeAreaView style={cadastro.container}>
      <View style={cadastro.innerContainer}>
        
        <Image 
          source={logo}
          style={cadastro.logoImage}
          resizeMode="contain"
        />

        <Text style={cadastro.header}>Bem vindo ao nosso sistema!</Text>

        <CustomInput 
          label="Nome Completo"
          placeholder="Digite seu nome"
          onChangeText={setNome}
          errorMessage={nomeError}
        />

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

        <CustomInput 
          label="Confirmação de Senha"
          placeholder="Digite sua senha"
          iconName="eye"
          onChangeText={setSenha}
          secureTextEntry={true}
          errorMessage={senhaError}
        />

        <View style={cadastro.viewCheckBox}>
          <CustomCheckBox />
          <Text style={cadastro.linkRecuperarSenha}>Estou de acordo com as </Text>
          <Link style={styles.link} href={'/politicas'}>politicas e diretrizes</Link>
        </View>

        <CustomButton 
          title="Cadastrar-se" 
          type="primary" 
          onPress={handleCadastro} 
        />
        
        <Text style={cadastro.linkText}> Já tem uma conta? <Link style={styles.link} href={'/login'}>Acessar Agora</Link></Text>

      </View>
    </SafeAreaView>
  );
}
