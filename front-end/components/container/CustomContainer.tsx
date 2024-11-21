import React from 'react';
import { View, Text } from 'react-native'; 
import styles from './styles';

interface CustomContainerProps 
{
  children: React.ReactNode;
  title: string;
}

const CustomContainer: React.FC<CustomContainerProps> = ({ children, title }) => {
  return (
    <View style={styles.container}>
      
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Conteudos */}
      <View style={styles.childrenContainer}>
        {children}
      </View>
      
    </View>
  );
};

export default CustomContainer;
