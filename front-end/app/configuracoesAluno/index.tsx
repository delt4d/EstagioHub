import React, { useState } from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
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
  const [rg, setRG] = useState("");
  const [telefone, setTelefone] = useState("");
  const [residencial, setResidencial] = useState("");
  const [cep, setCEP] = useState("");
  const [endereco, setEndereco] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");

  const handleAlterarEmail = () => {};
  const handleAlterarSenha = () => {};
  const handleSalvarDados = () => {};

  return (
    <SafeAreaView style={styles.container}>
      
      <CustomNavBar userType="aluno" />

      <ScrollView contentContainerStyle={styles.content}>
        <CustomSearch />

        <CustomContainer title="Informações de Usuário">
          <View style={configuracoes.informacaoPerfil}>
            <ListItem containerStyle={configuracoes.informacaoItem} bottomDivider>
              <Avatar rounded source={usuarioFoto} size="large" />
              <ListItem.Content>
                <ListItem.Title style={configuracoes.informacaoNome}>{usuario}</ListItem.Title>
                <ListItem.Subtitle style={configuracoes.informacaoEmail}>{email}</ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
            <View style={configuracoes.botoesPerfil}>
              <CustomButton
                title="Alterar Email"
                type="primary"
                onPress={handleAlterarEmail}
              />
              <br />
              <CustomButton
                title="Alterar Senha"
                type="primary"
                onPress={handleAlterarSenha}
              />
            </View>
          </View>
        </CustomContainer>

        <CustomContainer title="Informações Institucionais">

          <CustomInput label="RA do aluno" placeholder="0000000000000" onChangeText={setNome} />
          <CustomInput label="Nome da instuição" placeholder="Digite o nome da instituição" onChangeText={setRG} />
          <CustomInput label="Curso do aluno" placeholder="Digite o seu curso" onChangeText={setTelefone} />
          <br />
          <CustomButton title="Salvar" type="primary" onPress={handleSalvarDados} />
          <br />

        </CustomContainer>

        <CustomContainer title="Informações Pessoais">

          <CustomInput label="Nome Completo" placeholder="Digite seu nome" onChangeText={setNome} />
          <CustomInput label="Número do RG" placeholder="999999999-99" onChangeText={setRG} />
          <CustomInput label="Telefone Celular" placeholder="(99) 99999-9999" onChangeText={setTelefone} />
          <CustomInput label="Telefone Residencial" placeholder="(99) 99999-9999" onChangeText={setResidencial} />
          <CustomInput label="CEP" placeholder="000000-00" onChangeText={setCEP} />
          <CustomInput label="Endereço Residencial" placeholder="Digite seu endereço, n°" onChangeText={setEndereco} />
          <CustomInput label="Bairro" placeholder="Digite seu bairro" onChangeText={setBairro} />
          <CustomInput label="Cidade" placeholder="Digite sua cidade" onChangeText={setCidade} />
          <CustomInput label="Estado" placeholder="Digite seu estado" onChangeText={setEstado} />
          <br />
          <CustomButton title="Enviar" type="primary" onPress={handleSalvarDados} />
          <br />

        </CustomContainer>

        <br />

      </ScrollView>
    </SafeAreaView>
  );
}
