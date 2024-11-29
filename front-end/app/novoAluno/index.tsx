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

  const [cnpj, setNome] = useState("");
  const [ra, setRA] = useState("");
  const [cursoAluno, setCursoAluno] = useState("");
  const [rg, setRG] = useState("");
  const [telefone, setTelefone] = useState("");

  const handleSalvarDados = () => {
    console.log('Dados salvos!');
  };

  return (
    <SafeAreaView style={styles.container}>
      
      <CustomNavBar userType="orientador" />

      <ScrollView contentContainerStyle={styles.content}>
        <CustomSearch />

        <CustomContainer title="Informações do Aluno">
          <CustomInput label="Nome do aluno" placeholder="Digite o nome do aluno" onChangeText={setNome} />
          <CustomInput label="RA do aluno" placeholder="000000000000" onChangeText={setRA} />
          <CustomInput label="Curso do aluno" placeholder="Digite o nome do curso" onChangeText={setCursoAluno} />
          <CustomInput label="Numero do RG" placeholder="000000000-00" onChangeText={setRG} />
          <CustomInput label="Telefone Celular" placeholder="(99) 99999-9999" onChangeText={setTelefone} />   
          <hr/>
          <CustomButton title="Enviar" type="primary" onPress={handleSalvarDados} />
          <hr/>
        </CustomContainer>
      </ScrollView>
    </SafeAreaView>
  );
}
