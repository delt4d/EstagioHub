import React from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import CustomBreadcrumb from '../breadcrumb/CustomBreadcrumb';
import styles from './styles';

interface HeaderProps {
  paths: string[];
  onNavigate: (index: number) => void;
}

const Header: React.FC<HeaderProps> = ({ paths, onNavigate }) => {
  return (
    <View style={styles.headerContainer}>

      {/* Breadcrumb */}
      <View style={styles.leftContainer}>
        <CustomBreadcrumb paths={paths} onNavigate={onNavigate} />
      </View>

      {/* Notificações */}
      <View style={styles.rightContainer}>
        <Icon
          name="notifications"
          type="material"
          size={30}
          color="blue"
          onPress={() => alert('Chamando função notificação')}
        />
      </View>
    </View>
  );
};

export default Header;
