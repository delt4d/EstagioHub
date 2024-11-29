import React, { useEffect, useState } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { Input, Icon, Text } from 'react-native-elements';
import styles from './styles';

interface CustomInputProps {
  label: string;
  placeholder: string;
  iconName?: string;
  errorMessage?: string;
  inputStyle?: object;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({ label, placeholder, iconName, errorMessage, inputStyle,
onChangeText, secureTextEntry, ...props }) => {
  
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View>
      <Text style={styles.labelStyle}>{label}</Text>
      <Input
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        containerStyle={[styles.inputContainer, { borderWidth: 0, borderColor: 'transparent' }]}
        placeholder={placeholder}
        rightIcon={
          iconName === 'eye' ? (
            <Icon
              type="material-community"
              name={showPassword ? 'eye-off' : 'eye'}
              onPress={togglePasswordVisibility}
              containerStyle={{ cursor: 'pointer'}}
              iconStyle={ styles.iconStyle }
            />
          ) : iconName ? (
            <Icon type="material-community" name={iconName} />
          ) : undefined
        }
        errorStyle={styles.errorStyle}
        errorMessage={errorMessage && errorMessage.trim() ? errorMessage : undefined}
        inputStyle={[styles.inputStyle, { borderWidth: 0, borderColor: 'transparent' }]}
        inputContainerStyle={[styles.inputContainerStyle, { borderBottomWidth: 0, borderColor: 'transparent', borderWidth: 0 }]}
        onChangeText={onChangeText}
        style={{
          ...styles.style,
          ...(isFocused ? { borderWidth: 0, borderColor: 'transparent' } : {}),
        }}        
        secureTextEntry={iconName === 'eye' ? !showPassword : secureTextEntry}
        {...props}
      />
    </View>
  );
};

export default CustomInput;
