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
  const [departamento, setDepartamento] = useState(""); 
  const [nomeSupervisor, setNomeSupervisor] = useState(""); 
  const [cargoSupervisor, setCargoSupervisor] = useState("");
  const [emailSupervisor, setEmailSupervisor] = useState("");

  const handleSalvarDados = () => {
    console.log('Dados salvos!');
  };

  return (
    <SafeAreaView style={styles.container}>
      
      <CustomNavBar userType="aluno" />

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
        </CustomContainer>

        <CustomContainer title="Informações do Estágio">
          <CustomInput label="Departamento de aplicação do estágio" placeholder="Digite o departamento" onChangeText={setDepartamento} />
          <CustomInput label="Nome do supervisor de estágio" placeholder="Digite o nome do supervisor" onChangeText={setNomeSupervisor} />
          <CustomInput label="Cargo do supervisor de estágio" placeholder="Digite o cargo do supervisor" onChangeText={setCargoSupervisor} />
          <CustomInput label="Email do supervisor de estágio" placeholder="Digite o email do supervisor" onChangeText={setEmailSupervisor} />
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <CustomInput label="Estagio obrigatorio?" placeholder="Sim / Não " onChangeText={setEmailSupervisor} />
          <CustomInput label="Data de inicio do estagio" placeholder="00/00/0000" onChangeText={setEmailSupervisor} />
          <CustomInput label="Data de termino do estagio" placeholder="00/00/0000" onChangeText={setEmailSupervisor} />
          <CustomInput label="Dias de estagio" placeholder="Ex. Segunda, Terça e Quarta" onChangeText={setEmailSupervisor} />
          <CustomInput label="Horario de estagio" placeholder="Ex. 06:30 ás 12:30" onChangeText={setEmailSupervisor} />
          <CustomInput label="Valor da bolsa do estagio" placeholder="R$ 0,00" onChangeText={setEmailSupervisor} />
          <CustomInput label="Auxilio Transporte" placeholder="R$ 0,00" onChangeText={setEmailSupervisor} />
          <CustomInput label="Situação de Trabalho" placeholder="Presencial / Hibrido / Remoto" onChangeText={setEmailSupervisor} />
          <CustomInput label="Resumo das Atividades do estagio" placeholder="Faça um breve resumo aqui" onChangeText={setEmailSupervisor} />
          <hr/>
          <CustomButton title="Enviar" type="primary" onPress={handleSalvarDados} />
          <hr/>
        </CustomContainer>
      </ScrollView>
    </SafeAreaView>
  );
}
