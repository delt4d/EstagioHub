import React from 'react';
import { View, TextInput } from 'react-native';
import { Icon } from 'react-native-elements';
import CustomButton from '../button/CustomButton';
import styles from './styles';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <View style={styles.container}>

      {/* Barra de pesquisa */}
      <View style={styles.searchContainer}>
        <Icon name="magnify" type="material-community" color="#000" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Pesquisar"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Botão de pesquisa */}
      <CustomButton 
        title="    Pesquisar    " 
        type="primary" 
        onPress={() => console.log("Pesquisando...")}
        style={styles.button}
      />

    </View>
  );
};

export default SearchBar;
