import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

interface CustomBreadcrumbProps {
  paths: string[];
  onNavigate: (index: number) => void;
}

const CustomBreadcrumb: React.FC<CustomBreadcrumbProps> = ({ paths, onNavigate }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {paths.map((path, index) => (
        <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
          {index > 0 && <Icon name="chevron-right" size={16} />}
          <TouchableOpacity onPress={() => onNavigate(index)}>
            <Text style={{ fontSize: 16, color: 'blue' }}>
              {path}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

export default CustomBreadcrumb;
