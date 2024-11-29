import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

// Tela de index
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    flex: 1,
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  innerContainer: {
    width: width * 1.0,
  },
  link: {
    color: '#B11116',
    fontSize: 17,
    marginVertical: 10,
    textAlign: 'center',
    borderColor: '#B11116',
    borderBottomWidth: 1,
  },
  
  header: {
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
    marginVertical: 20,
    color: 'black',
  },
});

// =============================================================================

// Tela de login
const login = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    backgroundColor: 'transparent',
    width: '50%',
  },
  header: {
    fontSize: 24,
    fontWeight: 500,
    textAlign: 'center',
    marginBottom: 20,
  },
  divider: {
    height: 10,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
  },
  linkRecuperarSenha: {
    textAlign: 'left',
    fontSize: 17,
    fontWeight: 400,
    marginVertical: 10,
  },
  linkText: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 400,
    marginVertical: 10,
  },
  logoImage: {
    marginBottom: 10,
    alignSelf: 'center',
  },
  viewCheckBox: {
    flexDirection: 'row', 
    alignItems: 'center',
    paddingLeft: 0,
  },
});

// =============================================================================

// Tela de Cadastro
const cadastro = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    backgroundColor: 'transparent',
    width: '50%',
  },
  header: {
    fontSize: 24,
    fontWeight: 500,
    textAlign: 'center',
    marginBottom: 20,
  },
  divider: {
    height: 10,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
  },
  linkRecuperarSenha: {
    textAlign: 'left',
    fontSize: 17,
    fontWeight: 400,
    marginVertical: 10,
  },
  linkText: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 400,
    marginVertical: 10,
  },
  logoImage: {
    marginBottom: 10,
    alignSelf: 'center',
  },
  viewCheckBox: {
    flexDirection: 'row', 
    alignItems: 'center',
    paddingLeft: 0,
  },
});

// =============================================================================

// Tela de estagio
const estagio = StyleSheet.create({
  containerButton:
  {
    marginTop: 20,
  },
});

// =============================================================================

// Informações do Usuario - Configurações

const configuracoes = StyleSheet.create({
  informacaoPerfil: 
  {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingBottom: 10,
  },
  informacaoItem: 
  {
    backgroundColor: '#666666',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    width: '230%',
  },
  informacaoNome: 
  {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
    flexShrink: 1,
    flexWrap: 'wrap',
    maxWidth: '90%',
  },
  informacaoEmail: 
  {
    color: 'white',
    fontSize: 18,
    flexShrink: 1,
    flexWrap: 'wrap',
    maxWidth: '100%',  
  },
  botoesPerfil: 
  {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 10,
    marginRight: 25,
    marginLeft: 10,
    width: '25%',
  },
});

export { styles, login, cadastro, estagio, configuracoes };
