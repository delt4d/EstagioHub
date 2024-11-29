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

  const [cnpj, setCNPJ] = useState("");
  const [NomeEmpresa, setNomeEmpresa] = useState("");
  const [NomeFantasia, setNomeFantasia] = useState("");
  const [cep, setCEP] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone1, setTelefone1] = useState("");
  const [telefone2, setTelefone2] = useState("");
  const [website, setWebsite] = useState("");
  
  const handleSalvarDados = () => {
    console.log('Dados salvos!');
  };

  return (
    <SafeAreaView style={styles.container}>
      
      <CustomNavBar userType="orientador" />

      <ScrollView contentContainerStyle={styles.content}>
        <CustomSearch />

        <CustomContainer title="Informações da Empresa">
          <CustomInput label="CNPJ da Empresa" placeholder="Digite o CNPJ da empresa" onChangeText={setCNPJ} />
          <CustomInput label="Nome Empresarial" placeholder="Digite seu nome" onChangeText={setNomeEmpresa} />
          <CustomInput label="Nome Fantasia" placeholder="999999999-99" onChangeText={setNomeFantasia} />
          <CustomInput label="CEP" placeholder="000000-00" onChangeText={setCEP} />
          <CustomInput label="Endereço" placeholder="Endereço da empresa, n° - Bairro, Cidade, Estado" onChangeText={setEndereco} />
          <CustomInput label="Telefone 1" placeholder="+99 (99) 99999-9999" onChangeText={setTelefone1} />
          <CustomInput label="Telefone 2" placeholder="+99 (99) 99999-9999" onChangeText={setTelefone2} />
          <CustomInput label="Website da empresa" placeholder="Cole o link do site da empresa" onChangeText={setWebsite} />     
          <hr/>
          <CustomButton title="Enviar" type="primary" onPress={handleSalvarDados} />
          <hr/>
        </CustomContainer>
      </ScrollView>
    </SafeAreaView>
  );
}
