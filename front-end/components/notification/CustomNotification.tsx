import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';

interface CustomNotificationProps 
{
  textNotification: string;
}

const CustomNotification: React.FC<CustomNotificationProps> = ({ textNotification }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.boldText}>{textNotification}</Text>
    </View>
  );
};

export default CustomNotification;
