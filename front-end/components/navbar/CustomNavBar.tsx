import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ListItem, Icon, Avatar, Image } from 'react-native-elements';
import { useRouter } from 'expo-router';
import styles from './styles';
import logo from '../../assets/images/LogoEstagioWhite.png';

interface NavMenuProps {
  userType: 'aluno' | 'orientador';
}

const NavMenu: React.FC<NavMenuProps> = ({ userType }) => {

  const router = useRouter();
  
  const [usuarioFoto, SetUsuarioFoto] = useState({ uri: 'https://randomuser.me/api/portraits/men/36.jpg' });
  const [usuario, setUsuario] = useState('Usuariano da Silva');
  const [email, setEmail] = useState('user.silva@fatec.sp.gov.br');
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const handlePressIn = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  const handlePressOut = () => {
    setActiveButton(null);
  };

  const alunoRoutes = [
    { name: 'Meu Estágio', icon: 'briefcase-clock', route: '/estagio' },
    { name: 'Meus Documentos', icon: 'file', route: '/documentos' },
    { name: 'Minhas Notificações', icon: 'bell', route: '/notificacoesAluno' },
    { name: 'Configurações', icon: 'cog', route: '/configuracoesAluno' }
  ];

  const orientadorRoutes = [
    { name: 'Empresas Registradas', icon: 'office-building', route: '/empresasRegistradas' },
    { name: 'Alunos Registrados', icon: 'account-group', route: '/alunosRegistrados' },
    { name: 'Cursos Registrados', icon: 'book-open-variant', route: '/cursosRegistrados' },
    { name: 'Minhas Notificações', icon: 'bell', route: '/notificacoesOrientador' },
    { name: 'Configurações', icon: 'cog', route: '/configuracoesOrientador' }
  ];

  const routes = userType === 'aluno' ? alunoRoutes : orientadorRoutes;

  const configuracoesRoute = userType === 'aluno' ? '/configuracoesAluno' : '/configuracoesOrientador';

  return (
    <View style={styles.navContainer}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push({ pathname: '/' })}>
          <Image source={logo} style={styles.logo} />
        </TouchableOpacity>
      </View>

      {/* Menu */}
      <View style={styles.menu}>
        {routes.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => router.push({ pathname: item.route, params: {} })}
            onPressIn={() => handlePressIn(item.name)}
            onPressOut={handlePressOut}
            style={[
              styles.menuItem,
              activeButton === item.name && styles.menuItemActive
            ]}
          >
            <ListItem containerStyle={styles.menuItem}>
              <Icon name={item.icon} type="material-community" color="white" />
              <ListItem.Content>
                <ListItem.Title style={styles.menuTitle}>{item.name}</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          </TouchableOpacity>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <ListItem containerStyle={styles.footerItem} bottomDivider onPress={() => router.push(configuracoesRoute)}>
          <Avatar rounded source={usuarioFoto} />
          <ListItem.Content>
            <ListItem.Title style={styles.footerName}>{usuario}</ListItem.Title>
            <ListItem.Subtitle style={styles.footerEmail}>{email}</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      </View>
    </View>
  );
};

export default NavMenu;
