import React, { useState } from 'react';
import { View, SafeAreaView, ScrollView, Text } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import { styles, configuracoes } from '../styles';

import CustomNavBar from '../../components/navbar/CustomNavBar';
import CustomSearch from '../../components/search/CustomSearch';
import CustomContainer from '../../components/container/CustomContainer';
import CustomButton from '../../components/button/CustomButton';
import CustomInput from '../../components/input/CustomInput';

export default function ConfiguracoesAluno() {
  const [usuarioFoto, setUsuarioFoto] = useState({ uri: "https://randomuser.me/api/portraits/men/36.jpg" });
  const [usuario, setUsuario] = useState("Aluno Cleberiano");
  const [email, setEmail] = useState("cleberiano@fatec.sp.gov.br");

  const [nome, setNome] = useState("");
  const [area, setArea] = useState("");
  const [turmas, setTurmas] = useState("");
  const [cep, setCEP] = useState("");
  const [coordenador, setCoordenador] = useState("");

  const handleSalvarDados = () => {
    console.log('Dados salvos!');
  };

  return (
    <SafeAreaView style={styles.container}>
      
      <CustomNavBar userType="orientador" />

      <ScrollView contentContainerStyle={styles.content}>
        <CustomSearch />

        <CustomContainer title="Informações do Curso">
          <CustomInput label="Nome do curso" placeholder="Digite o nome do curso" onChangeText={setNome} />
          <CustomInput label="Area de foco" placeholder="Ex. Tecnologia da Informação" onChangeText={setArea} />  
          <CustomInput label="Quantidade de turmas" placeholder="Ex. 3" onChangeText={setTurmas} /> 
          <CustomInput label="Coordenador(a) responsavel" placeholder="Digite o nome do coordenador(a)" onChangeText={setCoordenador} />  
          <hr/>
          <CustomButton title="Enviar" type="primary" onPress={handleSalvarDados} />
          <hr/>
        </CustomContainer>
      </ScrollView>
    </SafeAreaView>
  );
}
